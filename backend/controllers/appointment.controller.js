const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Appointment = require('../models/appointment'); 
const User = require('../models/User'); 
const Doctor = require('../models/Doctor'); 
const { createNotification } = require('../utils/notification.utils'); 

exports.createAppointment = asyncHandler(async (req, res, next) => {
  const patientId = req.user.id; 

  const {
    doctorId, 
    appointmentDate,
    appointmentTime,
    reason,
    consultationType, 
  } = req.body;

  if (!doctorId || !appointmentDate || !appointmentTime || !reason || !consultationType) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide all required fields for the appointment (doctorId, appointmentDate, appointmentTime, reason, consultationType).'));
  }

  const doctorUser = await User.findById(doctorId);
  if (!doctorUser || doctorUser.role !== 'doctor') {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found or user is not a doctor.'));
  }

  const doctorRecord = await Doctor.findOne({ user: doctorId });
  if (!doctorRecord) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor profile not found.'));
  }

  const [hours, minutes] = appointmentTime.split(':').map(Number);
  let requestedDateObject = new Date(appointmentDate);

  if (isNaN(requestedDateObject.getTime())) {
    requestedDateObject = new Date(appointmentDate.split('T')[0]); 
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
    doctor: doctorRecord.user._id, 
    appointmentDate: new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate()),
    appointmentTime: appointmentTime,         
    status: { $in: ['pending', 'confirmed'] } 
  });

  if (conflictingAppointment) {
    return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the selected date and time. Please choose a different slot.'));
  }

  const appointment = new Appointment({
    patient: patientId,
    doctor: doctorRecord.user._id, 
    appointmentDate: new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate()),
    appointmentTime,
    reason,
    consultationType,
    status: 'pending', 
  });

  const populatedAppointmentForNotif = await Appointment.findById(appointment._id).populate('patient', 'firstName lastName');
  const patientName = populatedAppointmentForNotif.patient ? `${populatedAppointmentForNotif.patient.firstName} ${populatedAppointmentForNotif.patient.lastName}` : 'A patient';

  if (populatedAppointmentForNotif && doctorRecord && doctorRecord.user) {
    await createNotification(
      doctorRecord.user._id.toString(),
      'New Appointment Request',
      `${patientName} has requested an appointment with you on ${appointmentDate} at ${appointmentTime}. Reason: ${reason}.`,
      'appointment',
      appointment._id.toString(),
      'Appointment'
    );
  }

  res.status(201).json(new ApiResponse(201, appointment, 'Appointment requested successfully. Awaiting confirmation.'));
});

exports.getAppointments = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  let query = {};

  if (userRole === 'patient') {
    query.patient = userId;
  } else if (userRole === 'doctor') {
    query.doctor = userId;
  } else {
    return res.status(403).json(new ApiResponse(403, null, 'User role not authorized to view appointments.'));
  }
  if (req.query.status) {
    query.status = req.query.status;
  }

  const appointments = await Appointment.find(query)
    .populate('patient', 'firstName lastName email profilePictureUrl')
    .populate('doctor', 'firstName lastName email profilePictureUrl specialization')
    .sort({ appointmentDate: -1, appointmentTime: -1 });

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

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  const isPatientOfAppointment = appointment.patient.toString() === userId;
  const isDoctorOfAppointment = appointment.doctor.toString() === userId;

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

  const populatedAppointmentForNotif = await Appointment.findById(appointment._id)
    .populate('patient', 'firstName lastName')
    .populate('doctor', 'firstName lastName');

  const patientName = populatedAppointmentForNotif.patient ? `${populatedAppointmentForNotif.patient.firstName} ${populatedAppointmentForNotif.patient.lastName}` : 'The patient';
  const doctorName = populatedAppointmentForNotif.doctor ? `Dr. ${populatedAppointmentForNotif.doctor.firstName} ${populatedAppointmentForNotif.doctor.lastName}` : 'your doctor';
  const appointmentDateTime = populatedAppointmentForNotif.appointmentDate && populatedAppointmentForNotif.appointmentTime ? `on ${new Date(populatedAppointmentForNotif.appointmentDate).toLocaleDateString()} at ${populatedAppointmentForNotif.appointmentTime}` : 'for the scheduled time';

  let notificationUserId = null;
  let notificationTitle = '';
  let notificationMessage = '';

  if (userRole === 'doctor' && populatedAppointmentForNotif.patient) {
    notificationUserId = populatedAppointmentForNotif.patient._id.toString();
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
  } else if (userRole === 'patient' && populatedAppointmentForNotif.doctor) {
    if (status === 'cancelled') {
      notificationUserId = populatedAppointmentForNotif.doctor._id.toString();
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
  }

  res.status(200).json(new ApiResponse(200, appointment, `Appointment status updated to '${status}'.`));
});

