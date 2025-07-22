const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  pharmacist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacist',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 5
  },
  unit: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'Inventories'
});

module.exports = mongoose.model('Inventory', inventorySchema); 