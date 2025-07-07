const asyncHandler = require('../middleware/asyncHandler');
const Medication = require('../models/medication');

const getPatientMedications = asyncHandler(async (req, res) => {
  const medications = await Medication.find({ patient: req.user.id })
    .populate('prescribedBy', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: medications
  });
});

const getMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id)
    .populate('prescribedBy', 'firstName lastName');

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  if (medication.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this medication');
  }

  res.json({
    success: true,
    data: medication
  });
});

const createMedication = asyncHandler(async (req, res) => {
  const {
    name,
    dosage,
    frequency,
    startDate,
    endDate,
    instructions,
    sideEffects,
    notes,
    remindersEnabled,
    reminderTimes,
    reminderDays,
    refillDate,
    prescribedBy
  } = req.body;

  let doctorId = req.user.id; 
  
  if (prescribedBy && require('mongoose').Types.ObjectId.isValid(prescribedBy)) {
    doctorId = prescribedBy;
  }

  const medication = await Medication.create({
    patient: req.user.id,
    name,
    dosage,
    frequency,
    startDate,
    endDate,
    instructions,
    sideEffects,
    notes,
    remindersEnabled: remindersEnabled || false,
    reminderTimes: reminderTimes || [],
    reminderDays: reminderDays || [],
    refillDate,
    prescribedBy: doctorId
  });

  await medication.populate('prescribedBy', 'firstName lastName');

  res.status(201).json({
    success: true,
    data: medication
  });
});

const updateMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  if (medication.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this medication');
  }

  let updateData = { ...req.body };
  if (updateData.prescribedBy && !require('mongoose').Types.ObjectId.isValid(updateData.prescribedBy)) {
    delete updateData.prescribedBy; 
  }

  const updatedMedication = await Medication.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('prescribedBy', 'firstName lastName');

  res.json({
    success: true,
    data: updatedMedication
  });
});

const deleteMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  if (medication.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this medication');
  }

  await Medication.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Medication deleted successfully'
  });
});

const updateReminders = asyncHandler(async (req, res) => {
  const { remindersEnabled, reminderTimes, reminderDays } = req.body;

  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  if (medication.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this medication');
  }

  const updatedMedication = await Medication.findByIdAndUpdate(
    req.params.id,
    {
      remindersEnabled,
      reminderTimes,
      reminderDays
    },
    { new: true, runValidators: true }
  ).populate('prescribedBy', 'firstName lastName');

  res.json({
    success: true,
    data: updatedMedication
  });
});

const requestRefill = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  if (medication.patient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to request refill for this medication');
  }

  const newRefillDate = new Date();
  newRefillDate.setDate(newRefillDate.getDate() + 7);

  const updatedMedication = await Medication.findByIdAndUpdate(
    req.params.id,
    { refillDate: newRefillDate },
    { new: true, runValidators: true }
  ).populate('prescribedBy', 'firstName lastName');

  res.json({
    success: true,
    data: updatedMedication,
    message: 'Refill requested successfully'
  });
});

module.exports = {
  getPatientMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  updateReminders,
  requestRefill
}; 