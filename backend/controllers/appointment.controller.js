const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Appointment = require('../models/Appointment'); 
const User = require('../models/User'); 
const Doctor = require('../models/Doctor'); 
const { createNotification } = require('../utils/notification.utils'); 
const { io } = require('../server');

exports.createAppointment = asyncHandler(async (req, res, next) => {
  const patientId = req.user.id; 
  const {
    doctorId, 
    date,
    time,
    reason,
    type, 
  } = req.body;
  if (!doctorId || !date || !time || !reason || !type) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide all required fields for the appointment (doctorId, date, time, reason, type).'));
  }
  const doctorUser = await User.findById(doctorId);
  if (!doctorUser || doctorUser.role !== 'doctor') {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found or user is not a doctor.'));
  }
  const doctorRecord = await Doctor.findOne({ user: doctorId });
  if (!doctorRecord) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor profile not found.'));
  }
  const [hours, minutes] = time.split(':').map(Number);
  let requestedDateObject = new Date(date);
  if (isNaN(requestedDateObject.getTime())) {
    requestedDateObject = new Date(date.split('T')[0]); 
    if(isNaN(requestedDateObject.getTime())){
        return res.status(400).json(new ApiResponse(400, null, 'Invalid appointment date format. Please use YYYY-MM-DD.'));
    }
  }
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid appointment time format. Please use HH:MM.'));
  }
  const requestedDateTime = new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate(), hours, minutes);
  const now = new Date();
  now.setSeconds(0, 0);
  if (requestedDateTime < now) { 
    return res.status(400).json(new ApiResponse(400, null, 'Appointment date and time must be in the future.'));
  }
  const conflictingAppointment = await Appointment.findOne({
    doctor: doctorRecord._id,
    date: new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate()),
    time: time,         
    status: { $in: ['pending', 'confirmed'] } 
  });
  if (conflictingAppointment) {
    return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the selected date and time. Please choose a different slot.'));
  }
  const patient = await require('../models/Patient').findOne({ user: patientId });
  if (!patient) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
  }

  const appointment = new Appointment({
    patient: patient._id,
    doctor: doctorRecord._id,
    date: new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate()),
    time,
    reason,
    type,
    status: 'pending', 
  });
  
  await appointment.save();
  
  const populatedAppointmentForNotif = await Appointment.findById(appointment._id)
    .populate({
      path: 'patient',
      select: 'user',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    });
  const patientName = populatedAppointmentForNotif.patient.user ? `${populatedAppointmentForNotif.patient.user.firstName} ${populatedAppointmentForNotif.patient.user.lastName}` : 'A patient';
  if (populatedAppointmentForNotif && doctorRecord && doctorRecord.user) {
    await createNotification(
      doctorRecord.user._id.toString(),
      'New Appointment Request',
      `${patientName} has requested an appointment with you on ${date} at ${time}. Reason: ${reason}.`,
      'appointment',
      appointment._id.toString(),
      'Appointment'
    );
    io.to(doctorRecord.user._id.toString()).emit('appointment:update', {
      id: appointment._id.toString(),
      title: 'New Appointment Request',
      message: `${patientName} has requested an appointment with you on ${date} at ${time}. Reason: ${reason}.`,
      appointmentId: appointment._id.toString(),
      type: 'appointment',
      time: new Date().toISOString(),
    });
  }
  res.status(201).json(new ApiResponse(201, appointment, 'Appointment requested successfully. Awaiting confirmation.'));
});
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  let query = {};
  
  if (userRole === 'patient') {
    const patient = await require('../models/Patient').findOne({ user: userId });
    if (!patient) {
      return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    query.patient = patient._id; 
  } else if (userRole === 'doctor') {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
    }
    query.doctor = doctor._id; 
  } else {
    return res.status(403).json(new ApiResponse(403, null, 'User role not authorized to view appointments.'));
  }
  
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  const appointments = await Appointment.find(query)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email profileImage'
      }
    })
    .populate({
      path: 'doctor',
      select: 'user specialty',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    })
    .sort({ date: -1, time: -1 });
  
  res.status(200).json(new ApiResponse(200, appointments, 'Appointments fetched successfully.'));
});
exports.updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;
  const { status } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;
  if (!status) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide a status.'));
  }
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: 'patient',
      select: 'user',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    })
    .populate({
      path: 'doctor',
      select: 'user',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }
  const isPatientOfAppointment = appointment.patient.user._id.toString() === userId;
  const isDoctorOfAppointment = appointment.doctor.user._id.toString() === userId;
  if (!isPatientOfAppointment && !isDoctorOfAppointment) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to update this appointment.'));
  }
  const allowedTransitions = {
    pending: {
      doctor: ['confirmed', 'cancelled'],
      patient: ['cancelled'],
    },
    confirmed: {
      doctor: ['cancelled', 'completed'],
      patient: ['cancelled'], 
    },
  };
  const currentStatus = appointment.status;
  const allowedNextStatuses = allowedTransitions[currentStatus]?.[userRole];
  if (!allowedNextStatuses || !allowedNextStatuses.includes(status)) {
    return res.status(400).json(new ApiResponse(400, null, `Cannot change status from '${currentStatus}' to '${status}' or user role not permitted for this change.`));
  }
  if (currentStatus === 'completed' || currentStatus === 'cancelled') {
      return res.status(400).json(new ApiResponse(400, null, `Appointment is already ${currentStatus} and cannot be updated further.`));
  }
  appointment.status = status;
  await appointment.save();
  const patientName = appointment.patient.user ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : 'The patient';
  const doctorName = appointment.doctor.user ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : 'your doctor';
      const appointmentDateTime = populatedAppointmentForNotif.date && populatedAppointmentForNotif.time ? `on ${new Date(populatedAppointmentForNotif.date).toLocaleDateString()} at ${populatedAppointmentForNotif.time}` : 'for the scheduled time';
  let notificationUserId = null;
  let notificationTitle = '';
  let notificationMessage = '';
  if (userRole === 'doctor' && appointment.patient) {
    notificationUserId = appointment.patient.user._id.toString();
    switch (status) {
      case 'confirmed':
        notificationTitle = 'Appointment Confirmed';
        notificationMessage = `Your appointment with ${doctorName} ${appointmentDateTime} has been confirmed.`;
        break;
      case 'cancelled':
        notificationTitle = 'Appointment Cancelled by Doctor';
        notificationMessage = `Your appointment with ${doctorName} ${appointmentDateTime} has been cancelled by the doctor.`;
        break;
      case 'completed':
        notificationTitle = 'Appointment Completed';
        notificationMessage = `Your appointment with ${doctorName} ${appointmentDateTime} has been marked as completed.`;
        break;
    }
  } else if (userRole === 'patient' && appointment.doctor) {
    if (status === 'cancelled') {
      notificationUserId = appointment.doctor.user._id.toString();
      notificationTitle = 'Appointment Cancelled by Patient';
      notificationMessage = `The appointment with ${patientName} ${appointmentDateTime} has been cancelled by the patient.`;
    }
  }
  if (notificationUserId && notificationTitle && notificationMessage) {
    await createNotification(
      notificationUserId,
      notificationTitle,
      notificationMessage,
      'appointment',
      appointment._id.toString(),
      'Appointment'
    );
    io.to(notificationUserId).emit('appointment:update', {
      id: appointment._id.toString(),
      title: notificationTitle,
      message: notificationMessage,
      appointmentId: appointment._id.toString(),
      type: 'appointment',
      time: new Date().toISOString(),
    });
  }
  res.status(200).json(new ApiResponse(200, appointment, `Appointment status updated to '${status}'.`));
});
exports.getAppointmentById = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: 'patient',
      select: 'user firstName lastName email profileImage',
      populate: {
        path: 'user',
        select: 'firstName lastName email profileImage'
      }
    })
    .populate({
      path: 'doctor',
      select: 'user specialty',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }
  const isPatientOfAppointment = appointment.patient.user._id.toString() === userId;
  const isDoctorOfAppointment = appointment.doctor.user._id.toString() === userId;
  if (!isPatientOfAppointment && !isDoctorOfAppointment) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to view this appointment.'));
  }
  res.status(200).json(new ApiResponse(200, appointment, 'Appointment details fetched successfully.'));
});
exports.updateAppointmentDetails = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;
  const { date, time, reason, consultationType } = req.body;
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: 'patient',
      select: 'user',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }
  if (appointment.patient.user._id.toString() !== userId) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to update this appointment\'s details.'));
  }
  if (!['pending', 'confirmed'].includes(appointment.status)) {
    return res.status(400).json(new ApiResponse(400, null, `Appointment cannot be updated as its status is '${appointment.status}'.`));
  }
  if (!date && !time && !reason && !consultationType) {
    return res.status(400).json(new ApiResponse(400, null, 'No details provided for update.'));
  }
  if (date || time) {
    const newDateStr = date || appointment.date.toISOString().split('T')[0];
    const newTimeStr = time || appointment.time;
    const [hours, minutes] = newTimeStr.split(':').map(Number);
    let newDateObject = new Date(newDateStr);
    if (isNaN(newDateObject.getTime())) {
      newDateObject = new Date(newDateStr.split('T')[0]);
      if(isNaN(newDateObject.getTime())){
          return res.status(400).json(new ApiResponse(400, null, 'Invalid new appointment date format. Please use YYYY-MM-DD.'));
      }
    }
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid new appointment time format. Please use HH:MM.'));
    }
    const newRequestedDateTime = new Date(newDateObject.getFullYear(), newDateObject.getMonth(), newDateObject.getDate(), hours, minutes);
    const now = new Date();
    now.setSeconds(0, 0);
    if (newRequestedDateTime < now) {
      return res.status(400).json(new ApiResponse(400, null, 'New appointment date and time must be in the future.'));
    }
    const conflictingAppointment = await Appointment.findOne({
      _id: { $ne: appointmentId }, 
      doctor: appointment.doctor,   
      date: new Date(newDateObject.getFullYear(), newDateObject.getMonth(), newDateObject.getDate()),
      time: newTimeStr,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (conflictingAppointment) {
      return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the newly selected date and time. Please choose a different slot.'));
    }
    appointment.date = new Date(newDateObject.getFullYear(), newDateObject.getMonth(), newDateObject.getDate());
    appointment.time = newTimeStr;
    if (appointment.status === 'confirmed') {
      appointment.status = 'pending'; 
    }
  }
  if (reason) appointment.reason = reason;
  if (consultationType) appointment.consultationType = consultationType;
  const originalReason = appointment.reason;
  const originalConsultationType = appointment.consultationType;
  const updatedAppointment = await appointment.save();
  const patientName = appointment.patient.user ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : 'The patient';
  const newDateTime = appointment.date && appointment.time ? `on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}` : 'at the new time';
  if (appointment.doctor) {
    let changeSummary = [];
    if ((req.body.date && new Date(req.body.date).toISOString() !== new Date(appointment.date).toISOString()) || 
        (req.body.time && req.body.time !== appointment.time)) {
      changeSummary.push(`rescheduled to ${newDateTime}`);
    }
    if (req.body.reason && req.body.reason !== originalReason) { 
      changeSummary.push(`reason updated to "${req.body.reason}"`);
    }
    if (req.body.consultationType && req.body.consultationType !== originalConsultationType) {
      changeSummary.push(`consultation type updated to "${req.body.consultationType}"`);
    }
    if (changeSummary.length > 0) {
      await createNotification(
        appointment.doctor._id.toString(),
        'Appointment Details Updated by Patient',
        `${patientName} has updated their appointment. Details: ${changeSummary.join(', ')}. Please review. `,
        'appointment',
        updatedAppointment._id.toString(),
        'Appointment'
      );
      io.to(appointment.doctor._id.toString()).emit('appointment:update', {
        id: updatedAppointment._id.toString(),
        title: 'Appointment Details Updated by Patient',
        message: `${patientName} has updated their appointment. Details: ${changeSummary.join(', ')}. Please review.`,
        appointmentId: updatedAppointment._id.toString(),
        type: 'appointment',
        time: new Date().toISOString(),
      });
    }
  }
  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment details updated successfully.'));
});

