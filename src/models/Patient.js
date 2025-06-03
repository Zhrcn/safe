const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chatsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  doctorsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    }
  },
  consultations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  prescriptionsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  medicalFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalFile'
  },
  // Keep these fields for backward compatibility
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  allergies: [{
    allergen: String,
    severity: String,
    reaction: String
  }],
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  height: Number,
  weight: Number
}, {
  timestamps: true,
  collection: 'Patients'
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
