const mongoose = require('mongoose');
const allergySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'moderate' },
  reaction: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const conditionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  diagnosisDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'managed', 'resolved'], default: 'active' },
  notes: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const labResultSchema = new mongoose.Schema({
  testName: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  results: mongoose.Schema.Types.Mixed, 
  normalRange: { type: String, trim: true },
  unit: { type: String, trim: true },
  labName: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documents: [{ type: String }]
});
const imagingSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true }, 
  date: { type: Date, default: Date.now },
  findings: { type: String, trim: true },
  location: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }]
});
const reminderSchema = new mongoose.Schema({
  time: String, 
  days: [String], 
  message: { type: String, trim: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});
const medicationSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, 
  name: { type: String, trim: true }, 
  dose: { type: String, required: true, trim: true },
  frequency: { type: String, required: true, trim: true },
  route: { type: String, trim: true }, 
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }, 
  active: { type: Boolean, default: true },
  instructions: { type: String, trim: true },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reminders: [reminderSchema] 
});
const documentSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  type: { type: String, trim: true }, 
  url: { type: String, trim: true, required: true },
  uploadDate: { type: Date, default: Date.now },
  tags: [{ type: String, trim: true }],
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const diagnosisSchema = new mongoose.Schema({
  conditionName: { type: String, trim: true, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  diagnosedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true },
  treatmentPlan: { type: String, trim: true },
  status: { type: String, enum: ['active', 'resolved', 'chronic'], default: 'active' }
});
const medicalOperationSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  date: { type: Date, required: true },
  hospital: { type: String, trim: true },
  surgeon: { type: String, trim: true }, 
  notes: { type: String, trim: true },
  complications: { type: String, trim: true },
  outcome: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const vaccineSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  dateAdministered: { type: Date, required: true },
  nextDoseDate: { type: Date },
  manufacturer: { type: String, trim: true },
  batchNumber: { type: String, trim: true },
  administeredBy: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const medicalHistoryEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visitReason: { type: String, trim: true },
  diagnosisSummary: { type: String, trim: true }, 
  treatmentSummary: { type: String, trim: true },
  notes: { type: String, trim: true }
});
const vitalSignSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  bloodPressure: { type: String, trim: true }, 
  heartRate: { type: Number }, 
  temperature: { type: Number }, 
  respiratoryRate: { type: Number },
  weight: { type: Number }, 
  height: { type: Number }, 
  bmi: { type: Number },
  oxygenSaturation: { type: Number }, 
  notes: { type: String, trim: true }
});
const familyMedicalHistorySchema = new mongoose.Schema({
  relation: { type: String, trim: true, required: true },
  condition: { type: String, trim: true, required: true },
  notes: { type: String, trim: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const medicalFileSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  status: { 
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  allergies: [allergySchema],
  chronicConditions: [conditionSchema], 
  labResults: [labResultSchema],
  imagingReports: [imagingSchema], 
  vitalSigns: [vitalSignSchema],
  prescriptionsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }], 
  medicationHistory: [medicationSchema], 
  immunizations: [vaccineSchema], 
  attachedDocuments: [documentSchema], 
  diagnoses: [diagnosisSchema], 
  surgicalHistory: [medicalOperationSchema], 
  familyMedicalHistory: [familyMedicalHistorySchema],
  socialHistory: {
    smokingStatus: { type: String, enum: ['current', 'former', 'never'], trim: true },
    alcoholUse: { type: String, trim: true }, 
    occupation: { type: String, trim: true },
    livingSituation: { type: String, trim: true }
  },
  generalMedicalHistory: [medicalHistoryEntrySchema], 
  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  insuranceDetails: {
    provider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    groupNumber: { type: String, trim: true },
    expiryDate: { type: Date },
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactAddress: { type: String, trim: true }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'MedicalFiles'
});
medicalFileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
medicalFileSchema.pre('save', function(next) {
  if (this.vitalSigns && this.vitalSigns.length > 0) {
    const latestVitals = this.vitalSigns[this.vitalSigns.length - 1];
    if (latestVitals.weight && latestVitals.height) {
      const heightInMeters = latestVitals.height / 100;
      latestVitals.bmi = (latestVitals.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
  }
  next();
});
const MedicalFile = mongoose.model('MedicalFile', medicalFileSchema);
module.exports = MedicalFile;
