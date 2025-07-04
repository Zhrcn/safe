const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'patient' } }).select('-password');
    res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};
