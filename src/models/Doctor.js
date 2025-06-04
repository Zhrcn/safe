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
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    yearCompleted: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
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
  experience: [{
    title: String,
    institution: {
      name: String,
      address: String
    },
    years: Number
  }],
  currentHospital: {
    name: String,
    address: String,
    phoneNumber: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true,
  collection: 'Doctors'
});

DoctorSchema.index({ user: 1 });
DoctorSchema.index({ specialty: 1 });

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
