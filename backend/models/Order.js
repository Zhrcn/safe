const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: false } // price is now optional
}, { _id: false });

const orderSchema = new mongoose.Schema({
  pharmacist: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacist', required: true },
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'shipped', 'completed', 'cancelled', 'sent_to_driver'],
    default: 'pending'
  },
  notes: { type: String },
  responseMessage: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'Orders'
});

module.exports = mongoose.model('Order', orderSchema); 