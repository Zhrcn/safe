const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  bloodGlucose: {
    type: Number,
    required: true
  },
  cholesterol: {
    total: {
      type: Number,
      required: true
    },
    hdl: {
      type: Number,
      required: true
    },
    ldl: {
      type: Number,
      required: true
    }
  },
  sleepHours: {
    type: Number,
    required: true
  },
  exerciseMinutes: {
    type: Number,
    required: true
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  painLevel: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'neutral', 'poor', 'terrible'],
    required: true
  },
  symptoms: [{
    type: String
  }],
  notes: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Index for efficient querying
healthMetricSchema.index({ patient: 1, date: -1 });

module.exports = mongoose.model('HealthMetric', healthMetricSchema); 