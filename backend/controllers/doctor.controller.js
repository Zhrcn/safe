// TODO: Implement doctor-specific logic
// (e.g., manage patient list, view schedules, manage consultations)

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc    Get current doctor's profile
// @route   GET /api/v1/doctors/profile
// @access  Private (Doctor only)
exports.getDoctorProfile = asyncHandler(async (req, res, next) => {
  // req.user is from 'protect' middleware
  const doctorUser = await User.findById(req.user.id).select('-password');
  if (!doctorUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor user not found.'));
  }

  const doctorRecord = await Doctor.findOne({ user: req.user.id });
  if (!doctorRecord) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor-specific record not found.'));
  }
  
  const profile = {
    _id: doctorUser._id,
    userId: doctorUser._id,
    firstName: doctorUser.firstName,
    lastName: doctorUser.lastName,
    email: doctorUser.email,
    role: doctorUser.role,
    dateOfBirth: doctorUser.dateOfBirth,
    gender: doctorUser.gender,
    phoneNumber: doctorUser.phoneNumber,
    address: doctorUser.address,
    profilePictureUrl: doctorUser.profilePictureUrl,
    
    doctorId: doctorRecord._id,
    specialization: doctorRecord.specialization,
    qualifications: doctorRecord.qualifications,
    licenseNumber: doctorRecord.licenseNumber,
    yearsOfExperience: doctorRecord.yearsOfExperience,
    consultationFee: doctorRecord.consultationFee,
    availability: doctorRecord.availability,
    workingHours: doctorRecord.workingHours,
    professionalBio: doctorRecord.professionalBio,
  };

  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile fetched successfully.'));
});

// @desc    Update current doctor's profile
// @route   PATCH /api/v1/doctors/profile
// @access  Private (Doctor only)
exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    // User fields
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    profilePictureUrl,
    // Doctor specific fields
    specialization,
    qualifications, // Array
    yearsOfExperience,
    consultationFee,
    workingHours, // Array of objects: { dayOfWeek: String, startTime: String, endTime: String, isAvailable: Boolean }
    professionalBio,
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
  
  let updatedUser = await User.findById(userId); // Get current user to preserve fields not being updated
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor user not found for update.'));
  }
  Object.assign(updatedUser, userFieldsToUpdate); // Apply updates
  await updatedUser.save(); // This will trigger pre-save hooks like password hashing if password were changed
  updatedUser = updatedUser.toObject(); // Convert to plain object
  delete updatedUser.password; // Remove password

  // Update Doctor document
  const doctorFieldsToUpdate = {};
  if (specialization) doctorFieldsToUpdate.specialization = specialization;
  if (qualifications) doctorFieldsToUpdate.qualifications = qualifications; // Ensure this is an array
  if (yearsOfExperience !== undefined) doctorFieldsToUpdate.yearsOfExperience = yearsOfExperience;
  if (consultationFee !== undefined) doctorFieldsToUpdate.consultationFee = consultationFee;
  if (workingHours) doctorFieldsToUpdate.workingHours = workingHours; // Ensure this matches schema
  if (professionalBio) doctorFieldsToUpdate.professionalBio = professionalBio;

  let updatedDoctorRecord = await Doctor.findOne({ user: userId });
  if (!updatedDoctorRecord) {
     return res.status(404).json(new ApiResponse(404, null, 'Doctor-specific record not found for update.'));
  }
  Object.assign(updatedDoctorRecord, doctorFieldsToUpdate);
  await updatedDoctorRecord.save();
  
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
    
    doctorId: updatedDoctorRecord._id,
    specialization: updatedDoctorRecord.specialization,
    qualifications: updatedDoctorRecord.qualifications,
    licenseNumber: updatedDoctorRecord.licenseNumber, // Not typically updated by doctor
    yearsOfExperience: updatedDoctorRecord.yearsOfExperience,
    consultationFee: updatedDoctorRecord.consultationFee,
    availability: updatedDoctorRecord.availability,
    workingHours: updatedDoctorRecord.workingHours,
    professionalBio: updatedDoctorRecord.professionalBio,
  };

  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile updated successfully.'));
});

// @desc    Get all doctors
// @route   GET /api/v1/doctors
// @access  Private
exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({})
        .populate('user', 'firstName lastName email phoneNumber profilePictureUrl')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');

    res.status(200).json(new ApiResponse(200, doctors, 'Doctors fetched successfully.'));
});

// @desc    Get single doctor
// @route   GET /api/v1/doctors/:id
// @access  Private
exports.getDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
        .populate('user', 'firstName lastName email phoneNumber profilePictureUrl')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');

    if (!doctor) {
        return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
    }

    res.status(200).json(new ApiResponse(200, doctor, 'Doctor fetched successfully.'));
});
