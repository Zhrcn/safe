const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalLicenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  experienceYears: {
    type: Number,
    min: 0
  },
  education: [{
    
    degree: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    yearCompleted: {
      type: Number
    }
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  patientsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  chatsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
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
  // Keep these fields for backward compatibility
  specialization: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  experience: [{
    title: String,
    hospital: String,
    years: Number
  }],
  hospital: {
    name: String,
    address: String,
    phoneNumber: String
  },
  consultationFee: Number,
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'Doctors'
});

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
