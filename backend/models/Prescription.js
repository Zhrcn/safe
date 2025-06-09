console.log('Loading Prescription model...');
const mongoose = require('mongoose');

const prescribedMedicationSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true
  },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, 
  dosage: { 
    type: String,
    required: true,
    trim: true
  },
  frequency: { 
    type: String,
    required: true,
    trim: true
  },
  duration: { 
    type: String,
    required: true, 
    trim: true
  },
  route: {
    type: String,
    trim: true
  },
  instructions: { 
    type: String,
    trim: true
  }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true
  },
  issueDate: { 
    type: Date,
    default: Date.now,
    required: true
  },
  expiryDate: { 
    type: Date,
    required: true
  },
  medications: [prescribedMedicationSchema],
  diagnosis: { 
    type: String,
    required: true,
    trim: true
  },
  notes: { 
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'partially_filled', 'filled', 'expired', 'cancelled', 'pending_review'],
    default: 'active'
  },
  dispenseHistory: [{ 
    pharmacistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    },
    dispenseDate: {
      type: Date,
      default: Date.now
    },
    quantityDispensed: {
      type: String, 
      trim: true
    },
    pharmacyNotes: {
      type: String,
      trim: true
    }
  }],
  
}, {
  timestamps: true,
  collection: 'Prescriptions'
});

prescriptionSchema.index({ expiryDate: 1 });
prescriptionSchema.index({ status: 1, patientId: 1 });


const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
