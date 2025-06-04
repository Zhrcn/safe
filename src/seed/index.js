const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine');
const MedicalFile = require('../models/MedicalFile');
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const Conversation = require('../models/Conversation');

const { connect } = require('../lib/db');

async function seedDatabase() {
  try {
    await connect();
    
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Pharmacist.deleteMany({}),
      Patient.deleteMany({}),
      Medicine.deleteMany({}),
      MedicalFile.deleteMany({}),
      Notification.deleteMany({}),
      Appointment.deleteMany({}),
      Prescription.deleteMany({}),
      Consultation.deleteMany({}),
      Conversation.deleteMany({})
    ]);

    const doctorUser = await User.create({
      email: 'doctor@safe.com',
      password: 'doctor123',
      role: 'doctor',
      firstName: 'Ali',
      lastName: 'Omar'
    });

    const pharmacistUser = await User.create({
      email: 'pharmacist@safe.com',
      password: 'pharmacist123',
      role: 'pharmacist',
      firstName: 'Fatima',
      lastName: 'Abbas'
    });

    const patientUser = await User.create({
      email: 'patient@safe.com',
      password: 'patient123',
      role: 'patient',
      firstName: 'Ali',
      lastName: 'Ahmed'
    });

    const doctor = await Doctor.create({
      user: doctorUser._id,
      medicalLicenseNumber: 'MD-123456',
      specialty: 'Cardiology',
      experienceYears: 10,
      education: [{
        degree: 'MD',
        institution: 'Harvard Medical School',
        yearCompleted: 2010
      }],
      currentHospital: {
        name: 'General Hospital',
        address: '123 Main St',
        phoneNumber: '+96391234567890'
      }
    });

    const pharmacist = await Pharmacist.create({
      user: pharmacistUser._id,
      licenseNumber: 'PH-987654',
      pharmacy: 'City Pharmacy',
      experience: 8,
      specialization: 'Clinical Pharmacy',
      address: {
        street: '456 Pharmacy Lane',
        city: 'Boston',
        state: 'MA',
        zipCode: '02115'
      },
      contactNumber: '+96395559876543'
    });

    const patient = await Patient.create({
      user: patientUser._id,
      emergencyContact: {
        name: 'Ali Omar',
        relationship: 'Father',
        phone: '+963912345678'
      },
      bloodType: 'O+',
      height: 170,
      weight: 65
    });

    const medicines = await Medicine.create([
      {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin Trihydrate',
        category: 'Antibiotic',
        description: 'Antibiotic for bacterial infections',
        dosage: '500mg',
        manufacturer: 'PharmaCorp',
        price: 12.99,
        availableStock: 100,
        usageInstructions: 'Take every 8 hours for 7 days'
      },
      {
        name: 'Lisinopril',
        genericName: 'Lisinopril Dihydrate',
        category: 'Cardiovascular',
        description: 'Blood pressure medication',
        dosage: '10mg',
        manufacturer: 'MediHealth',
        price: 8.50,
        availableStock: 75,
        usageInstructions: 'Take once daily'
      }
    ]);

    const medicalFile = await MedicalFile.create({
      patientId: patient._id,
      allergies: [{
        name: 'Penicillin',
        reaction: 'Rash',
        severity: 'severe'
      }],
      conditions: [{
        name: 'Hypertension',
        diagnosisDate: new Date('2020-01-15'),
        status: 'active'
      }],
      medications: [{
        medicine: medicines[0]._id,
        dosage: '500mg',
        frequency: 'Three times daily',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-03-08')
      }]
    });

    const conversation = await Conversation.create({
      subject: 'Follow-up Consultation',
      participants: [doctorUser._id, patientUser._id],
      messages: [{
        sender: doctorUser._id,
        content: 'Hello, how are you feeling today?',
        timestamp: new Date()
      }]
    });

    const consultation = await Consultation.create({
      patientId: patient._id,
      doctorId: doctor._id,
      reason: 'Follow-up on blood pressure',
      notes: 'Patient reported feeling better after medication adjustment'
    });

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date(Date.now() + 86400000), 
      duration: 30,
      reason: 'Annual checkup',
      status: 'scheduled'
    });

    const prescription = await Prescription.create({
      patientId: patient._id,
      doctorId: doctor._id,
      diagnosis: 'Hypertension',
      medicines: [{
        medicine: medicines[1]._id,
        dosage: '10mg',
        frequency: 'Once daily',
        duration: 30
      }],
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 86400000), 
      instructions: 'Take with food'
    });

    await Notification.create({
      title: 'Appointment Reminder',
      user: patientUser._id,
      message: 'Your appointment is scheduled for tomorrow at 10 AM',
      type: 'appointment',
      read: false
    });

    console.log('Database seeded successfully!');
    console.log(`Doctor ID: ${doctor._id}`);
    console.log(`Patient ID: ${patient._id}`);
    console.log(`Pharmacist ID: ${pharmacist._id}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = seedDatabase;
