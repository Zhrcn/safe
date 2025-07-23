// backend/scripts/add_medication_ids.js
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');

async function addMedicationIds() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME'); // <-- Change to your DB name
  const prescriptions = await Prescription.find();
  let updatedCount = 0;
  for (const p of prescriptions) {
    let changed = false;
    // Use .map to ensure we get the real array, not a Mongoose array wrapper
    p.medications = p.medications.map(med => {
      if (!med._id) {
        med._id = new mongoose.Types.ObjectId();
        changed = true;
      }
      return med;
    });
    if (changed) {
      await p.save();
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} prescriptions.`);
  process.exit();
}

addMedicationIds().catch(err => {
  console.error(err);
  process.exit(1);
}); 