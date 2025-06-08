// TODO: Implement pharmacist-specific logic
// (e.g., view prescriptions to be filled, manage pharmacy inventory if applicable)

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Pharmacist = require('../models/Pharmacist');

exports.getPharmacistProfile = asyncHandler(async (req, res, next) => {
  const pharmacistUser = await User.findById(req.user.id).select('-password');
  if (!pharmacistUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Pharmacist user not found.'));
  }

  const pharmacistRecord = await Pharmacist.findOne({ user: req.user.id });
  if (!pharmacistRecord) {
    return res.status(404).json(new ApiResponse(404, null, 'Pharmacist-specific record not found.'));
  }
  
  const profile = {
    _id: pharmacistUser._id,
    userId: pharmacistUser._id,
    firstName: pharmacistUser.firstName,
    lastName: pharmacistUser.lastName,
    email: pharmacistUser.email,
    role: pharmacistUser.role,
    dateOfBirth: pharmacistUser.dateOfBirth,
    gender: pharmacistUser.gender,
    phoneNumber: pharmacistUser.phoneNumber,
    address: pharmacistUser.address, // User's personal address
    profilePictureUrl: pharmacistUser.profilePictureUrl,
    
    pharmacistId: pharmacistRecord._id,
    pharmacyName: pharmacistRecord.pharmacyName,
    pharmacyAddress: pharmacistRecord.pharmacyAddress, // Pharmacy's address
    licenseNumber: pharmacistRecord.licenseNumber,
    qualifications: pharmacistRecord.qualifications,
    yearsOfExperience: pharmacistRecord.yearsOfExperience,
    workingHours: pharmacistRecord.workingHours,
    professionalBio: pharmacistRecord.professionalBio,
    servicesOffered: pharmacistRecord.servicesOffered,
  };

  res.status(200).json(new ApiResponse(200, profile, 'Pharmacist profile fetched successfully.'));
});

// @desc    Update current pharmacist's profile
// @route   PATCH /api/v1/pharmacists/profile
// @access  Private (Pharmacist only)
exports.updatePharmacistProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    // User fields
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    address, // User's personal address
    profilePictureUrl,
    // Pharmacist specific fields
    pharmacyName,
    pharmacyAddress, // Pharmacy's address
    qualifications, // Array
    yearsOfExperience,
    workingHours, // Array of objects
    professionalBio,
    servicesOffered, // Array of strings
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
  
  let updatedUser = await User.findById(userId);
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Pharmacist user not found for update.'));
  }
  Object.assign(updatedUser, userFieldsToUpdate);
  await updatedUser.save();
  updatedUser = updatedUser.toObject();
  delete updatedUser.password;

  // Update Pharmacist document
  const pharmacistFieldsToUpdate = {};
  if (pharmacyName) pharmacistFieldsToUpdate.pharmacyName = pharmacyName;
  if (pharmacyAddress && Object.keys(pharmacyAddress).length > 0) pharmacistFieldsToUpdate.pharmacyAddress = pharmacyAddress;
  if (qualifications) pharmacistFieldsToUpdate.qualifications = qualifications;
  if (yearsOfExperience !== undefined) pharmacistFieldsToUpdate.yearsOfExperience = yearsOfExperience;
  if (workingHours) pharmacistFieldsToUpdate.workingHours = workingHours;
  if (professionalBio) pharmacistFieldsToUpdate.professionalBio = professionalBio;
  if (servicesOffered) pharmacistFieldsToUpdate.servicesOffered = servicesOffered;

  let updatedPharmacistRecord = await Pharmacist.findOne({ user: userId });
  if (!updatedPharmacistRecord) {
     return res.status(404).json(new ApiResponse(404, null, 'Pharmacist-specific record not found for update.'));
  }
  Object.assign(updatedPharmacistRecord, pharmacistFieldsToUpdate);
  await updatedPharmacistRecord.save();
  
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
    
    pharmacistId: updatedPharmacistRecord._id,
    pharmacyName: updatedPharmacistRecord.pharmacyName,
    pharmacyAddress: updatedPharmacistRecord.pharmacyAddress,
    licenseNumber: updatedPharmacistRecord.licenseNumber, // Not typically updated by pharmacist
    qualifications: updatedPharmacistRecord.qualifications,
    yearsOfExperience: updatedPharmacistRecord.yearsOfExperience,
    workingHours: updatedPharmacistRecord.workingHours,
    professionalBio: updatedPharmacistRecord.professionalBio,
    servicesOffered: updatedPharmacistRecord.servicesOffered,
  };

  res.status(200).json(new ApiResponse(200, profile, 'Pharmacist profile updated successfully.'));
});
