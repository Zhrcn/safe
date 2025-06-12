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
    
    req.user = await User.findById(decoded.id).select('-password'); 

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, 'Not authorized, user not found.'));
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return next(error); 
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
