// backend/controllers/patient.controller.js
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');

// @desc    Get current patient's profile
// @route   GET /api/v1/patients/profile
// @access  Private (Patient only)
exports.getPatientProfile = asyncHandler(async (req, res, next) => {
  // req.user is attached by 'protect' middleware. We also need to ensure role is 'patient'.
  // This role check will be done in the route definition using 'authorize' middleware.
  
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
    // This case should ideally not happen if registration creates a medical file.
    // Consider creating one if it doesn't exist, or return an error.
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
