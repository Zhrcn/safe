const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  pharmacy: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  specialization: {
    type: String,
    default: 'General'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  contactNumber: {
    type: String
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
  collection: 'Pharmacists'
});

const Pharmacist = mongoose.models.Pharmacist || mongoose.model('Pharmacist', pharmacistSchema);

module.exports = Pharmacist;
