const mongoose = require('mongoose');

const allergySchema = new mongoose.Schema({
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
}, { _id: false });

const conditionSchema = new mongoose.Schema({
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
}, { _id: false });

const labResultSchema = new mongoose.Schema({
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
}, { _id: false });

const imagingSchema = new mongoose.Schema({
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
}, { _id: false });

const reminderSchema = new mongoose.Schema({
  time: String, // '08:00'
  days: [String], // ['Monday', 'Wednesday']
  message: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { _id: false });

const medicationSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  active: {
    type: Boolean,
    default: true
  },
  instructions: String,
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reminders: [reminderSchema]
}, { _id: false });

const documentSchema = new mongoose.Schema({
  title: String,
  type: String,
  url: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  tags: [String]
}, { _id: false });

const diagnosisSchema = new mongoose.Schema({
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
}, { _id: false });

const medicalOperationSchema = new mongoose.Schema({
  name: String,
  date: Date,
  hospital: String,
  surgeon: String,
  notes: String,
  complications: String,
  outcome: String
}, { _id: false });

const vaccineSchema = new mongoose.Schema({
  name: String,
  date: Date,
  nextDoseDate: Date,
  manufacturer: String,
  batchNumber: String,
  administeredBy: String
}, { _id: false });

const medicalHistoryEntrySchema = new mongoose.Schema({
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
}, { _id: false });

const chronicDiseaseSchema = {
  type: String,
  trim: true
};

const vitalSignSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  bloodPressure: { // e.g., '120/80'
    type: String,
    trim: true
  },
  heartRate: { // beats per minute
    type: Number
  },
  temperature: { // Celsius
    type: Number
  },
  weight: { // kg
    type: Number
  },
  height: { // cm
    type: Number
  },
  notes: {
    type: String,
    trim: true
  }
}, { _id: false });

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
  allergies: [allergySchema],
  conditions: [conditionSchema],
  labResults: [labResultSchema],
  imaging: [imagingSchema],
  vitalSigns: [vitalSignSchema],
  prescriptionsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  medicationsList: [medicationSchema],
  possibleGeneticDiseases: [{
    name: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    notes: String
  }],
  immunizations: [vaccineSchema],
  documents: [documentSchema],
  diagnosis: [diagnosisSchema],
  medicalOperations: [medicalOperationSchema],
  vaccines: [vaccineSchema],
  height: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  chronicDiseases: [chronicDiseaseSchema],
  medicalHistory: [medicalHistoryEntrySchema],
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
