const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Appointment = require('../../models/Appointment');
const Doctor = require('../../models/Doctor');
const notificationService = require('../../utils/notificationService');
const Patient = require('../../models/Patient');

exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log('DEBUG: req.user.id:', userId);
  const doctor = await Doctor.findOne({ user: userId });
  console.log('DEBUG: Found doctor:', doctor);
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  const query = { doctor: doctor._id };
  if (req.query.status) {
    query.status = req.query.status;
  }
  console.log('DEBUG: Appointment query:', query);
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
  console.log('DEBUG: Appointments found:', appointments.length);
  res.status(200).json(new ApiResponse(200, appointments, 'Doctor appointments fetched successfully.'));
});

exports.acceptAppointment = asyncHandler(async (req, res) => {
  console.log('Backend: Accept appointment called');
  console.log('Backend: req.user.id:', req.user.id);
  console.log('Backend: req.params:', req.params);
  console.log('Backend: req.body:', req.body);
  
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { date, time, location, doctorNotes } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  console.log('Backend: Found doctor:', doctor);
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  console.log('Backend: Found appointment:', appointment);
  console.log('Backend: Appointment status:', appointment?.status);
  console.log('Backend: Appointment ID:', appointment?._id);
  console.log('Backend: Doctor ID:', doctor._id);
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }


  console.log('Backend: Checking if appointment status is pending:', appointment.status === 'pending');
  if (appointment.status !== 'pending') {
    console.log('Backend: Appointment status is not pending, returning 400 error');
    return res.status(400).json(new ApiResponse(400, null, `Only pending appointments can be accepted. Current status: ${appointment.status}`));
  }

  const updateData = {
    status: 'accepted',
    doctorNotes: doctorNotes || appointment.doctorNotes
  };

  if (date) updateData.date = new Date(date);
  if (time) updateData.time = time;
  if (location) updateData.location = location;

  console.log('Backend: Update data:', updateData);

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true }
  ).populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  }).populate({
    path: 'doctor',
    select: 'user specialty',
    populate: {
      path: 'user',
      select: 'firstName lastName'
    }
  });

  console.log('Backend: Updated appointment:', updatedAppointment);

  // Emit real-time status update
  try {
    const { getIO } = require('../../utils/socket.utils');
    const io = getIO();
    
    // Emit to patient
    if (updatedAppointment.patient && updatedAppointment.patient.user) {
      io.to(updatedAppointment.patient.user._id.toString()).emit('appointment:status_changed', {
        appointmentId: updatedAppointment._id.toString(),
        status: updatedAppointment.status,
        message: `Your appointment status has been updated to: ${updatedAppointment.status}`,
        appointment: updatedAppointment
      });
    }

    // Emit to doctor
    if (updatedAppointment.doctor && updatedAppointment.doctor.user) {
      io.to(updatedAppointment.doctor.user._id.toString()).emit('appointment:status_changed', {
        appointmentId: updatedAppointment._id.toString(),
        status: updatedAppointment.status,
        message: `Appointment status updated to: ${updatedAppointment.status}`,
        appointment: updatedAppointment
      });
    }
  } catch (error) {
    console.error('Error emitting appointment status update:', error);
  }

  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment accepted successfully.'));
});

exports.rejectAppointment = asyncHandler(async (req, res) => {
  console.log('Backend: Reject appointment called');
  console.log('Backend: req.user.id:', req.user.id);
  console.log('Backend: req.params:', req.params);
  console.log('Backend: req.body:', req.body);
  
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { doctorNotes } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  console.log('Backend: Found doctor:', doctor);
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  console.log('Backend: Found appointment:', appointment);
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  if (appointment.status !== 'pending') {
    return res.status(400).json(new ApiResponse(400, null, 'Only pending appointments can be rejected.'));
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      status: 'rejected',
      doctorNotes: doctorNotes || appointment.doctorNotes
    },
    { new: true }
  ).populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  }).populate({
    path: 'doctor',
    select: 'user specialty',
    populate: {
      path: 'user',
      select: 'firstName lastName'
    }
  });

  console.log('Backend: Updated appointment:', updatedAppointment);

  // Emit real-time status update
  try {
    const { getIO } = require('../../utils/socket.utils');
    const io = getIO();
    
    console.log('🔔 Backend: Emitting appointment:status_changed for rejection');
    
    // Emit to patient
    if (updatedAppointment.patient && updatedAppointment.patient.user) {
      const patientUserId = updatedAppointment.patient.user._id.toString();
      console.log('🔔 Backend: Emitting to patient room:', patientUserId);
      io.to(patientUserId).emit('appointment:status_changed', {
        appointmentId: updatedAppointment._id.toString(),
        status: updatedAppointment.status,
        message: `Your appointment has been rejected`,
        appointment: updatedAppointment
      });
    }

    // Emit to doctor
    if (updatedAppointment.doctor && updatedAppointment.doctor.user) {
      const doctorUserId = updatedAppointment.doctor.user._id.toString();
      console.log('🔔 Backend: Emitting to doctor room:', doctorUserId);
      io.to(doctorUserId).emit('appointment:status_changed', {
        appointmentId: updatedAppointment._id.toString(),
        status: updatedAppointment.status,
        message: `Appointment rejected successfully`,
        appointment: updatedAppointment
      });
    }
    
    console.log('🔔 Backend: Rejection events emitted successfully');
  } catch (error) {
    console.error('❌ Backend: Error emitting rejection event:', error);
  }

  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment rejected successfully.'));
});

