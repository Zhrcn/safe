const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: false // Only required when doctor accepts
  },
  time: {
    type: String,
    required: false // Only required when doctor accepts
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  preferredTimeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any'],
    default: 'any'
  },
  notes: {
    type: String,
    default: ''
  },
  followUp: {
    type: Boolean,
    default: false
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
  timestamps: true,
  collection: 'Appointments'
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;