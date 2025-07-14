const Consultation = require('../models/Consultation');
const asyncHandler = require('express-async-handler');
const { createNotification } = require('../utils/notification.utils');
const { io } = require('../server');

const getConsultations = asyncHandler(async (req, res) => {
  const filter = {
    $or: [
      { patient: req.user.id },
      { doctor: req.user.id }
    ]
  };
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
  await createNotification(
    doctorId,
    'New Consultation Request',
    `You have a new consultation request from a patient.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  io.to(doctorId).emit('notification', {
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
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }
  if (consultation.doctor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to answer this consultation');
  }
  consultation.answer = req.body.answer;
  consultation.status = 'Answered';
  consultation.messages.push({
    sender: 'doctor',
    message: req.body.answer,
    timestamp: new Date()
  });
  await consultation.save();
  await consultation.populate('doctor', 'firstName lastName email');
  await consultation.populate('patient', 'firstName lastName');
  await createNotification(
    consultation.patient,
    'Consultation Answered',
    `Your consultation has been answered by the doctor.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  io.to(consultation.patient.toString()).emit('notification', {
    id: consultation._id,
    title: 'Consultation Answered',
    message: `Your consultation has been answered by the doctor.`,
    type: 'consultation',
    time: new Date().toISOString(),
  });
  res.json({
    success: true,
    data: consultation
  });
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
  await createNotification(
    consultation.doctor,
    'Consultation Updated',
    `A consultation has been updated.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  io.to(consultation.doctor.toString()).emit('notification', {
    id: consultation._id,
    title: 'Consultation Updated',
    message: `A consultation has been updated.`,
    type: 'consultation',
    time: new Date().toISOString(),
  });
  await createNotification(
    consultation.patient,
    'Consultation Updated',
    `A consultation has been updated.`,
    'consultation',
    consultation._id,
    'Consultation'
  );
  io.to(consultation.patient.toString()).emit('notification', {
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
  
  if (consultation.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to add questions to this consultation');
  }
  
  consultation.messages.push({
    sender: 'patient',
    message: question,
    timestamp: new Date()
  });
  
  consultation.status = 'Pending';
  
  await consultation.save();
  await consultation.populate('doctor', 'firstName lastName email');
  await consultation.populate('patient', 'firstName lastName');
  
  res.json({
    success: true,
    data: consultation,
    message: 'Follow-up question added successfully'
  });
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

module.exports = {
  getConsultations,
  requestConsultation,
  answerConsultation,
  updateConsultation,
  deleteConsultation,
  addFollowUpQuestion,
  getConsultationMessages
};