exports.updateAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { date, time, location, doctorNotes, patientNotes, reason, type, status } = req.body;

  console.log('Backend: Update appointment request:', { userId, appointmentId, body: req.body });

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  console.log('Backend: Found appointment:', { 
    id: appointment._id, 
    date: appointment.date, 
    time: appointment.time, 
    status: appointment.status,
    canBeModified: appointment.canBeModified()
  });

  if (!appointment.canBeModified()) {
    console.log('Backend: Appointment cannot be modified - within 24 hours');
    return res.status(400).json(new ApiResponse(400, null, 'Appointment cannot be modified within 24 hours of the scheduled time.'));
  }

  const updateData = {};
  if (date) updateData.date = new Date(date);
  if (time) updateData.time = time;
  if (location) updateData.location = location;
  if (doctorNotes !== undefined) updateData.doctorNotes = doctorNotes;
  if (patientNotes !== undefined) updateData.patientNotes = patientNotes;
  if (reason) updateData.reason = reason;
  if (type) updateData.type = type;
  if (status) updateData.status = status;

  if ((date || time) && !status) {
    updateData.status = 'rescheduled';
  }

  console.log('Backend: Update data:', updateData);

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true }
  ).populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  }).populate({
    path: 'doctor',
    select: 'user specialty',
    populate: {
      path: 'user',
      select: 'firstName lastName'
    }
  });

  console.log('Backend: Updated appointment:', updatedAppointment);

  // Emit real-time update
  try {
    const { getIO } = require('../../utils/socket.utils');
    const io = getIO();
    
    console.log('🔔 Backend: Emitting appointment:updated event');
    
    // Emit to patient
    if (updatedAppointment.patient && updatedAppointment.patient.user) {
      const patientUserId = updatedAppointment.patient.user._id.toString();
      console.log('🔔 Backend: Emitting to patient room:', patientUserId);
      io.to(patientUserId).emit('appointment:updated', {
        appointmentId: updatedAppointment._id.toString(),
        message: `Your appointment has been updated`,
        appointment: updatedAppointment
      });
    }

    // Emit to doctor
    if (updatedAppointment.doctor && updatedAppointment.doctor.user) {
      const doctorUserId = updatedAppointment.doctor.user._id.toString();
      console.log('🔔 Backend: Emitting to doctor room:', doctorUserId);
      io.to(doctorUserId).emit('appointment:updated', {
        appointmentId: updatedAppointment._id.toString(),
        message: `Appointment updated successfully`,
        appointment: updatedAppointment
      });
    }
    
    console.log('🔔 Backend: Update events emitted successfully');
  } catch (error) {
    console.error('❌ Backend: Error emitting update event:', error);
  }

  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment updated successfully.'));
});

