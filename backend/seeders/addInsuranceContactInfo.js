const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');

async function addInsuranceContactInfo() {
  await mongoose.connect('mongodb://localhost:27017/safe'); // <-- Replace with your DB name or connection string

  const patients = await Patient.find({}).populate('medicalFile');

  if (patients.length > 0) {
    for (const patient of patients) {
      // Update patient.insurance
      patient.insurance = {
        ...patient.insurance,
        contactPhone: '123-456-7890',
        contactEmail: 'insurance@example.com',
        contactAddress: '123 Main St, City, Country'
      };

      // Update or create patient.medicalFile.insuranceDetails
      if (patient.medicalFile) {
        if (!patient.medicalFile.insuranceDetails) {
          patient.medicalFile.insuranceDetails = {};
        }
        patient.medicalFile.insuranceDetails.contactPhone = '123-456-7890';
        patient.medicalFile.insuranceDetails.contactEmail = 'insurance@example.com';
        patient.medicalFile.insuranceDetails.contactAddress = '123 Main St, City, Country';
        await patient.medicalFile.save();
      }

      await patient.save();
      console.log(`Insurance contact info updated for patient ${patient._id}`);
    }
  } else {
    console.log('No patients found');
  }

  mongoose.disconnect();
}

async function updateOnePatientInsuranceContact() {
  await mongoose.connect('mongodb://localhost:27017/safe'); // <-- Use your DB name/connection string

  // Update this to match a real patient in your DB
  const policyNumber = 'POL1008';

  const result = await Patient.updateOne(
    { 'insurance.policyNumber': policyNumber },
    {
      $set: {
        'insurance.contactPhone': '123-456-7890',
        'insurance.contactEmail': 'insurance@example.com',
        'insurance.contactAddress': '123 Main St, City, Country'
      }
    }
  );

  if (result.modifiedCount > 0) {
    console.log('Insurance contact info updated for patient with policy number', policyNumber);
  } else {
    console.log('No patient found with policy number', policyNumber);
  }

  mongoose.disconnect();
}

addInsuranceContactInfo();
// updateOnePatientInsuranceContact();