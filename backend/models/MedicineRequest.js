const mongoose = require('mongoose');

const medicineRequestSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacist',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded'],
    default: 'pending'
  },
  available: {
    type: Boolean,
    default: null
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicineRequest', medicineRequestSchema); 