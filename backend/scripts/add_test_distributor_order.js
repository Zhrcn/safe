// Usage: node backend/scripts/add_test_distributor_order.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Pharmacist = require('../models/Pharmacist');
const Distributor = require('../models/Distributor');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safe';

async function addTestOrder() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Find a pharmacist
  const pharmacist = await Pharmacist.findOne();
  if (!pharmacist) {
    console.error('No pharmacist found. Please create a pharmacist first.');
    process.exit(1);
  }

  // Find the distributor for the specific user email
  const distributorUser = await User.findOne({ email: 'globalmeds@distributor.com' });
  if (!distributorUser) {
    console.error('No distributor user found with email globalmeds@distributor.com.');
    process.exit(1);
  }
  const distributor = await Distributor.findOne({ user: distributorUser._id });
  if (!distributor) {
    console.error('No distributor found for user globalmeds@distributor.com.');
    process.exit(1);
  }

  // Find a medicine (optional, for item reference)
  let medicine = await Medicine.findOne();
  if (!medicine) {
    // Create a dummy medicine if none exists
    medicine = await Medicine.create({
      name: 'Test Medicine',
      description: 'A test medicine',
      price: 10,
      stock: 100
    });
  }

  // Create a test order
  const order = await Order.create({
    pharmacist: pharmacist._id,
    distributor: distributor._id,
    items: [
      {
        medicine: medicine._id,
        quantity: 5,
        price: 10
      }
    ],
    notes: 'Test order from script',
    status: 'pending'
  });

  console.log('Test order created:', order);
  await mongoose.disconnect();
  process.exit(0);
}

addTestOrder(); 