exports.handleRescheduleRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { action, newDate, newTime, doctorNotes } = req.body;

  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json(new ApiResponse(400, null, 'Action must be either "approve" or "reject".'));
  }

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  if (appointment.status !== 'reschedule_requested') {
    return res.status(400).json(new ApiResponse(400, null, 'No reschedule request found for this appointment.'));
  }

  if (action === 'approve') {
    if (newDate && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      let newDateObject = new Date(newDate);
      if (isNaN(newDateObject.getTime())) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid new date format.'));
      }

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid new time format.'));
      }

      const conflictingAppointment = await Appointment.findOne({
        doctor: doctor._id,
        date: newDateObject,
        time: newTime,
        status: { $in: ['pending', 'confirmed', 'accepted', 'scheduled', 'rescheduled'] },
        _id: { $ne: appointmentId }
      });

      if (conflictingAppointment) {
        return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the new date and time.'));
      }

      appointment.date = newDateObject;
      appointment.time = newTime;
    } else {
      appointment.date = appointment.rescheduleRequest.requestedDate;
      appointment.time = appointment.rescheduleRequest.requestedTime;
    }

    appointment.status = 'rescheduled';
    appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
    
    appointment.rescheduleRequest = undefined;
  } else {
    appointment.status = appointment.rescheduleRequest.requestedDate ? 'scheduled' : 'accepted';
    appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
    
    appointment.rescheduleRequest = undefined;
  }

  const updatedAppointment = await appointment.save();

  // Populate the updated appointment for real-time events
  const populatedAppointment = await Appointment.findById(updatedAppointment._id)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email'
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

  const patientName = appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'The patient';
  const notificationMessage = action === 'approve' 
    ? `Your reschedule request has been approved. New appointment time: ${updatedAppointment.date.toLocaleDateString()} at ${updatedAppointment.time}.`
    : `Your reschedule request has been rejected. Your original appointment remains scheduled.`;

  await notificationService.sendAppointmentNotification(
    appointment.patient._id.toString(),
    {
      title: `Reschedule Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: notificationMessage,
      appointmentId: appointment._id.toString(),
      priority: 'high',
      data: {
        appointmentId: appointment._id.toString(),
        action,
        newDate: action === 'approve' ? updatedAppointment.date.toLocaleDateString() : null,
        newTime: action === 'approve' ? updatedAppointment.time : null,
        originalDate: appointment.date.toLocaleDateString(),
        originalTime: appointment.time
      }
    }
  );

  // Emit real-time reschedule request response
  try {
    const { getIO } = require('../../utils/socket.utils');
    const io = getIO();
    
    console.log('🔔 Backend: Emitting appointment:reschedule_requested event');
    
    // Emit to patient
    if (populatedAppointment.patient && populatedAppointment.patient.user) {
      const patientUserId = populatedAppointment.patient.user._id.toString();
      console.log('🔔 Backend: Emitting to patient room:', patientUserId);
      io.to(patientUserId).emit('appointment:reschedule_requested', {
        appointmentId: populatedAppointment._id.toString(),
        action: action,
        message: notificationMessage,
        appointment: populatedAppointment
      });
    }

    // Emit to doctor
    if (populatedAppointment.doctor && populatedAppointment.doctor.user) {
      const doctorUserId = populatedAppointment.doctor.user._id.toString();
      console.log('🔔 Backend: Emitting to doctor room:', doctorUserId);
      io.to(doctorUserId).emit('appointment:reschedule_requested', {
        appointmentId: populatedAppointment._id.toString(),
        action: action,
        message: `Reschedule request ${action}d successfully`,
        appointment: populatedAppointment
      });
    }
    
    console.log('🔔 Backend: Reschedule request events emitted successfully');
  } catch (error) {
    console.error('❌ Backend: Error emitting reschedule request event:', error);
  }

  res.status(200).json(new ApiResponse(200, updatedAppointment, `Reschedule request ${action}d successfully.`));
});

exports.completeAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { notes } = req.body;

  console.log('Backend: Complete appointment called');
  console.log('Backend: req.user.id:', req.user.id);
  console.log('Backend: req.params:', req.params);
  console.log('Backend: req.body:', req.body);

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  // Only allow completing appointments that are accepted, scheduled, or rescheduled
  const allowedStatuses = ['accepted', 'scheduled', 'rescheduled'];
  if (!allowedStatuses.includes(appointment.status)) {
    return res.status(400).json(new ApiResponse(400, null, `Cannot complete appointment with status '${appointment.status}'.`));
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      status: 'completed',
      doctorNotes: notes || appointment.doctorNotes
    },
    { new: true }
  ).populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'firstName lastName email'
    }
  }).populate({
    path: 'doctor',
    select: 'user specialty',
    populate: {
      path: 'user',
      select: 'firstName lastName'
    }
  });

  console.log('Backend: Updated appointment:', updatedAppointment);

  // Emit real-time status update
  try {
    const { getIO } = require('../../utils/socket.utils');
    const io = getIO();
    
    console.log('🔔 Backend: Emitting appointment:status_changed for completion');
    
    // Emit to patient
    if (updatedAppointment.patient && updatedAppointment.patient.user) {
      const patientUserId = updatedAppointment.patient.user._id.toString();
      console.log('🔔 Backend: Emitting to patient room:', patientUserId);
      io.to(patientUserId).emit('appointment:status_changed', {
        appointmentId: updatedAppointment._id.toString(),
        status: updatedAppointment.status,
        message: `Your appointment has been completed`,
        appointment: updatedAppointment
      });
    }

    // Emit to doctor
    if (updatedAppointment.doctor && updatedAppointment.doctor.user) {
      const doctorUserId = updatedAppointment.doctor.user._id.toString();
      console.log('🔔 Backend: Emitting to doctor room:', doctorUserId);
      io.to(doctorUserId).emit('appointment:status_changed', {
        appointmentId: updatedAppointment._id.toString(),
        status: updatedAppointment.status,
        message: `Appointment completed successfully`,
        appointment: updatedAppointment
      });
    }
    
    console.log('🔔 Backend: Completion events emitted successfully');
  } catch (error) {
    console.error('❌ Backend: Error emitting completion event:', error);
  }

  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment completed successfully.'));
});

exports.getAppointmentDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email profilePictureUrl'
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

  const appointmentData = appointment.toObject();
  appointmentData.canBeModified = appointment.canBeModified();

  res.status(200).json(new ApiResponse(200, appointmentData, 'Appointment details fetched successfully.'));
});

exports.createAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    patient, 
    patientId, 
    date,
    time,
    type,
    reason,
    notes,
    duration,
    location,
    status
  } = req.body;

  // Validate required fields
  if (!date || !time || !type || !reason) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide all required fields: date, time, type, and reason.'));
  }

  // Validate patient identification
  if (!patient && !patientId) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide either patient ID or patientId.'));
  }

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  let patientDoc;
  if (patient) {
    patientDoc = await Patient.findById(patient);
  } else if (patientId) {
    patientDoc = await Patient.findOne({ patientId });
  }
  if (!patientDoc) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
  }

  // Validate date format
  let requestedDateObject = new Date(date);
  if (isNaN(requestedDateObject.getTime())) {
    requestedDateObject = new Date(date.split('T')[0]);
    if (isNaN(requestedDateObject.getTime())) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid appointment date format. Please use YYYY-MM-DD.'));
    }
  }

  // Validate time format
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid appointment time format. Please use HH:MM.'));
  }

  // Check if appointment is in the future
  const requestedDateTime = new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate(), hours, minutes);
  const now = new Date();
  now.setSeconds(0, 0);
  if (requestedDateTime < now) {
    return res.status(400).json(new ApiResponse(400, null, 'Appointment date and time must be in the future.'));
  }

  // Check for conflicting appointments
  const conflictingAppointment = await Appointment.findOne({
    doctor: doctor._id,
    date: new Date(requestedDateObject.getFullYear(), requestedDateObject.getMonth(), requestedDateObject.getDate()),
    time: time,
    status: { $in: ['pending', 'confirmed', 'accepted', 'scheduled', 'rescheduled'] }
  });
  if (conflictingAppointment) {
    return res.status(409).json(new ApiResponse(409, null, 'The doctor is unavailable at the selected date and time. Please choose a different slot.'));
  }

  const appointment = await Appointment.create({
    doctor: doctor._id,
    patient: patientDoc._id,
    date: new Date(date),
    time,
    type,
    reason,
    notes,
    duration,
    location,
    status: status || 'accepted'
  });

  const populatedAppointment = await appointment.populate([
    {
      path: 'patient',
      populate: { path: 'user', select: 'firstName lastName email profileImage' }
    },
    {
      path: 'doctor',
      select: 'user specialty',
      populate: { path: 'user', select: 'firstName lastName' }
    }
  ]);

  // Emit real-time event for new appointment
  try {
    const { getIO } = require('../../utils/socket.utils');
    const io = getIO();
    
    console.log('🔔 Backend: Emitting appointment:new event from doctor creation');
    
    // Emit to patient
    if (populatedAppointment.patient && populatedAppointment.patient.user) {
      const patientUserId = populatedAppointment.patient.user._id.toString();
      console.log('🔔 Backend: Emitting to patient room:', patientUserId);
      io.to(patientUserId).emit('appointment:new', {
        appointmentId: populatedAppointment._id.toString(),
        message: 'A new appointment has been scheduled for you',
        appointment: populatedAppointment
      });
    }

    // Emit to doctor
    if (populatedAppointment.doctor && populatedAppointment.doctor.user) {
      const doctorUserId = populatedAppointment.doctor.user._id.toString();
      console.log('🔔 Backend: Emitting to doctor room:', doctorUserId);
      io.to(doctorUserId).emit('appointment:new', {
        appointmentId: populatedAppointment._id.toString(),
        message: 'New appointment created successfully',
        appointment: populatedAppointment
      });
    }
    
    console.log('🔔 Backend: Doctor appointment creation events emitted successfully');
  } catch (error) {
    console.error('❌ Backend: Error emitting doctor appointment creation event:', error);
  }

  res.status(201).json(new ApiResponse(201, populatedAppointment, 'Appointment created successfully.'));
});

 