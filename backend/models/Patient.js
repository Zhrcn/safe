const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalFile',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  allergies: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    notes: String
  }],
  chronicConditions: [{
    name: String,
    diagnosisDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'resolved']
    },
    notes: String
  }],
  medications: [{
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    notes: String,
  }],
  emergencyContacts: [{
    name: String,
    relationship: String,
    phoneNumber: String,
    email: String,
    isPrimary: Boolean
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date
  },
  preferredPharmacy: {
    name: String,
    address: String,
    phoneNumber: String
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  consultations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  }],
  prescriptions: [{
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    medications: [{
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
    }],
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    notes: String,
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  reminders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reminder'
  }],
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
  collection: 'Patients'
});

// Indexes for better query performance
patientSchema.index({ user: 1 });
patientSchema.index({ 'allergies.name': 1 });
patientSchema.index({ 'chronicConditions.name': 1 });
patientSchema.index({ 'medications.name': 1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.user.firstName} ${this.user.lastName}`;
});

// Method to add a new allergy
patientSchema.methods.addAllergy = async function(allergyData) {
  this.allergies.push(allergyData);
  return this.save();
};

// Method to add a new chronic condition
patientSchema.methods.addChronicCondition = async function(conditionData) {
  this.chronicConditions.push(conditionData);
  return this.save();
};

// Method to add a new medication
patientSchema.methods.addMedication = async function(medicationData) {
  this.medications.push(medicationData);
  return this.save();
};

// Method to add an emergency contact
patientSchema.methods.addEmergencyContact = async function(contactData) {
  this.emergencyContacts.push(contactData);
  return this.save();
};

// Method to get active medications
patientSchema.methods.getActiveMedications = function() {
  const now = new Date();
  return this.medications.filter(med => 
    (!med.endDate || new Date(med.endDate) > now)
  );
};

// Method to get upcoming appointments
patientSchema.methods.getUpcomingAppointments = async function() {
  return this.model('Appointment').find({
    _id: { $in: this.appointments },
    date: { $gt: new Date() }
  }).sort({ date: 1 });
};

// Method to get recent consultations
patientSchema.methods.getRecentConsultations = async function(limit = 5) {
  return this.model('Consultation').find({
    _id: { $in: this.consultations }
  }).sort({ date: -1 }).limit(limit);
};

// Method to get active prescriptions
patientSchema.methods.getActivePrescriptions = async function() {
  return this.model('Prescription').find({
    _id: { $in: this.prescriptions },
    status: 'active'
  });
};

// Method to get upcoming reminders
patientSchema.methods.getUpcomingReminders = async function() {
  return this.model('Reminder').find({
    _id: { $in: this.reminders },
    dueDate: { $gt: new Date() }
  }).sort({ dueDate: 1 });
};

// Update the updatedAt timestamp before saving
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;