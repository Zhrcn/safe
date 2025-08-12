const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  pharmacist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacist',
    required: true,
    index: true
  },
  medicines: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
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
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active'
    }
  }]
}, {
  timestamps: true,
  collection: 'Inventories'
});

module.exports = mongoose.model('Inventory', inventorySchema); 