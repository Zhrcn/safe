const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Appointment = require('../../models/Appointment');
const Doctor = require('../../models/Doctor');
const { createNotification } = require('../../utils/notification.utils');

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

  // If date or time is being updated, set status to rescheduled (unless explicitly provided)
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

  res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment updated successfully.'));
});

exports.handleRescheduleRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { action, newDate, newTime, doctorNotes } = req.body; // action: 'approve' or 'reject'

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

  // Check if appointment has a reschedule request
  if (appointment.status !== 'reschedule_requested') {
    return res.status(400).json(new ApiResponse(400, null, 'No reschedule request found for this appointment.'));
  }

  if (action === 'approve') {
    // Validate new date and time if provided
    if (newDate && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      let newDateObject = new Date(newDate);
      if (isNaN(newDateObject.getTime())) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid new date format.'));
      }

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid new time format.'));
      }

      // Check for conflicts
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

      // Update appointment with new date/time
      appointment.date = newDateObject;
      appointment.time = newTime;
    } else {
      // Use the requested date/time from the reschedule request
      appointment.date = appointment.rescheduleRequest.requestedDate;
      appointment.time = appointment.rescheduleRequest.requestedTime;
    }

    appointment.status = 'rescheduled';
    appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
    
    // Clear reschedule request
    appointment.rescheduleRequest = undefined;
  } else {
    appointment.status = appointment.rescheduleRequest.requestedDate ? 'scheduled' : 'accepted';
    appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
    
    appointment.rescheduleRequest = undefined;
  }

  const updatedAppointment = await appointment.save();

  const patientName = appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'The patient';
  const notificationMessage = action === 'approve' 
    ? `Your reschedule request has been approved. New appointment time: ${updatedAppointment.date.toLocaleDateString()} at ${updatedAppointment.time}.`
    : `Your reschedule request has been rejected. Your original appointment remains scheduled.`;

  await createNotification(
    appointment.patient._id.toString(),
    `Reschedule Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
    notificationMessage,
    'appointment',
    appointment._id.toString(),
    'Appointment'
  );

  res.status(200).json(new ApiResponse(200, updatedAppointment, `Reschedule request ${action}d successfully.`));
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

 