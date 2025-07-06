const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Appointment = require('../../models/Appointment');
const Doctor = require('../../models/Doctor');

// Get all appointments for the logged-in doctor
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log('DEBUG: req.user.id:', userId);
  // Find the Doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  console.log('DEBUG: Found doctor:', doctor);
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  // Find all appointments for this doctor
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

// Accept an appointment
exports.acceptAppointment = asyncHandler(async (req, res) => {
  console.log('Backend: Accept appointment called');
  console.log('Backend: req.user.id:', req.user.id);
  console.log('Backend: req.params:', req.params);
  console.log('Backend: req.body:', req.body);
  
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { date, time, location, doctorNotes } = req.body;

  // Find the Doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  console.log('Backend: Found doctor:', doctor);
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Find the appointment and verify it belongs to this doctor
  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  console.log('Backend: Found appointment:', appointment);
  console.log('Backend: Appointment status:', appointment?.status);
  console.log('Backend: Appointment ID:', appointment?._id);
  console.log('Backend: Doctor ID:', doctor._id);
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  // For accepting appointments, we don't need the 24-hour restriction
  // Only check if the appointment is still pending
  console.log('Backend: Checking if appointment status is pending:', appointment.status === 'pending');
  if (appointment.status !== 'pending') {
    console.log('Backend: Appointment status is not pending, returning 400 error');
    return res.status(400).json(new ApiResponse(400, null, `Only pending appointments can be accepted. Current status: ${appointment.status}`));
  }

  // Update appointment
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

// Reject an appointment
exports.rejectAppointment = asyncHandler(async (req, res) => {
  console.log('Backend: Reject appointment called');
  console.log('Backend: req.user.id:', req.user.id);
  console.log('Backend: req.params:', req.params);
  console.log('Backend: req.body:', req.body);
  
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { doctorNotes } = req.body;

  // Find the Doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  console.log('Backend: Found doctor:', doctor);
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Find the appointment and verify it belongs to this doctor
  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  console.log('Backend: Found appointment:', appointment);
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  // For rejecting appointments, we don't need the 24-hour restriction
  // Only check if the appointment is still pending
  if (appointment.status !== 'pending') {
    return res.status(400).json(new ApiResponse(400, null, 'Only pending appointments can be rejected.'));
  }

  // Update appointment status to rejected
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

// Update appointment details
exports.updateAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { date, time, location, doctorNotes, patientNotes, reason, type } = req.body;

  // Find the Doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Find the appointment and verify it belongs to this doctor
  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  if (!appointment) {
    return res.status(404).json(new ApiResponse(404, null, 'Appointment not found.'));
  }

  // Check if appointment can be modified
  if (!appointment.canBeModified()) {
    return res.status(400).json(new ApiResponse(400, null, 'Appointment cannot be modified within 24 hours of the scheduled time.'));
  }

  // Build update data
  const updateData = {};
  if (date) updateData.date = new Date(date);
  if (time) updateData.time = time;
  if (location) updateData.location = location;
  if (doctorNotes !== undefined) updateData.doctorNotes = doctorNotes;
  if (patientNotes !== undefined) updateData.patientNotes = patientNotes;
  if (reason) updateData.reason = reason;
  if (type) updateData.type = type;

  // If date or time changed, update status to rescheduled
  if (date || time) {
    updateData.status = 'rescheduled';
  }

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

// Handle reschedule request (approve/reject)
exports.handleRescheduleRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;
  const { action, newDate, newTime, doctorNotes } = req.body; // action: 'approve' or 'reject'

  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json(new ApiResponse(400, null, 'Action must be either "approve" or "reject".'));
  }

  // Find the Doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Find the appointment and verify it belongs to this doctor
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
    // Reject the reschedule request
    appointment.status = appointment.rescheduleRequest.requestedDate ? 'scheduled' : 'accepted';
    appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
    
    // Clear reschedule request
    appointment.rescheduleRequest = undefined;
  }

  const updatedAppointment = await appointment.save();

  // Create notification for patient
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

// Get appointment details
exports.getAppointmentDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { appointmentId } = req.params;

  // Find the Doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Find the appointment and verify it belongs to this doctor
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

  // Add canBeModified flag
  const appointmentData = appointment.toObject();
  appointmentData.canBeModified = appointment.canBeModified();

  res.status(200).json(new ApiResponse(200, appointmentData, 'Appointment details fetched successfully.'));
}); 