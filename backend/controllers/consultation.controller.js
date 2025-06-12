const Consultation = require('../models/Consultation');
const asyncHandler = require('express-async-handler');

// @desc    Get all consultations for a patient
// @route   GET /api/v1/consultations
// @access  Private
const getConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({ patient: req.user.id })
    .populate('doctor', 'firstName lastName specialization')
    .sort('-requestedAt');
  
  res.json({
    success: true,
    data: consultations
  });
});

// @desc    Request a new consultation
// @route   POST /api/v1/consultations
// @access  Private
const requestConsultation = asyncHandler(async (req, res) => {
  const { doctorId, reason, preferredTime, attachments } = req.body;

  const consultation = await Consultation.create({
    patient: req.user.id,
    doctor: doctorId,
    reason,
    preferredTime,
    attachments,
    status: 'Pending',
    requestedAt: new Date()
  });

  await consultation.populate('doctor', 'firstName lastName specialization');

  res.status(201).json({
    success: true,
    data: consultation
  });
});

// @desc    Update a consultation
// @route   PATCH /api/v1/consultations/:id
// @access  Private
const updateConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }

  // Check if user is the patient or doctor
  if (consultation.patient.toString() !== req.user.id && 
      consultation.doctor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this consultation');
  }

  const updatedConsultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('doctor', 'firstName lastName specialization');

  res.json({
    success: true,
    data: updatedConsultation
  });
});

// @desc    Cancel a consultation
// @route   POST /api/v1/consultations/:id/cancel
// @access  Private
const cancelConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }

  // Check if user is the patient or doctor
  if (consultation.patient.toString() !== req.user.id && 
      consultation.doctor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to cancel this consultation');
  }

  consultation.status = 'Cancelled';
  consultation.cancelledAt = new Date();
  consultation.cancelledBy = req.user.id;
  await consultation.save();

  res.json({
    success: true,
    data: consultation
  });
});

module.exports = {
  getConsultations,
  requestConsultation,
  updateConsultation,
  cancelConsultation
};
