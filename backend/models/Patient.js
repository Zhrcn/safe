const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  medicalFile: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalFile'
  },
  doctorsList: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor' 
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  consultations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  }],
  prescriptions: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  conversations: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
}, {
  timestamps: true,
  collection: 'Patients'
});

patientSchema.index({ user: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
