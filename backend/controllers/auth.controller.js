const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const MedicalFile = require('../models/MedicalFile');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; 
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};
const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
  }
  return true;
};
const checkLoginAttempts = (email) => {
  const attempts = loginAttempts.get(email);
  if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeLeft = attempts.timestamp + LOCKOUT_DURATION - Date.now();
    if (timeLeft > 0) {
      throw new Error(`Account temporarily locked. Please try again in ${Math.ceil(timeLeft / 60000)} minutes.`);
    }
    loginAttempts.delete(email);
  }
};
const recordFailedLogin = (email) => {
  const attempts = loginAttempts.get(email) || { count: 0, timestamp: Date.now() };
  attempts.count += 1;
  attempts.timestamp = Date.now();
  loginAttempts.set(email, attempts);
};
const resetLoginAttempts = (email) => {
  loginAttempts.delete(email);
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
  try {
    validatePassword(password);
  } catch (error) {
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json(new ApiResponse(400, null, 'User with this email already exists.'));
  }
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
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
    verificationToken: hashedToken,
    verificationExpires: Date.now() + 24 * 60 * 60 * 1000
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
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const message = `
      <h1>Welcome to SAFE Healthcare!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `;
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - SAFE Healthcare',
      html: message
    });
    const token = generateToken(user._id, user.role);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(new ApiResponse(201, { user: userResponse, token }, 'User registered successfully. Please check your email for verification.'));
  } else {
    res.status(400).json(new ApiResponse(400, null, 'Invalid user data. Registration failed.'));
  }
});
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide email and password.'));
  }
  try {
    checkLoginAttempts(email);
  } catch (error) {
    return res.status(429).json(new ApiResponse(429, null, error.message));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    recordFailedLogin(email);
    return res.status(401).json(new ApiResponse(401, null, 'Invalid Email or Password.'));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    recordFailedLogin(email);
    return res.status(401).json(new ApiResponse(401, null, 'Invalid Email or Password.'));
  }
  resetLoginAttempts(email);
  const token = generateToken(user._id, user.role);
  const userResponse = user.toObject();
  delete userResponse.password;
  res.status(200).json(new ApiResponse(200, { user: userResponse, token }, 'Login successful.'));
});
exports.getMe = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found.'));
  }
  let userResponse = user.toObject();
  if (userResponse.role === 'patient') {
    const patientDetails = await Patient.findOne({ user: user._id }).populate('medicalFile');
    if (patientDetails) {
      userResponse.patientInfo = patientDetails.toObject();
    }
  } else if (userResponse.role === 'doctor') {
    const doctorDetails = await Doctor.findOne({ user: user._id });
    if (doctorDetails) {
      userResponse.doctorInfo = doctorDetails.toObject();
    }
  } else if (userResponse.role === 'pharmacist') {
    const pharmacistDetails = await Pharmacist.findOne({ user: user._id });
    if (pharmacistDetails) {
      userResponse.pharmacistInfo = pharmacistDetails.toObject();
    }
  }
  res.status(200).json(new ApiResponse(200, { user: userResponse }, 'User data fetched successfully.'));
});
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    gender: req.body.gender
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json(new ApiResponse(401, null, 'Current password is incorrect'));
  }
  try {
    validatePassword(req.body.newPassword);
  } catch (error) {
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'There is no user with that email'));
  }
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `
    <h1>Password Reset Request</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  await sendEmail({
    email: user.email,
    subject: 'Password Reset - SAFE Healthcare',
    html: message
  });
  res.status(200).json(new ApiResponse(200, null, 'Password reset email sent'));
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid or expired token'));
  }
  try {
    validatePassword(req.body.password);
  } catch (error) {
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
});
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationExpires: { $gt: Date.now() }
  });
  if (!user) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid or expired verification token'));
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'));
});
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }
  if (user.isVerified) {
    return res.status(400).json(new ApiResponse(400, null, 'Email already verified'));
  }
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.verificationToken = hashedToken;
  user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; 
  await user.save();
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const message = `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not create an account, please ignore this email.</p>
  `;
  await sendEmail({
    email: user.email,
    subject: 'Email Verification - SAFE Healthcare',
    html: message
  });
  res.status(200).json(new ApiResponse(200, null, 'Verification email sent'));
});
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});
