// Script to seed the database with initial data
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    
    console.log('Connected to database:', db.databaseName);
    
    // Create collections if they don't exist
    const collections = ['Users', 'MedicalFiles', 'Appointments', 'Prescriptions'];
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(col => col.name);
    
    for (const collection of collections) {
      if (!existingCollectionNames.includes(collection)) {
        console.log(`Creating collection: ${collection}`);
        await db.createCollection(collection);
      } else {
        console.log(`Collection ${collection} already exists`);
      }
    }
    
    // Check if we already have users
    const usersCount = await db.collection('Users').countDocuments();
    
    if (usersCount > 0) {
      console.log(`Database already has ${usersCount} users. Skipping seed data.`);
      console.log('If you want to reseed, please drop the collections first.');
      await client.close();
      return;
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating admin user...');
    const adminResult = await db.collection('Users').insertOne(adminUser);
    console.log('Admin user created with ID:', adminResult.insertedId);
    
    // Create a doctor
    const doctorPassword = await bcrypt.hash('doctor123', salt);
    const doctorUser = {
      name: 'Dr. John Smith',
      email: 'doctor@example.com',
      password: doctorPassword,
      role: 'doctor',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isActive: true,
      specialization: 'Cardiologist',
      licenseNumber: 'MD12345678',
      yearsOfExperience: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating doctor user...');
    const doctorResult = await db.collection('Users').insertOne(doctorUser);
    console.log('Doctor user created with ID:', doctorResult.insertedId);
    
    // Create a patient
    const patientPassword = await bcrypt.hash('patient123', salt);
    const patientUser = {
      name: 'Sarah Johnson',
      email: 'patient@example.com',
      password: patientPassword,
      role: 'patient',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isActive: true,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Female',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating patient user...');
    const patientResult = await db.collection('Users').insertOne(patientUser);
    console.log('Patient user created with ID:', patientResult.insertedId);
    
    // Create a pharmacist
    const pharmacistPassword = await bcrypt.hash('pharmacist123', salt);
    const pharmacistUser = {
      name: 'Michael Chen',
      email: 'pharmacist@example.com',
      password: pharmacistPassword,
      role: 'pharmacist',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      isActive: true,
      licenseNumber: 'PH98765432',
      pharmacy: {
        name: 'HealthPlus Pharmacy',
        address: '123 Main Street, Anytown',
        phoneNumber: '555-123-4567'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating pharmacist user...');
    const pharmacistResult = await db.collection('Users').insertOne(pharmacistUser);
    console.log('Pharmacist user created with ID:', pharmacistResult.insertedId);
    
    // Create a medical file for the patient
    const medicalFile = {
      patientId: patientResult.insertedId,
      allergies: ['Penicillin', 'Peanuts'],
      chronicDiseases: ['Hypertension'],
      bloodType: 'A+',
      height: 165,
      weight: 60,
      medicalHistory: [
        {
          date: new Date('2023-01-15'),
          doctorId: doctorResult.insertedId,
          diagnosis: 'Seasonal flu',
          treatment: 'Rest and hydration',
          notes: 'Patient should recover within a week'
        }
      ],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: new Date('2023-01-01'),
          active: true,
          prescribedBy: doctorResult.insertedId
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating medical file...');
    const medicalFileResult = await db.collection('MedicalFiles').insertOne(medicalFile);
    console.log('Medical file created with ID:', medicalFileResult.insertedId);
    
    // Create an appointment
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const appointment = {
      patientId: patientResult.insertedId,
      doctorId: doctorResult.insertedId,
      date: tomorrow,
      time: '10:00 AM',
      status: 'scheduled',
      reason: 'Annual checkup',
      notes: 'Patient has reported mild headaches',
      followUp: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating appointment...');
    const appointmentResult = await db.collection('Appointments').insertOne(appointment);
    console.log('Appointment created with ID:', appointmentResult.insertedId);
    
    // Create a prescription
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const prescription = {
      patientId: patientResult.insertedId,
      doctorId: doctorResult.insertedId,
      date: new Date(),
      expiryDate: expiryDate,
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'Take with food'
        }
      ],
      diagnosis: 'Bacterial infection',
      notes: 'Patient should complete the full course',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating prescription...');
    const prescriptionResult = await db.collection('Prescriptions').insertOne(prescription);
    console.log('Prescription created with ID:', prescriptionResult.insertedId);
    
    console.log('Database seeded successfully!');
    
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 