const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  chatsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  doctorsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
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

  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number']
    }
  },

  medicalHistory: [{
    condition: { type: String, trim: true },
    diagnosedDate: { type: Date },
    notes: { type: String, trim: true }
  }],

  allergies: [{
    allergen: { type: String, trim: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
    reaction: { type: String, trim: true }
  }],

  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },

  height: {
    type: Number,
    min: 60, 
    max: 220
  },

  weight: {
    type: Number,
    min: 20, 
    max: 220
  }

}, {
  timestamps: true,
  collection: 'Patients'
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
