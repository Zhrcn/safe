const mongoose = require('mongoose');
const MedicalFile = require('./models/MedicalFile');

async function fixCBC() {
  await mongoose.connect('mongodb://localhost:27017/safe');

  const files = await MedicalFile.find({ "labResults.testName": "Complete Blood Count" });
  for (const file of files) {
    let changed = false;
    for (const lab of file.labResults) {
      if (
        lab.testName === "Complete Blood Count" &&
        (!lab.documents || lab.documents.length === 0)
      ) {
        lab.documents = ["/uploads/labresults/labresult_1752439654756_fake_medical_report_1.pdf"];
        changed = true;
      }
    }
    if (changed) {
      await file.save();
      console.log(`Updated MedicalFile ${file._id}`);
    }
  }
  await mongoose.disconnect();
  console.log("Done!");
}

fixCBC();