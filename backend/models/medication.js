const mongoose = require('mongoose');
const medicationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  instructions: {
    type: String,
    required: true
  },
  sideEffects: {
    type: String
  },
  notes: {
    type: String
  },
  remindersEnabled: {
    type: Boolean,
    default: false
  },
  reminderTimes: [{
    type: String
  }],
  reminderDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  refillDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
medicationSchema.index({ patient: 1, status: 1 });
medicationSchema.index({ patient: 1, startDate: -1 });
module.exports = mongoose.model('Medication', medicationSchema); 