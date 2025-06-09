// TODO: Implement medical file CRUD logic (view, update sections)

const MedicalFile = require('../models/MedicalFile');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get medical file by ID
// @route   GET /api/v1/medical-files/:id
// @access  Private (Patient or Doctor)
const getMedicalFileById = asyncHandler(async (req, res) => {
  const medicalFile = await MedicalFile.findById(req.params.id)
    .populate('patientId', 'firstName lastName email phoneNumber address gender profileImage')
    .populate('prescriptionsList')
    .populate({
      path: 'medicationHistory.medicine',
      select: 'name genericName description',
    })
    .lean();

  if (!medicalFile) {
    res.status(404);
    throw new Error('Medical file not found');
  }

  // Basic authorization: Ensure the requesting user is either the patient themselves
  // or a doctor associated with this patient (if we implement that relationship)
  // For now, let's assume authenticated patient or a placeholder for doctor access.
  if (req.user.role === 'patient' && medicalFile.patientId._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this medical file');
  }

  res.status(200).json({
    success: true,
    data: medicalFile,
  });
});

// @desc    Update emergency contact details
// @route   PATCH /api/v1/medical-files/:id/emergency-contact
// @access  Private (Patient)
const updateEmergencyContact = asyncHandler(async (req, res) => {
  const { name, relationship, phone, email } = req.body;

  const medicalFile = await MedicalFile.findById(req.params.id);

  if (!medicalFile) {
    res.status(404);
    throw new Error('Medical file not found');
  }

  if (medicalFile.patientId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this medical file');
  }

  medicalFile.emergencyContact = { name, relationship, phone, email };

  await medicalFile.save();

  res.status(200).json({
    success: true,
    data: medicalFile.emergencyContact,
  });
});

// @desc    Update insurance details
// @route   PATCH /api/v1/medical-files/:id/insurance
// @access  Private (Patient)
const updateInsuranceDetails = asyncHandler(async (req, res) => {
  const { provider, policyNumber, groupNumber, expiryDate } = req.body;

  const medicalFile = await MedicalFile.findById(req.params.id);

  if (!medicalFile) {
    res.status(404);
    throw new Error('Medical file not found');
  }

  if (medicalFile.patientId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this medical file');
  }

  medicalFile.insuranceDetails = { provider, policyNumber, groupNumber, expiryDate };

  await medicalFile.save();

  res.status(200).json({
    success: true,
    data: medicalFile.insuranceDetails,
  });
});

module.exports = {
  getMedicalFileById,
  updateEmergencyContact,
  updateInsuranceDetails,
};
