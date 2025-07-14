// Migration script to copy diagnosedBy to doctorId for all diagnoses in MedicalFile
const mongoose = require('mongoose');
const MedicalFile = require('../models/MedicalFile');

async function migrateDiagnosisDoctorId() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME', { useNewUrlParser: true, useUnifiedTopology: true });
  const files = await MedicalFile.find();
  let updatedCount = 0;
  for (const file of files) {
    let changed = false;
    if (Array.isArray(file.diagnoses)) {
      for (const diag of file.diagnoses) {
        if (!diag.doctorId && diag.diagnosedBy) {
          diag.doctorId = diag.diagnosedBy;
          changed = true;
        }
      }
    }
    if (changed) {
      await file.save();
      updatedCount++;
      console.log(`Updated MedicalFile ${file._id}`);
    }
  }
  console.log(`Migration complete. Updated ${updatedCount} MedicalFile documents.`);
  await mongoose.disconnect();
}

migrateDiagnosisDoctorId().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 