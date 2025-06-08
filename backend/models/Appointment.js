const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: { 
    type: Date,
    required: true ,
    default: new Date('1111-01-11')
  },
  appointmentTime: {
    type: String, 
    required: true, 
    default:"TBD"
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  preferredTimeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any'],
    default: 'any'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  followUp: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  collection: 'Appointments'
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
