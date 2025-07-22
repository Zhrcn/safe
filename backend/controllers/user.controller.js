const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Pharmacist = require('../models/Pharmacist');
const MedicalFile = require('../models/MedicalFile');
const bcrypt = require('bcryptjs');

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
    console.log('DEBUG updateUser: id =', id, 'updateData =', updateData);
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
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

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      age,
      gender,
      phoneNumber,
      address,
      specialty,
      licenseNumber,
      yearsOfExperience,
      pharmacyName,
      companyName
    } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json(new ApiResponse(400, null, 'Please provide firstName, lastName, email, password, and role.'));
    }
    if (!['patient', 'doctor', 'pharmacist', 'admin', 'distributor'].includes(role)) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid role specified.'));
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json(new ApiResponse(409, null, 'User with this email already exists.'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      age,
      gender,
      phoneNumber,
      address
    });
    if (role === 'patient') {
      const medicalFile = await MedicalFile.create({ patientId: user._id });
      await Patient.create({ user: user._id, medicalFile: medicalFile._id });
    } else if (role === 'doctor') {
      if (!specialty || !licenseNumber) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json(new ApiResponse(400, null, 'Doctor role requires specialty and licenseNumber.'));
      }
      await Doctor.create({
        user: user._id,
        specialty,
        medicalLicenseNumber: licenseNumber,
        experienceYears: yearsOfExperience
      });
    } else if (role === 'pharmacist') {
      if (!licenseNumber || !pharmacyName) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json(new ApiResponse(400, null, 'Pharmacist role requires licenseNumber and pharmacyName.'));
      }
      await Pharmacist.create({
        user: user._id,
        licenseNumber,
        pharmacyName,
        yearsOfExperience
      });
    } else if (role === 'distributor') {
      if (!companyName) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json(new ApiResponse(400, null, 'Distributor role requires companyName.'));
      }
      const Distributor = require('../models/Distributor');
      await Distributor.create({
        user: user._id,
        companyName,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        address: req.body.address,
        distributorId: `DST-${Date.now()}` // Simple unique ID, can be improved
      });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(new ApiResponse(201, userResponse, 'User created successfully.'));
  } catch (err) {
    console.error('Error in createUser:', err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json(new ApiResponse(409, null, 'User with this email already exists.'));
    }
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
    if (user.role === 'doctor') {
      await Doctor.deleteOne({ user: user._id });
    } else if (user.role === 'pharmacist') {
      await Pharmacist.deleteOne({ user: user._id });
    } else if (user.role === 'patient') {
      const patient = await Patient.findOne({ user: user._id });
      if (patient && patient.medicalFile) {
        await MedicalFile.deleteOne({ _id: patient.medicalFile });
      }
      await Patient.deleteOne({ user: user._id });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};