exports.requestReschedule = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;
  const { requestedDate, requestedTime, preferredTimes, reason, notes } = req.body;
  
  console.log('Received reschedule request:', {
    appointmentId,
    userId,
    requestedDate,
    requestedTime,
    preferredTimes,
    reason,
    notes,
    body: req.body
  });

  if (!reason) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide reason for reschedule.'));
  }

  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: 'patient',
      select: 'user firstName lastName',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    })
    .populate({
      path: 'doctor',
      select: 'user specialty',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    });

  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  if (appointment.patient.user._id.toString() !== userId) {
    return res.status(403).json(new ApiResponse(403, null, 'You are not authorized to request reschedule for this appointment.'));
  }

  const allowedStatuses = ['accepted', 'scheduled', 'rescheduled'];
  console.log('Checking appointment status:', {
    appointmentStatus: appointment.status,
    allowedStatuses,
    isAllowed: allowedStatuses.includes(appointment.status)
  });
  if (!allowedStatuses.includes(appointment.status)) {
    return res.status(400).json(new ApiResponse(400, null, `Cannot request reschedule for appointment with status '${appointment.status}'.`));
  }

   console.log('Skipping 24-hour restriction check for reschedule request');

  let requestedDateObject = null;
  if (requestedDate && requestedTime) {
    const [hours, minutes] = requestedTime.split(':').map(Number);
    requestedDateObject = new Date(requestedDate);
    if (isNaN(requestedDateObject.getTime())) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid requested date format. Please use YYYY-MM-DD.'));
    }

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid requested time format. Please use HH:MM.'));
    }

    const requestedDateTime = new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate(), hours, minutes);
    const now = new Date();
    now.setSeconds(0, 0);
    if (requestedDateTime < now) {
      return res.status(400).json(new ApiResponse(400, null, 'Requested date and time must be in the future.'));
    }

    const conflictingAppointment = await Appointment.findOne({
      doctor: appointment.doctor._id,
      date: new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate()),
      time: requestedTime,
      status: { $in: ['pending', 'confirmed', 'accepted', 'scheduled', 'rescheduled'] },
      _id: { $ne: appointmentId }
    });

    if (conflictingAppointment) {
      return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the requested date and time. Please choose a different slot.'));
    }
  }

 
  appointment.status = 'reschedule_requested';
  appointment.rescheduleRequest = {
    requestedDate: requestedDateObject || null,
    requestedTime: requestedTime || null,
    preferredTimes: preferredTimes || [],
    reason,
    notes,
    requestedAt: new Date()
  };
  
  console.log('Updating reschedule request data:', {
    appointmentId: appointment._id,
    currentDate: appointment.date,
    currentTime: appointment.time,
    rescheduleRequest: appointment.rescheduleRequest
  });

  await appointment.save();

  const patientName = appointment.patient.user ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : 'A patient';
  const doctorUserId = appointment.doctor.user._id;
  
  let notificationMessage = `${patientName} has requested to reschedule their appointment currently scheduled for ${appointment.date.toLocaleDateString()} at ${appointment.time}.`;
  
  if (requestedDateObject && requestedTime) {
    notificationMessage += ` They prefer ${requestedDateObject.toLocaleDateString()} at ${requestedTime}.`;
  } else {
    notificationMessage += ` They have provided preferred times in the notes.`;
  }
  
  notificationMessage += ` Reason: ${reason}.`;
  
  await createNotification(
    doctorUserId.toString(),
    'Reschedule Request',
    notificationMessage,
    'appointment',
    appointment._id.toString(),
    'Appointment'
  );
  io.to(doctorUserId.toString()).emit('appointment:update', {
    id: appointment._id.toString(),
    title: 'Reschedule Request',
    message: notificationMessage,
    appointmentId: appointment._id.toString(),
    type: 'appointment',
    time: new Date().toISOString(),
  });

  res.status(200).json(new ApiResponse(200, appointment, 'Reschedule request submitted successfully. Awaiting doctor approval.'));
});