exports.getAppointmentById = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  const appointment = await Appointment.findById(appointmentId)
    .populate('patient', 'firstName lastName email profilePictureUrl')
    .populate('doctor', 'firstName lastName email profilePictureUrl specialization');

  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  const isPatientOfAppointment = appointment.patient._id.toString() === userId;
  const isDoctorOfAppointment = appointment.doctor._id.toString() === userId;

  if (!isPatientOfAppointment && !isDoctorOfAppointment) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to view this appointment.'));
  }

  res.status(200).json(new ApiResponse(200, appointment, 'Appointment details fetched successfully.'));
});

exports.updateAppointmentDetails = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;
  const { appointmentDate, appointmentTime, reason, consultationType } = req.body;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  if (appointment.patient.toString() !== userId) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to update this appointment\'s details.'));
  }

  if (!['pending', 'confirmed'].includes(appointment.status)) {
    return res.status(400).json(new ApiResponse(400, null, `Appointment cannot be updated as its status is '${appointment.status}'.`));
  }

  if (!appointmentDate && !appointmentTime && !reason && !consultationType) {
    return res.status(400).json(new ApiResponse(400, null, 'No details provided for update.'));
  }
  
  if (appointmentDate || appointmentTime) {
    const newDateStr = appointmentDate || appointment.appointmentDate.toISOString().split('T')[0];
    const newTimeStr = appointmentTime || appointment.appointmentTime;

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
      appointmentDate: new Date(newDateObject.getFullYear(), newDateObject.getMonth(), newDateObject.getDate()),
      appointmentTime: newTimeStr,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the newly selected date and time. Please choose a different slot.'));
    }

    appointment.appointmentDate = new Date(newDateObject.getFullYear(), newDateObject.getMonth(), newDateObject.getDate());
    appointment.appointmentTime = newTimeStr;

    
    if (appointment.status === 'confirmed') {
      appointment.status = 'pending'; 
    }
  }

  if (reason) appointment.reason = reason;
  if (consultationType) appointment.consultationType = consultationType;

  const originalReason = appointment.reason;
  const originalConsultationType = appointment.consultationType;

  const updatedAppointment = await appointment.save();

  const populatedAppointmentForNotif = await Appointment.findById(updatedAppointment._id)
    .populate('patient', 'firstName lastName')
    .populate('doctor', 'firstName lastName');

  const patientName = populatedAppointmentForNotif.patient ? `${populatedAppointmentForNotif.patient.firstName} ${populatedAppointmentForNotif.patient.lastName}` : 'The patient';
  const newDateTime = populatedAppointmentForNotif.appointmentDate && populatedAppointmentForNotif.appointmentTime ? `on ${new Date(populatedAppointmentForNotif.appointmentDate).toLocaleDateString()} at ${populatedAppointmentForNotif.appointmentTime}` : 'at the new time';

  if (populatedAppointmentForNotif.doctor) {
    let changeSummary = [];
    if ((req.body.appointmentDate && new Date(req.body.appointmentDate).toISOString() !== new Date(appointment.appointmentDate).toISOString()) || 
        (req.body.appointmentTime && req.body.appointmentTime !== appointment.appointmentTime)) {
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
        populatedAppointmentForNotif.doctor._id.toString(),
        'Appointment Details Updated by Patient',
        `${patientName} has updated their appointment. Details: ${changeSummary.join(', ')}. Please review. `,
        'appointment',
        updatedAppointment._id.toString(),
        'Appointment'
      );
    }
  }

  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment details updated successfully.'));
});
