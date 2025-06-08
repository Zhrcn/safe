const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const MedicalFile = require('../models/MedicalFile');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

exports.registerUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role, 
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    specialization, 
    qualifications, 
    licenseNumber,
    yearsOfExperience,
    pharmacyName,
    professionalBio,
    workingHours
  } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide firstName, lastName, email, password, and role.'));
  }
  if (!['patient', 'doctor', 'pharmacist'].includes(role)) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid role specified.'));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json(new ApiResponse(400, null, 'User with this email already exists.'));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
  });

  if (user) {
    if (role === 'patient') {
      const medicalFile = await MedicalFile.create({ patientId: user._id });
      await Patient.create({ user: user._id, medicalFile: medicalFile._id });
    } else if (role === 'doctor') {
      if (!specialization || !licenseNumber || !qualifications) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json(new ApiResponse(400, null, 'Doctor role requires specialization, licenseNumber, and qualifications.'));
      }
      await Doctor.create({ 
        user: user._id, 
        specialization, 
        licenseNumber,
        qualifications,
        yearsOfExperience,
        professionalBio,
        workingHours
      });
    } else if (role === 'pharmacist') {
      if (!licenseNumber || !pharmacyName || !qualifications) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json(new ApiResponse(400, null, 'Pharmacist role requires licenseNumber, pharmacyName, and qualifications.'));
      }
      await Pharmacist.create({ 
        user: user._id, 
        licenseNumber, 
        pharmacyName,
        qualifications,
        yearsOfExperience,
        professionalBio,
        workingHours
      });
    }

    const token = generateToken(user._id, user.role);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(new ApiResponse(201, { user: userResponse, token }, 'User registered successfully.'));
  } else {
    res.status(400).json(new ApiResponse(400, null, 'Invalid user data. Registration failed.'));
  }
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide email, password, and role.'));
  }
  if (!['patient', 'doctor', 'pharmacist', 'admin'].includes(role)) { 
    return res.status(400).json(new ApiResponse(400, null, 'Invalid role specified for login.'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, 'Invalid Email or Password.'));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json(new ApiResponse(401, null, 'Invalid credentials. Password incorrect.'));
  }

  if (user.role !== role) {
    return res.status(403).json(new ApiResponse(403, null, `Access denied. Please log in via the correct portal for your role (${user.role}).`));
  }

  const token = generateToken(user._id, user.role);
  const userResponse = user.toObject();
  delete userResponse.password;
  
  res.status(200).json(new ApiResponse(200, { user: userResponse, token }, 'Login successful.'));
});


exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found.'));
  }
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json(new ApiResponse(200, { user: userResponse }, 'User data fetched successfully.'));
});
