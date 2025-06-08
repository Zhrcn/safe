// backend/controllers/patient.controller.js
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');
const Appointment = require('../models/Appointment');
const Medication = require('../models/medication');
const VitalSign = require('../models/vitalSign.model');
const HealthMetric = require('../models/healthMetric.model');
const ErrorResponse = require('../utils/errorResponse');

exports.getPatientProfile = asyncHandler(async (req, res, next) => {

  
  const patientUser = await User.findById(req.user.id).select('-password');
  if (!patientUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient user not found.'));
  }

  const patientRecord = await Patient.findOne({ user: req.user.id });
  if (!patientRecord) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient record not found.'));
  }

  const medicalFile = await MedicalFile.findOne({ patientId: req.user.id });
  if (!medicalFile) {

    return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
  }

  // Combine data into a profile object
  const profile = {
    // From User model
    _id: patientUser._id,
    userId: patientUser._id, // for consistency if frontend expects userId
    firstName: patientUser.firstName,
    lastName: patientUser.lastName,
    email: patientUser.email,
    role: patientUser.role,
    dateOfBirth: patientUser.dateOfBirth,
    gender: patientUser.gender,
    phoneNumber: patientUser.phoneNumber,
    address: patientUser.address,
    profilePictureUrl: patientUser.profilePictureUrl,
    // From Patient model (if any direct fields are added later)
    // patientSpecificField: patientRecord.someField,
    // From MedicalFile model
    medicalFileId: medicalFile._id,
    emergencyContact: medicalFile.emergencyContact,
    insuranceDetails: medicalFile.insuranceDetails,
    // We can add more from medicalFile if needed, e.g., allergies, conditions for a summary
    // allergies: medicalFile.allergies, 
    // conditions: medicalFile.conditions,
  };

  res.status(200).json(new ApiResponse(200, profile, 'Patient profile fetched successfully.'));
});

// @desc    Update current patient's profile
// @route   PATCH /api/v1/patients/profile
// @access  Private (Patient only)
exports.updatePatientProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    address, // { street, city, state, zipCode, country }
    profilePictureUrl,
    // MedicalFile specific parts
    emergencyContact, // { name, relationship, phone, email }
    insuranceDetails, // { provider, policyNumber, groupNumber, expiryDate }
  } = req.body;

  // Update User document
  const userFieldsToUpdate = {};
  if (firstName) userFieldsToUpdate.firstName = firstName;
  if (lastName) userFieldsToUpdate.lastName = lastName;
  if (dateOfBirth) userFieldsToUpdate.dateOfBirth = dateOfBirth;
  if (gender) userFieldsToUpdate.gender = gender;
  if (phoneNumber) userFieldsToUpdate.phoneNumber = phoneNumber;
  if (address && Object.keys(address).length > 0) userFieldsToUpdate.address = address;
  if (profilePictureUrl) userFieldsToUpdate.profilePictureUrl = profilePictureUrl;
  
  let updatedUser;
  if (Object.keys(userFieldsToUpdate).length > 0) {
    updatedUser = await User.findByIdAndUpdate(userId, userFieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');
  } else {
    updatedUser = await User.findById(userId).select('-password');
  }

  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient user not found for update.'));
  }

  // Update MedicalFile document
  const medicalFileFieldsToUpdate = {};
  if (emergencyContact && Object.keys(emergencyContact).length > 0) medicalFileFieldsToUpdate.emergencyContact = emergencyContact;
  if (insuranceDetails && Object.keys(insuranceDetails).length > 0) medicalFileFieldsToUpdate.insuranceDetails = insuranceDetails;

  let updatedMedicalFile;
  if (Object.keys(medicalFileFieldsToUpdate).length > 0) {
    updatedMedicalFile = await MedicalFile.findOneAndUpdate(
      { patientId: userId },
      { $set: medicalFileFieldsToUpdate },
      { new: true, runValidators: true }
    );
  } else {
    updatedMedicalFile = await MedicalFile.findOne({ patientId: userId });
  }
  
  if (!updatedMedicalFile) {
     return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for update.'));
  }

  // Construct the response profile
  const profile = {
    _id: updatedUser._id,
    userId: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    role: updatedUser.role,
    dateOfBirth: updatedUser.dateOfBirth,
    gender: updatedUser.gender,
    phoneNumber: updatedUser.phoneNumber,
    address: updatedUser.address,
    profilePictureUrl: updatedUser.profilePictureUrl,
    medicalFileId: updatedMedicalFile._id,
    emergencyContact: updatedMedicalFile.emergencyContact,
    insuranceDetails: updatedMedicalFile.insuranceDetails,
  };

  res.status(200).json(new ApiResponse(200, profile, 'Patient profile updated successfully.'));
});

// @desc    Get dashboard data
// @route   GET /api/v1/patients/dashboard
// @access  Private (Patient only)
exports.getDashboardData = asyncHandler(async (req, res, next) => {
  const patientId = req.user.id;

  // Get upcoming appointments
  const appointments = await Appointment.find({
    patient: patientId,
    date: { $gte: new Date() }
  })
    .sort({ date: 1 })
    .limit(3)
    .populate('doctor', 'name specialty');

  // Get active medications
  const medications = await Medication.find({
    patient: patientId,
    status: 'active'
  })
    .sort({ startDate: -1 })
    .populate('prescribedBy', 'name');

  // Get latest vital signs
  const vitalSigns = await VitalSign.find({ patient: patientId })
    .sort({ date: -1 })
    .limit(1);

  // Get health metrics
  const healthMetrics = await HealthMetric.find({ patient: patientId })
    .sort({ date: -1 })
    .limit(1);

  res.status(200).json({
    success: true,
    data: {
      appointments,
      medications,
      vitalSigns: vitalSigns[0] || null,
      healthMetrics: healthMetrics[0] || null
    }
  });
});

// @desc    Get upcoming appointments
// @route   GET /api/v1/patients/appointments/upcoming
// @access  Private (Patient only)
exports.getUpcomingAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find({
    patient: req.user.id,
    date: { $gte: new Date() }
  })
    .sort({ date: 1 })
    .populate('doctor', 'name specialty');

  res.status(200).json({
    success: true,
    data: appointments
  });
});

// @desc    Get active medications
// @route   GET /api/v1/patients/medications/active
// @access  Private (Patient only)
exports.getActiveMedications = asyncHandler(async (req, res, next) => {
  const medications = await Medication.find({
    patient: req.user.id,
    status: 'active'
  })
    .sort({ startDate: -1 })
    .populate('prescribedBy', 'name');

  res.status(200).json({
    success: true,
    data: medications
  });
});

// @desc    Get vital signs
// @route   GET /api/v1/patients/vital-signs
// @access  Private (Patient only)
exports.getVitalSigns = asyncHandler(async (req, res, next) => {
  const vitalSigns = await VitalSign.find({ patient: req.user.id })
    .sort({ date: -1 })
    .limit(30); // Get last 30 days of vital signs

  res.status(200).json({
    success: true,
    data: vitalSigns
  });
});

// @desc    Get health metrics
// @route   GET /api/v1/patients/health-metrics
// @access  Private (Patient only)
exports.getHealthMetrics = asyncHandler(async (req, res, next) => {
  const healthMetrics = await HealthMetric.find({ patient: req.user.id })
    .sort({ date: -1 })
    .limit(30); // Get last 30 days of health metrics

  res.status(200).json({
    success: true,
    data: healthMetrics
  });
});
