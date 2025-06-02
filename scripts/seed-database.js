// Script to seed the database with initial data
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Utility function to add timeout to promises
const withTimeout = (promise, timeoutMs, errorMessage) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise])
    .finally(() => clearTimeout(timeoutId));
};

// Utility function to check if a collection exists and create it if it doesn't
async function ensureCollection(db, collectionName) {
  try {
    // Check if collection exists
    const collections = await withTimeout(
      db.listCollections({ name: collectionName }).toArray(),
      5000,
      `Timeout checking if collection ${collectionName} exists`
    );
    
    if (collections.length === 0) {
      console.log(`Creating collection: ${collectionName}`);
      await withTimeout(
        db.createCollection(collectionName),
        5000,
        `Timeout creating collection ${collectionName}`
      );
      return { created: true, message: `Collection ${collectionName} created successfully` };
    } else {
      return { created: false, message: `Collection ${collectionName} already exists` };
    }
  } catch (error) {
    console.error(`Error ensuring collection ${collectionName}:`, error.message);
    throw error;
  }
}

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function seedDatabase() {
  let client;
  try {
    console.log('Connecting to MongoDB Atlas...');
    client = await withTimeout(
      MongoClient.connect(MONGODB_URI, {
        connectTimeoutMS: 10000, // 10 seconds timeout for connection
        socketTimeoutMS: 45000,  // 45 seconds for socket operations
      }),
      15000,
      'Connection to MongoDB timed out'
    );
    
    const db = client.db();
    console.log('Connected to database:', db.databaseName);
    
    // Define collections to ensure exist
    const collections = [
      'Users', 
      'MedicalFiles', 
      'Appointments', 
      'Prescriptions', 
      'Consultations',
      'Conversations'
    ];
    
    // Ensure all collections exist
    console.log('Checking and creating collections if needed...');
    for (const collection of collections) {
      try {
        const result = await ensureCollection(db, collection);
        console.log(result.message);
      } catch (error) {
        console.error(`Error with collection ${collection}:`, error.message);
        // Continue with other collections even if one fails
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
    
    // Create multiple doctors
    const doctorPassword = await bcrypt.hash('doctor123', salt);
    const doctors = [
      { name: 'Dr. Ahmad Ali', email: 'doctor@example.com', password: doctorPassword, role: 'doctor', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isActive: true, specialization: 'Cardiologist', licenseNumber: 'MD12345678', yearsOfExperience: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dr. Mohammed Kanaan', email: 'doctor2@example.com', password: doctorPassword, role: 'doctor', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isActive: true, specialization: 'Neurologist', licenseNumber: 'MD98765432', yearsOfExperience: 8, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dr. Laila Al-hassan', email: 'doctor3@example.com', password: doctorPassword, role: 'doctor', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', isActive: true, specialization: 'Oncologist', licenseNumber: 'MD11111111', yearsOfExperience: 12, createdAt: new Date(), updatedAt: new Date() }
    ];

    console.log('Creating doctors...');
    const doctorResults = await db.collection('Users').insertMany(doctors);
    const doctorIds = Object.values(doctorResults.insertedIds);
    console.log(`Created ${doctorResults.insertedCount} doctors`);

    // Create multiple patients
    const patientPassword = await bcrypt.hash('patient123', salt);
    const patients = [
      { name: 'Alice', email: 'patient1@example.com', password: patientPassword, role: 'patient', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', isActive: true, dateOfBirth: new Date('1990-05-15'), gender: 'Female', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bob', email: 'patient2@example.com', password: patientPassword, role: 'patient', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', isActive: true, dateOfBirth: new Date('1985-02-20'), gender: 'Male', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Charlie', email: 'patient3@example.com', password: patientPassword, role: 'patient', avatar: 'https://randomuser.me/api/portraits/women/67.jpg', isActive: true, dateOfBirth: new Date('1995-08-10'), gender: 'Female', createdAt: new Date(), updatedAt: new Date() },
      { name: 'David', email: 'patient4@example.com', password: patientPassword, role: 'patient', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isActive: true, dateOfBirth: new Date('1980-01-01'), gender: 'Male', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Eve', email: 'patient5@example.com', password: patientPassword, role: 'patient', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isActive: true, dateOfBirth: new Date('1992-06-25'), gender: 'Female', createdAt: new Date(), updatedAt: new Date() }
    ];

    console.log('Creating patients...');
    const patientResults = await db.collection('Users').insertMany(patients);
    const patientIds = Object.values(patientResults.insertedIds);
    console.log(`Created ${patientResults.insertedCount} patients`);

    // Create appointments
    const appointments = [];
    for (let i = 0; i < 10; i++) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + i);
      tomorrow.setHours(10, 0, 0, 0);
      appointments.push({
        patientId: patientIds[i % patientIds.length],
        doctorId: doctorIds[i % doctorIds.length],
        date: tomorrow,
        time: '10:00 AM',
        status: 'scheduled',
        reason: 'Annual checkup',
        notes: 'Patient has reported mild headaches',
        followUp: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Creating appointments...');
    const appointmentResults = await db.collection('Appointments').insertMany(appointments);
    console.log(`Created ${appointmentResults.insertedCount} appointments`);

    // Create prescriptions
    const prescriptions = [];
    for (let i = 0; i < 10; i++) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      prescriptions.push({
        patientId: patientIds[i % patientIds.length],
        doctorId: doctorIds[i % doctorIds.length],
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
      });
    }

    console.log('Creating prescriptions...');
    const prescriptionResults = await db.collection('Prescriptions').insertMany(prescriptions);
    console.log(`Created ${prescriptionResults.insertedCount} prescriptions`);

    // Create consultations
    const consultations = [];
    for (let i = 0; i < 10; i++) {
      consultations.push({
        patientId: patientIds[i % patientIds.length],
        doctorId: doctorIds[i % doctorIds.length],
        subject: 'Skin rash concern',
        message: 'I have developed a rash on my arm that is itchy and red. It started about 3 days ago.',
        status: 'pending',
        preferredResponseTime: 'within_24_hours',
        attachments: [
          {
            name: 'rash_photo.jpg',
            type: 'image/jpeg',
            url: 'https://example.com/placeholder-image.jpg',
            uploadedAt: new Date()
          }
        ],
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Creating consultations...');
    const consultationResults = await db.collection('Consultations').insertMany(consultations);
    console.log(`Created ${consultationResults.insertedCount} consultations`);

    // Create conversations
    const conversations = [];
    for (let i = 0; i < 10; i++) {
      conversations.push({
        participants: [
          { userId: patientIds[i % patientIds.length], role: 'patient' },
          { userId: doctorIds[i % doctorIds.length], role: 'doctor' }
        ],
        messages: [
          {
            senderId: patientIds[i % patientIds.length],
            content: 'Hello Dr. Smith, I have a question about my prescription.',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            read: true
          },
          {
            senderId: doctorIds[i % doctorIds.length],
            content: 'Hello Sarah, how can I help you today?',
            timestamp: new Date(Date.now() - 82800000), // 23 hours ago
            read: true
          },
          {
            senderId: patientIds[i % patientIds.length],
            content: 'Is it normal to feel a bit dizzy after taking the medication?',
            timestamp: new Date(Date.now() - 79200000), // 22 hours ago
            read: true
          },
          {
            senderId: doctorIds[i % doctorIds.length],
            content: 'A little dizziness can be a side effect. Try taking it with food. If it persists or gets worse, please let me know right away.',
            timestamp: new Date(Date.now() - 75600000), // 21 hours ago
            read: false
          }
        ],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 75600000),
        lastMessageAt: new Date(Date.now() - 75600000)
      });
    }

    console.log('Creating conversations...');
    const conversationResults = await db.collection('Conversations').insertMany(conversations);
    console.log(`Created ${conversationResults.insertedCount} conversations`);

    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    // Always close the connection, even if there was an error
    if (client) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError.message);
      }
    }
  }
}

// Run the seed function
seedDatabase(); 