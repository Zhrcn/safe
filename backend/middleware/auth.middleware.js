const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
exports.protect = asyncHandler(async (req, res, next) => {
  console.log('Auth middleware - Headers:', req.headers);
  console.log('Auth middleware - Authorization header:', req.headers.authorization);
  
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Auth middleware - Token extracted:', token ? 'Present' : 'Missing');
  } 
  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json(new ApiResponse(401, null, 'Not authorized, no token provided.'));
  }
  try {
    console.log('Auth middleware - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token decoded successfully:', { id: decoded.id, role: decoded.role });
    // Log the full decoded JWT for debugging
    console.log('Decoded JWT payload:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    console.log('Auth middleware - User found:', user ? 'Yes' : 'No');
    if (!user) {
      console.log('Auth middleware - User not found in database');
      return res.status(401).json(new ApiResponse(401, null, 'Not authorized, user not found.'));
    }
    console.log('Auth middleware - Authentication successful for user:', user.email, 'Role:', user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    console.error('Token verification error name:', error.name);
    console.error('Token verification error message:', error.message);
    return res.status(401).json(new ApiResponse(401, null, 'Not authorized, token failed.'));
  }
});
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Log the user and roles being checked
    console.log('Authorize middleware - User:', req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : req.user, 'Allowed roles:', roles);
    // Extra debug logging
    console.log('Type of req.user.role:', typeof req.user.role, 'Value:', req.user.role);
    console.log('Type of roles:', typeof roles, 'Value:', roles);
    console.log('roles.includes(req.user.role):', roles.includes(req.user.role));
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Authorize middleware - Forbidden: user role is not authorized for this route.');
      return res.status(403).json(
        new ApiResponse(403, null, `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route.`)
      );
    }
    next();
  };
};
