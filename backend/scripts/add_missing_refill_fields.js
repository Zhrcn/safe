// Usage: node backend/scripts/add_missing_refill_fields.js
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safe';

async function addMissingRefillFields() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const prescriptions = await Prescription.find();
  let updatedCount = 0;
  for (const p of prescriptions) {
    let changed = false;
    for (const med of p.medications) {
      if (med.refillCount === undefined) {
        med.refillCount = 0;
        changed = true;
      }
      if (med.refillLimit === undefined) {
        med.refillLimit = 1;
        changed = true;
      }
    }
    if (changed) {
      await p.save();
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} prescriptions.`);
  mongoose.disconnect();
}

addMissingRefillFields().catch(err => {
  console.error('Error updating prescriptions:', err);
  process.exit(1);
}); 