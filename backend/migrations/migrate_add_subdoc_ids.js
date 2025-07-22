const mongoose = require('mongoose');
const { Types } = mongoose;
const MedicalFile = require('../models/MedicalFile');

const SUBDOC_ARRAYS = [
  'allergies',
  'chronicConditions',
  'labResults',
  'imagingReports',
  'vitalSigns',
  'medicationHistory',
  'immunizations',
  'attachedDocuments',
  'diagnoses',
  'surgicalHistory',
  'familyMedicalHistory',
  'generalMedicalHistory',
];

async function addIdsToSubdocs() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME', { useNewUrlParser: true, useUnifiedTopology: true });
  const files = await MedicalFile.find();
  let updatedCount = 0;
  for (const file of files) {
    let changed = false;
    for (const key of SUBDOC_ARRAYS) {
      if (Array.isArray(file[key])) {
        for (const subdoc of file[key]) {
          if (!subdoc._id) {
            subdoc._id = new Types.ObjectId();
            changed = true;
          }
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

addIdsToSubdocs().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 