const mongoose = require('mongoose');
const { generatePatientId, generateDoctorId, generatePharmacistId, validateIdFormat, parseId } = require('./utils/idGenerator');
require('dotenv').config({ path: './config.env' });

async function testIdGeneration() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing ID Generation ===\n');

    // Test Patient ID generation
    console.log('Testing Patient ID Generation:');
    const patientBirthDate = new Date('1995-03-15');
    const patientId = await generatePatientId(patientBirthDate);
    console.log(`Birth Date: ${patientBirthDate.toISOString().split('T')[0]}`);
    console.log(`Generated Patient ID: ${patientId}`);
    console.log(`Valid Format: ${validateIdFormat(patientId, 'patient')}`);
    
    const patientInfo = parseId(patientId);
    console.log('Parsed Info:', patientInfo);
    console.log('');

    // Test Doctor ID generation
    console.log('Testing Doctor ID Generation:');
    const doctorBirthDate = new Date('1980-11-22');
    const doctorId = await generateDoctorId(doctorBirthDate);
    console.log(`Birth Date: ${doctorBirthDate.toISOString().split('T')[0]}`);
    console.log(`Generated Doctor ID: ${doctorId}`);
    console.log(`Valid Format: ${validateIdFormat(doctorId, 'doctor')}`);
    
    const doctorInfo = parseId(doctorId);
    console.log('Parsed Info:', doctorInfo);
    console.log('');

    // Test Pharmacist ID generation
    console.log('Testing Pharmacist ID Generation:');
    const pharmacistBirthDate = new Date('1985-07-08');
    const pharmacistId = await generatePharmacistId(pharmacistBirthDate);
    console.log(`Birth Date: ${pharmacistBirthDate.toISOString().split('T')[0]}`);
    console.log(`Generated Pharmacist ID: ${pharmacistId}`);
    console.log(`Valid Format: ${validateIdFormat(pharmacistId, 'pharmacist')}`);
    
    const pharmacistInfo = parseId(pharmacistId);
    console.log('Parsed Info:', pharmacistInfo);
    console.log('');

    // Test multiple generations for same month
    console.log('Testing Multiple Generations for Same Month:');
    const testDate = new Date('1990-05-10');
    for (let i = 0; i < 3; i++) {
      const testPatientId = await generatePatientId(testDate);
      console.log(`Patient ${i + 1}: ${testPatientId}`);
    }
    console.log('');

    // Test ID validation
    console.log('Testing ID Validation:');
    const testIds = [
      'PAT-1995030000000001',
      'DOC-198011000001',
      'PHC-198507000001',
      'INV-199001000001', // Invalid prefix
      'PAT-199503000001', // Invalid format
      'PAT-1995030000000000000001' // Too long
    ];

    testIds.forEach(id => {
      const isValid = validateIdFormat(id, 'patient') || validateIdFormat(id, 'doctor') || validateIdFormat(id, 'pharmacist');
      console.log(`${id}: ${isValid ? 'Valid' : 'Invalid'}`);
    });

    console.log('\nID generation test completed successfully!');

  } catch (error) {
    console.error('Error testing ID generation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testIdGeneration(); 