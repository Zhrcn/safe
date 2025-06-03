const mongoose = require('mongoose');

const medicalFileSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  allergies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate'
    },
    reaction: String
  }],
  conditions: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    diagnosisDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'managed', 'resolved'],
      default: 'active'
    },
    notes: String
  }],
  labResults: [{
    testName: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    results: mongoose.Schema.Types.Mixed,
    normalRange: String,
    unit: String,
    labName: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [String]
  }],
  imaging: [{
    type: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    findings: String,
    location: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    images: [String]
  }],
  prescriptionsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  medicationsList: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    dose: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    active: {
      type: Boolean,
      default: true
    },
    instructions: String
  }],
  reminders: {
    time: String,
    days: [String],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    message: String
  },
  possibleGeneticDiseases: [{
    name: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    notes: String
  }],
  immunizations: [{
    name: String,
    date: Date,
    expiryDate: Date,
    manufacturer: String,
    batchNumber: String,
    administeredBy: String
  }],
  documents: [{
    title: String,
    type: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    tags: [String]
  }],
  diagnosis: [{
    condition: String,
    diagnosedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    treatment: String,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    }
  }],
  medicalOperations: [{
    name: String,
    date: Date,
    hospital: String,
    surgeon: String,
    notes: String,
    complications: String,
    outcome: String
  }],
  vaccines: [{
    name: String,
    date: Date,
    nextDoseDate: Date,
    manufacturer: String,
    batchNumber: String,
    administeredBy: String
  }],
  // Keep these fields for backward compatibility
  height: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  chronicDiseases: [{
    type: String,
    trim: true
  }],
  medicalHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    diagnosis: String,
    treatment: String,
    notes: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    active: {
      type: Boolean,
      default: true
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  collection: 'MedicalFiles'
});

const MedicalFile = mongoose.models.MedicalFile || mongoose.model('MedicalFile', medicalFileSchema);

module.exports = MedicalFile;