const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, 'Not authorized, no token provided.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, 'Not authorized, user not found.'));
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json(new ApiResponse(401, null, 'Not authorized, token failed.'));
  }
});
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(
        new ApiResponse(403, null, `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route.`)
      );
    }
    next();
  };
};
