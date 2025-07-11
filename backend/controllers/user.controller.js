const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['patient', 'doctor', 'pharmacist'] } }).select('-password');
    const mappedUsers = users.map(user => {
      const obj = user.toObject();
      return {
        ...obj,
        id: user._id.toString(),
        name: (obj.firstName || '') + (obj.lastName ? ' ' + obj.lastName : ''),
        status: obj.status || 'active',
      };
    });
    res.status(200).json(new ApiResponse(200, mappedUsers, 'Users fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Update main user fields
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
    // Update role-specific fields
    if (user.role === 'doctor') {
      await require('../models/Doctor').findOneAndUpdate(
        { user: user._id },
        {
          ...(updateData.specialty && { specialty: updateData.specialty }),
          ...(updateData.licenseNumber && { medicalLicenseNumber: updateData.licenseNumber }),
          ...(updateData.yearsOfExperience && { experienceYears: updateData.yearsOfExperience }),
        }
      );
    } else if (user.role === 'pharmacist') {
      await require('../models/Pharmacist').findOneAndUpdate(
        { user: user._id },
        {
          ...(updateData.licenseNumber && { licenseNumber: updateData.licenseNumber }),
          ...(updateData.pharmacyName && { pharmacyName: updateData.pharmacyName }),
          ...(updateData.yearsOfExperience && { yearsOfExperience: updateData.yearsOfExperience }),
        }
      );
    } else if (user.role === 'patient') {
      await require('../models/Patient').findOneAndUpdate(
        { user: user._id },
        {
          ...(updateData.age && { age: updateData.age }),
          ...(updateData.gender && { gender: updateData.gender }),
          ...(updateData.address && { address: updateData.address }),
          ...(updateData.phoneNumber && { phoneNumber: updateData.phoneNumber }),
        }
      );
    }
    res.status(200).json(new ApiResponse(200, { ...user.toObject(), id: user._id.toString() }, 'User updated successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};
