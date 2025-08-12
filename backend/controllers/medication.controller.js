const asyncHandler = require('../middleware/asyncHandler');
const Medication = require('../models/medication');
const Patient = require('../models/Patient');
const { createNotification } = require('../utils/notification.utils');

const getPatientMedications = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }
  let medicationsWithReminders = patient.medications;
  if (Array.isArray(patient.reminders)) {
    medicationsWithReminders = patient.medications.map(med => {
      const reminders = patient.reminders.filter(r => r.medicationId?.toString() === med._id?.toString());
      return { ...med._doc, reminders };
    });
  }
  res.json({
    success: true,
    data: medicationsWithReminders
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

const addNotificationForMedication = async (userId, title, message, medicationId) => {
  await createNotification(userId, title, message, 'medical_file_update', medicationId, 'Medication');
};

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

  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  let doctorId = req.user.id; 
  if (prescribedBy && require('mongoose').Types.ObjectId.isValid(prescribedBy)) {
    doctorId = prescribedBy;
  }

  const medication = await Medication.create({
    patient: patient._id,
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
  await addNotificationForMedication(req.user.id, 'Medication Added', `A new medication "${name}" was added to your record.`, medication._id);
  if (doctorId && doctorId.toString() !== req.user.id.toString()) {
    await addNotificationForMedication(doctorId, 'Medication Prescribed', `You have prescribed "${name}" to a patient.`, medication._id);
  }
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
  await addNotificationForMedication(req.user.id, 'Medication Updated', `A medication was updated in your record.`, updatedMedication._id);
  if (updatedMedication.prescribedBy && updatedMedication.prescribedBy.toString() !== req.user.id.toString()) {
    await addNotificationForMedication(updatedMedication.prescribedBy, 'Medication Updated', `A medication you prescribed was updated.`, updatedMedication._id);
  }
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
  await addNotificationForMedication(req.user.id, 'Medication Deleted', `A medication was deleted from your record.`, req.params.id);
});

const updateReminders = asyncHandler(async (req, res) => {
  const { reminders } = req.body;
  const medicationId = req.params.id;

  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  patient.reminders = patient.reminders.filter(r => r.medicationId?.toString() !== medicationId);

  if (Array.isArray(reminders)) {
    reminders.forEach(rem => {
      patient.reminders.push({ ...rem, medicationId });
    });
  }

  await patient.save();

  const med = patient.medications.id(medicationId);
  const medReminders = patient.reminders.filter(r => r.medicationId?.toString() === medicationId);

  res.json({
    success: true,
    data: { ...med.toObject(), reminders: medReminders }
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
  await addNotificationForMedication(req.user.id, 'Medication Refill Requested', `A refill was requested for your medication.`, updatedMedication._id);
  if (updatedMedication.prescribedBy && updatedMedication.prescribedBy.toString() !== req.user.id.toString()) {
    await addNotificationForMedication(updatedMedication.prescribedBy, 'Medication Refill Requested', `A patient requested a refill for a medication you prescribed.`, updatedMedication._id);
  }
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