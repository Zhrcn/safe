const Consultation = require('../models/Consultation');
const asyncHandler = require('express-async-handler');
const { createNotification } = require('../utils/notification.utils');
const { getIO } = require('../utils/socket.utils');

const getConsultations = asyncHandler(async (req, res) => {
  const { doctorId, patientId } = req.query;
  let filter = {};
  if (doctorId && patientId) {
    filter = { doctor: doctorId, patient: patientId };
  } else if (doctorId) {
    filter = { doctor: doctorId };
  } else if (patientId) {
    filter = { patient: patientId };
  } else {
    filter = {
      $or: [
        { patient: req.user.id },
        { doctor: req.user.id }
      ]
    };
  }
  const consultations = await Consultation.find(filter)
    .populate({
      path: 'doctor',
      model: 'User',
      select: 'firstName lastName email'
    })
    .populate({
      path: 'patient',
      model: 'Patient',
      populate: {
        path: 'user',
        model: 'User',
        select: 'firstName lastName email'
      }
    })
    .sort('-createdAt');
  res.json({
    success: true,
    data: consultations
  });
});

const requestConsultation = asyncHandler(async (req, res) => {
  const { doctorId, question } = req.body;
  const consultation = await Consultation.create({
    patient: req.user.id,
    doctor: doctorId,
    question,
    status: 'Pending'
  });
  await consultation.populate('doctor', 'firstName lastName specialization');
  await consultation.populate('patient', 'firstName lastName');
  const notifDoctor = await createNotification(
    doctorId,
    'New Consultation Request',
    `You have a new consultation request from a patient.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  if (!notifDoctor) {
    console.error('[Consultation] Failed to create notification for doctor:', doctorId);
  }
  const notifPatient = await createNotification(
    req.user.id,
    'Consultation Requested',
    `Your consultation request has been submitted and is pending response.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  if (!notifPatient) {
    console.error('[Consultation] Failed to create notification for patient:', req.user.id);
  }
      getIO().to(doctorId).emit('notification', {
    id: consultation._id,
    title: 'New Consultation Request',
    message: `You have a new consultation request from a patient.`,
    type: 'consultation',
    time: new Date().toISOString(),
  });
  res.status(201).json({
    success: true,
    data: consultation
  });
});

const answerConsultation = asyncHandler(async (req, res) => {
  console.log('[Consultation] answerConsultation called with params:', req.params);
  console.log('[Consultation] answerConsultation called with body:', req.body);
  console.log('[Consultation] answerConsultation called with user:', req.user);
  
  try {
  const consultation = await Consultation.findById(req.params.id);
    console.log('[Consultation] Found consultation:', consultation);
    
  if (!consultation) {
      console.log('[Consultation] Consultation not found');
    res.status(404);
    throw new Error('Consultation not found');
  }
    
    console.log('[Consultation] Checking authorization. Doctor ID:', consultation.doctor.toString(), 'User ID:', req.user.id);
  if (consultation.doctor.toString() !== req.user.id) {
      console.log('[Consultation] Not authorized to answer this consultation');
    res.status(403);
    throw new Error('Not authorized to answer this consultation');
  }
    
    console.log('[Consultation] Updating consultation with answer:', req.body.answer);
    
    if (!req.body.answer || req.body.answer.trim() === '') {
      console.log('[Consultation] Answer is empty or missing');
      res.status(400);
      throw new Error('Answer is required');
    }
    
  consultation.answer = req.body.answer;
  consultation.status = 'Answered';
  consultation.messages.push({
    sender: 'doctor',
    message: req.body.answer,
    timestamp: new Date()
  });
    
    console.log('[Consultation] Saving consultation...');
  await consultation.save();
    console.log('[Consultation] Consultation saved successfully');
    
    console.log('[Consultation] Populating consultation...');
  await consultation.populate('doctor', 'firstName lastName email');
    await consultation.populate({
      path: 'patient',
      model: 'Patient',
      populate: {
        path: 'user',
        model: 'User',
        select: 'firstName lastName email'
      }
    });
    console.log('[Consultation] Consultation populated successfully');
    
    try {
      console.log('[Consultation] Creating notification for patient user:', consultation.patient.user);
  const notif = await createNotification(
        consultation.patient.user, 
    'Consultation Answered',
    `Your consultation has been answered by the doctor.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  if (!notif) {
        console.error('[Consultation] Failed to create notification for patient user:', consultation.patient.user);
  }
    } catch (notifError) {
      console.error('[Consultation] Error creating notification:', notifError);
    }
    
    try {
      console.log('[Consultation] Emitting Socket.IO event...');
      getIO().to(consultation.patient.user.toString()).emit('notification', {
    id: consultation._id,
    title: 'Consultation Answered',
    message: `Your consultation has been answered by the doctor.`,
    type: 'consultation',
    time: new Date().toISOString(),
  });
      console.log('[Consultation] Socket.IO event emitted successfully');
    } catch (socketError) {
      console.error('[Consultation] Error emitting Socket.IO event:', socketError);
    }
    
    console.log('[Consultation] Sending response...');
  res.json({
    success: true,
    data: consultation
  });
    console.log('[Consultation] Response sent successfully');
  } catch (error) {
    console.error('[Consultation] Error in answerConsultation:', error);
    throw error;
  }
});

const updateConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  if (req.body.question !== undefined) consultation.question = req.body.question;
  if (req.body.status !== undefined) consultation.status = req.body.status;
  await consultation.save();
  await consultation.populate('doctor', 'firstName lastName specialization');
  await consultation.populate('patient', 'firstName lastName');
  let notif1 = await createNotification(
    consultation.doctor,
    'Consultation Updated',
    `A consultation has been updated.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  if (!notif1) {
    console.error('[Consultation] Failed to create notification for doctor:', consultation.doctor);
  }
  getIO().to(consultation.doctor.toString()).emit('notification', {
    id: consultation._id,
    title: 'Consultation Updated',
    message: `A consultation has been updated.`,
    type: 'consultation',
    time: new Date().toISOString(),
  });
  console.log('[Consultation] Creating notification for patient:', consultation.patient);
  let notif2 = await createNotification(
    consultation.patient,
    'Consultation Updated',
    `A consultation has been updated.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  if (!notif2) {
    console.error('[Consultation] Failed to create notification for patient:', consultation.patient);
  }
  getIO().to(consultation.patient.toString()).emit('notification', {
    id: consultation._id,
    title: 'Consultation Updated',
    message: `A consultation has been updated.`,
    type: 'consultation',
    time: new Date().toISOString(),
  });
  res.json({
    success: true,
    data: consultation
  });
});

const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  if (consultation.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this consultation');
  }
  await consultation.deleteOne();
  res.json({ success: true, message: 'Consultation deleted' });
});

const addFollowUpQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  if (
    req.user.id !== consultation.patient.toString() &&
    req.user.id !== consultation.doctor.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to add questions to this consultation');
  }
  let sender = 'patient';
  if (req.user.id === consultation.doctor.toString()) {
    sender = 'doctor';
  }
  consultation.messages.push({
    sender,
    message: question,
    timestamp: new Date()
  });
  consultation.status = 'Pending';
  await consultation.save();
  await consultation.populate('doctor', 'firstName lastName email');
  await consultation.populate('patient', 'firstName lastName');
  res.json({ success: true, data: consultation });
});

const getConsultationMessages = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  
  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  
  if (consultation.patient.toString() !== req.user.id && consultation.doctor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view this consultation');
  }
  
  await consultation.populate('doctor', 'firstName lastName email');
  await consultation.populate('patient', 'firstName lastName');
  
  res.json({
    success: true,
    data: {
      consultation,
      messages: consultation.messages
    }
  });
});

const referPatient = asyncHandler(async (req, res) => {
  await createNotification(
    req.body.patientId,
    'Referral Created',
    'You have been referred to another doctor.',
    'general',
    null,
    null
  );
  res.status(200).json({ success: true, message: 'Referral created and patient notified.' });
});

module.exports = {
  getConsultations,
  requestConsultation,
  answerConsultation,
  updateConsultation,
  deleteConsultation,
  addFollowUpQuestion,
  getConsultationMessages,
  referPatient
};
