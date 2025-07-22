const mongoose = require('mongoose');

const distributorSchema = new mongoose.Schema({
  distributorId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required.'],
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  inventory: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'Distributors'
});

// TODO: Add pre-save hook for distributorId if needed

module.exports = mongoose.model('Distributor', distributorSchema); 