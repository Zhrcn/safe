// Migration script to set doctorId for all subdocuments in MedicalFile
const mongoose = require('mongoose');
const MedicalFile = require('../models/MedicalFile');

async function migrateAllDoctorId() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME', { useNewUrlParser: true, useUnifiedTopology: true });
  const files = await MedicalFile.find();
  let updatedCount = 0;
  for (const file of files) {
    let changed = false;
    // Allergies
    if (Array.isArray(file.allergies)) {
      for (const sub of file.allergies) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Chronic Conditions
    if (Array.isArray(file.chronicConditions)) {
      for (const sub of file.chronicConditions) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Lab Results
    if (Array.isArray(file.labResults)) {
      for (const sub of file.labResults) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Imaging Reports
    if (Array.isArray(file.imagingReports)) {
      for (const sub of file.imagingReports) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Medications
    if (Array.isArray(file.medicationHistory)) {
      for (const sub of file.medicationHistory) {
        if (!sub.doctorId) {
          sub.doctorId = sub.prescribedBy || null;
          changed = true;
        }
      }
    }
    // Immunizations
    if (Array.isArray(file.immunizations)) {
      for (const sub of file.immunizations) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Attached Documents
    if (Array.isArray(file.attachedDocuments)) {
      for (const sub of file.attachedDocuments) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Diagnoses
    if (Array.isArray(file.diagnoses)) {
      for (const sub of file.diagnoses) {
        if (!sub.doctorId) {
          sub.doctorId = sub.diagnosedBy || null;
          changed = true;
        }
      }
    }
    // Surgical History
    if (Array.isArray(file.surgicalHistory)) {
      for (const sub of file.surgicalHistory) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // Family Medical History
    if (Array.isArray(file.familyMedicalHistory)) {
      for (const sub of file.familyMedicalHistory) {
        if (!sub.doctorId) {
          sub.doctorId = null;
          changed = true;
        }
      }
    }
    // General Medical History
    if (Array.isArray(file.generalMedicalHistory)) {
      for (const sub of file.generalMedicalHistory) {
        if (!sub.doctorId) {
          sub.doctorId = null;
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

migrateAllDoctorId().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 