const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
exports.getDoctorProfile = asyncHandler(async (req, res, next) => {
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
exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    profilePictureUrl,
    specialization,
    qualifications, 
    yearsOfExperience,
    consultationFee,
    workingHours,
    professionalBio,
  } = req.body;
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
    return res.status(404).json(new ApiResponse(404, null, 'Doctor user not found for update.'));
  }
  Object.assign(updatedUser, userFieldsToUpdate); 
  await updatedUser.save(); 
  updatedUser = updatedUser.toObject(); 
  delete updatedUser.password; 
  const doctorFieldsToUpdate = {};
  if (specialization) doctorFieldsToUpdate.specialization = specialization;
  if (qualifications) doctorFieldsToUpdate.qualifications = qualifications; 
  if (yearsOfExperience !== undefined) doctorFieldsToUpdate.yearsOfExperience = yearsOfExperience;
  if (consultationFee !== undefined) doctorFieldsToUpdate.consultationFee = consultationFee;
  if (workingHours) doctorFieldsToUpdate.workingHours = workingHours; 
  if (professionalBio) doctorFieldsToUpdate.professionalBio = professionalBio;
  let updatedDoctorRecord = await Doctor.findOne({ user: userId });
  if (!updatedDoctorRecord) {
     return res.status(404).json(new ApiResponse(404, null, 'Doctor-specific record not found for update.'));
  }
  Object.assign(updatedDoctorRecord, doctorFieldsToUpdate);
  await updatedDoctorRecord.save();
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
    licenseNumber: updatedDoctorRecord.licenseNumber,
    yearsOfExperience: updatedDoctorRecord.yearsOfExperience,
    consultationFee: updatedDoctorRecord.consultationFee,
    availability: updatedDoctorRecord.availability,
    workingHours: updatedDoctorRecord.workingHours,
    professionalBio: updatedDoctorRecord.professionalBio,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile updated successfully.'));
});
exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({})
        .populate('user', 'firstName lastName email phoneNumber profilePictureUrl')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');
    res.status(200).json(new ApiResponse(200, doctors, 'Doctors fetched successfully.'));
});
exports.getDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
        .populate('user', 'firstName lastName email phoneNumber profilePictureUrl')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');
    if (!doctor) {
        return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
    }
    res.status(200).json(new ApiResponse(200, doctor, 'Doctor fetched successfully.'));
});
