const mongoose = require('mongoose');

const vitalSignSchema = new mongoose.Schema({
    bloodPressure: { type: String, trim: true },
    heartRate: { type: Number },
    temperature: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    bmi: { type: Number },
    oxygenSaturation: { type: Number },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true }
});

const allergySchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
    reaction: { type: String, trim: true },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const conditionSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    status: { type: String, enum: ['active', 'resolved', 'managed'], default: 'active' },
    diagnosisDate: { type: Date },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const diagnosisSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    doctor: { type: String, trim: true },
    date: { type: Date },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const labResultSchema = new mongoose.Schema({
    testName: { type: String, trim: true, required: true },
    labName: { type: String, trim: true },
    date: { type: Date },
    normalRange: { type: String, trim: true },
    unit: { type: String, trim: true },
    results: { type: mongoose.Schema.Types.Mixed },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const imagingSchema = new mongoose.Schema({
    type: { type: String, trim: true, required: true },
    date: { type: Date },
    images: [{ src: { type: String, trim: true } }],
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const medicationSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    dosage: { type: String, trim: true },
    frequency: { type: String, trim: true },
    status: { type: String, enum: ['active', 'discontinued', 'completed'], default: 'active' },
    startDate: { type: Date },
    endDate: { type: Date },
    prescribedBy: { type: String, trim: true },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const vaccineSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    date: { type: Date },
    administeredBy: { type: String, trim: true },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const medicalOperationSchema = new mongoose.Schema({
    procedure: { type: String, trim: true, required: true },
    date: { type: Date },
    hospital: { type: String, trim: true },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const documentSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    type: { type: String, trim: true },
    url: { type: String, trim: true },
    date: { type: Date },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const familyHistorySchema = new mongoose.Schema({
    condition: { type: String, trim: true, required: true },
    relationship: { type: String, trim: true, required: true },
    notes: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const socialHistorySchema = new mongoose.Schema({
    aspect: { type: String, trim: true, required: true },
    details: { type: String, trim: true },
    dateAdded: { type: Date, default: Date.now }
});

const medicalHistoryEntrySchema = new mongoose.Schema({
    question: { type: String, trim: true, required: true },
    answer: { type: String, trim: true, required: true },
    dateAdded: { type: Date, default: Date.now }
});

const medicalRecordSchema = new mongoose.Schema({
    patientId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    vitalSigns: [vitalSignSchema],
    allergies: [allergySchema],
    chronicConditions: [conditionSchema],
    diagnoses: [diagnosisSchema],
    labResults: [labResultSchema],
    imagingReports: [imagingSchema],
    medications: [medicationSchema],
    immunizations: [vaccineSchema],
    surgicalHistory: [medicalOperationSchema],
    documents: [documentSchema],
    familyHistory: [familyHistorySchema],
    socialHistory: [socialHistorySchema],
    generalHistory: [medicalHistoryEntrySchema],
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
    collection: 'MedicalRecords'
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema); 