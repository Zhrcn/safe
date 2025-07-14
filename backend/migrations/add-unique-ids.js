const mongoose = require('mongoose');
const { generatePatientId, generateDoctorId, generatePharmacistId } = require('../utils/idGenerator');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const User = require('../models/User');
require('dotenv').config({ path: './config/config.env' });

async function migrateUniqueIds() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('\n=== Starting Unique ID Migration ===\n');

    console.log('Migrating Patients...');
    const patients = await Patient.find().populate('user');
    console.log(`Found ${patients.length} patients.`);

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      try {
        let birthDate;
        if (patient.user && patient.user.dateOfBirth) {
          birthDate = patient.user.dateOfBirth;
        } else {
          birthDate = new Date();
        }

        const patientId = await generatePatientId(birthDate);
        patient.patientId = patientId;
        await patient.save();
        console.log(`Patient ${i + 1}/${patients.length}: ${patientId}`);
      } catch (error) {
        console.error(`Error migrating patient ${patient._id}:`, error.message);
      }
    }

    console.log('\nMigrating Doctors...');
    const doctors = await Doctor.find().populate('user');
    console.log(`Found ${doctors.length} doctors.`);

    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      try {
        let birthDate;
        if (doctor.user && doctor.user.dateOfBirth) {
          birthDate = doctor.user.dateOfBirth;
        } else {
          birthDate = new Date();
        }

        const doctorId = await generateDoctorId(birthDate);
        doctor.doctorId = doctorId;
        await doctor.save();
        console.log(`Doctor ${i + 1}/${doctors.length}: ${doctorId}`);
      } catch (error) {
        console.error(`Error migrating doctor ${doctor._id}:`, error.message);
      }
    }

    console.log('\nMigrating Pharmacists...');
    const pharmacists = await Pharmacist.find().populate('user');
    console.log(`Found ${pharmacists.length} pharmacists.`);

    for (let i = 0; i < pharmacists.length; i++) {
      const pharmacist = pharmacists[i];
      try {
        let birthDate;
        if (pharmacist.user && pharmacist.user.dateOfBirth) {
          birthDate = pharmacist.user.dateOfBirth;
        } else {
          birthDate = new Date();
        }

        const pharmacistId = await generatePharmacistId(birthDate);
        pharmacist.pharmacistId = pharmacistId;
        await pharmacist.save();
        console.log(`Pharmacist ${i + 1}/${pharmacists.length}: ${pharmacistId}`);
      } catch (error) {
        console.error(`Error migrating pharmacist ${pharmacist._id}:`, error.message);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Patients migrated: ${patients.length}`);
    console.log(`Doctors migrated: ${doctors.length}`);
    console.log(`Pharmacists migrated: ${pharmacists.length}`);
    console.log('\nMigration completed successfully!');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

if (require.main === module) {
  migrateUniqueIds();
}

module.exports = migrateUniqueIds; 