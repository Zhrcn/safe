const Log = require('../models/Log');
const ApiResponse = require('../utils/apiResponse');

exports.getSystemLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(new ApiResponse(200, logs, 'Logs fetched successfully.'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, 'Failed to fetch logs.'));
  }
}; 