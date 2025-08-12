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
    address: pharmacistUser.address, 
    profileImage: pharmacistUser.profileImage,
    pharmacistId: pharmacistRecord._id,
    pharmacistUniqueId: pharmacistRecord.pharmacistId,
    pharmacyName: pharmacistRecord.pharmacyName,
    pharmacyAddress: pharmacistRecord.pharmacyAddress, 
    licenseNumber: pharmacistRecord.licenseNumber,
    qualifications: pharmacistRecord.qualifications,
    yearsOfExperience: pharmacistRecord.yearsOfExperience,
    workingHours: pharmacistRecord.workingHours,
    professionalBio: pharmacistRecord.professionalBio,
    servicesOffered: pharmacistRecord.servicesOffered,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Pharmacist profile fetched successfully.'));
});
exports.updatePharmacistProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    address, 
    profileImage,
    pharmacyName,
    pharmacyAddress, 
    qualifications, 
    yearsOfExperience,
    workingHours, 
    professionalBio,
    servicesOffered, 
  } = req.body;
  const userFieldsToUpdate = {};
  if (firstName) userFieldsToUpdate.firstName = firstName;
  if (lastName) userFieldsToUpdate.lastName = lastName;
  if (dateOfBirth) userFieldsToUpdate.dateOfBirth = dateOfBirth;
  if (gender) userFieldsToUpdate.gender = gender;
  if (phoneNumber) userFieldsToUpdate.phoneNumber = phoneNumber;
  if (address && Object.keys(address).length > 0) userFieldsToUpdate.address = address;
  if (profileImage) userFieldsToUpdate.profileImage = profileImage;
  let updatedUser = await User.findById(userId);
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Pharmacist user not found for update.'));
  }
  Object.assign(updatedUser, userFieldsToUpdate);
  await updatedUser.save();
  updatedUser = updatedUser.toObject();
  delete updatedUser.password;
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
    profileImage: updatedUser.profileImage,
    pharmacistId: updatedPharmacistRecord._id,
    pharmacyName: updatedPharmacistRecord.pharmacyName,
    pharmacyAddress: updatedPharmacistRecord.pharmacyAddress,
    licenseNumber: updatedPharmacistRecord.licenseNumber, 
    qualifications: updatedPharmacistRecord.qualifications,
    yearsOfExperience: updatedPharmacistRecord.yearsOfExperience,
    workingHours: updatedPharmacistRecord.workingHours,
    professionalBio: updatedPharmacistRecord.professionalBio,
    servicesOffered: updatedPharmacistRecord.servicesOffered,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Pharmacist profile updated successfully.'));
});
exports.getPharmacists = asyncHandler(async (req, res) => {
    const pharmacists = await Pharmacist.find({})
        .populate('user', 'firstName lastName email phoneNumber profileImage')
        .select('pharmacyName pharmacyAddress licenseNumber qualifications yearsOfExperience workingHours professionalBio servicesOffered');
    res.status(200).json(new ApiResponse(200, pharmacists, 'Pharmacists fetched successfully.'));
});
exports.getPharmacist = asyncHandler(async (req, res) => {
    const pharmacist = await Pharmacist.findById(req.params.id)
        .populate('user', 'firstName lastName email phoneNumber profileImage')
        .select('pharmacyName pharmacyAddress licenseNumber qualifications yearsOfExperience workingHours professionalBio servicesOffered');
    if (!pharmacist) {
        return res.status(404).json(new ApiResponse(404, null, 'Pharmacist not found.'));
    }
    res.status(200).json(new ApiResponse(200, pharmacist, 'Pharmacist fetched successfully.'));
});

exports.getPharmacistsForMobile = asyncHandler(async (req, res) => {
  try {
    const pharmacists = await Pharmacist.find({})
      .populate('user', 'firstName lastName email phoneNumber profileImage address dateOfBirth gender')
      .lean();

    const formattedPharmacists = pharmacists.map(pharmacist => {
      let specialties = [];
      if (pharmacist.servicesOffered && Array.isArray(pharmacist.servicesOffered) && pharmacist.servicesOffered.length > 0) {
        specialties = pharmacist.servicesOffered;
      } else if (pharmacist.pharmacyName) {
        specialties = [pharmacist.pharmacyName];
      } else if (pharmacist.specialties && Array.isArray(pharmacist.specialties) && pharmacist.specialties.length > 0) {
        specialties = pharmacist.specialties;
      }

      let address = null;
      if (pharmacist.pharmacyAddress && pharmacist.pharmacyAddress.street) {
        address = `${pharmacist.pharmacyAddress.street}, ${pharmacist.pharmacyAddress.city || ''}, ${pharmacist.pharmacyAddress.state || ''}`.trim();
      } else if (pharmacist.pharmacyAddress) {
        address = pharmacist.pharmacyAddress;
      } else if (pharmacist.user?.address) {
        address = pharmacist.user.address;
      }

      return {
        _id: pharmacist._id,
        pharmacistId: pharmacist.pharmacistId,
        name: pharmacist.user ? `${pharmacist.user.firstName || ''} ${pharmacist.user.lastName || ''}`.trim() : '',
        pharmacyName: pharmacist.pharmacyName || '',
        specialties: specialties,
        rating: pharmacist.rating || 0,
        yearsExperience: pharmacist.yearsOfExperience || 0,
        address: address,
        avatar: pharmacist.user?.profileImage || null,
        email: pharmacist.user?.email || null,
        phoneNumber: pharmacist.user?.phoneNumber || null,
        licenseNumber: pharmacist.licenseNumber || null,
        qualifications: pharmacist.qualifications || [],
        professionalBio: pharmacist.professionalBio || null,
        workingHours: pharmacist.workingHours || null,
        servicesOffered: pharmacist.servicesOffered || [],
        pharmacyAddress: pharmacist.pharmacyAddress || null,
        user: {
          _id: pharmacist.user?._id,
          firstName: pharmacist.user?.firstName,
          lastName: pharmacist.user?.lastName,
          email: pharmacist.user?.email,
          phoneNumber: pharmacist.user?.phoneNumber,
          profileImage: pharmacist.user?.profileImage,
          address: pharmacist.user?.address,
          dateOfBirth: pharmacist.user?.dateOfBirth,
          gender: pharmacist.user?.gender
        }
      };
    });

    res.status(200).json(new ApiResponse(200, formattedPharmacists, 'Pharmacists fetched successfully for mobile app.'));
  } catch (error) {
    console.error('Error in getPharmacistsForMobile:', error);
    res.status(500).json(new ApiResponse(500, null, 'Error fetching pharmacists for mobile app.'));
  }
});
