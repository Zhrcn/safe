const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  message: { type: String, required: true },
  level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  timestamp: { type: Date, default: Date.now },
  meta: { type: Object }
});

module.exports = mongoose.model('Log', logSchema); 