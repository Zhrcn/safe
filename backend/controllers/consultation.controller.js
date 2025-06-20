const Consultation = require('../models/Consultation');
const asyncHandler = require('express-async-handler');

// Get all consultations for the logged-in user (patient or doctor)
const getConsultations = asyncHandler(async (req, res) => {
  const filter = {
    $or: [
      { patient: req.user.id },
      { doctor: req.user.id }
    ]
  };
  const consultations = await Consultation.find(filter)
    .populate('doctor', 'firstName lastName specialization')
    .populate('patient', 'firstName lastName')
    .sort('-createdAt');
  res.json({
    success: true,
    data: consultations
  });
});

// Patient asks a question
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
  res.status(201).json({
    success: true,
    data: consultation
  });
});

// Doctor answers the question
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
  await consultation.save();
  await consultation.populate('doctor', 'firstName lastName specialization');
  await consultation.populate('patient', 'firstName lastName');
  res.json({
    success: true,
    data: consultation
  });
});

module.exports = {
  getConsultations,
  requestConsultation,
  answerConsultation
};
