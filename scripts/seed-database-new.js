// Script to seed the database with initial data for testing
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

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

// MongoDB connection string - using direct value since .env.local might not be loaded correctly
const MONGODB_URI = 'mongodb://localhost:27017/safe';

console.log('Using MongoDB URI:', MONGODB_URI);

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

    const collections = [
      'Users',
      'Doctors',
      'Patients',
      'MedicalFiles',
      'Appointments',
      'Prescriptions',
      'Consultations',
      'Conversations',
      'Messages'
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

    // Clear existing data if requested
    const clearExisting = process.argv.includes('--clear');
    if (clearExisting) {
      console.log('Clearing existing data...');
      for (const collection of collections) {
        await db.collection(collection).deleteMany({});
        console.log(`Cleared collection: ${collection}`);
      }
    } else {
      // Check if we already have users
      const usersCount = await db.collection('Users').countDocuments();
      if (usersCount > 0) {
        console.log(`Database already has ${usersCount} users. Skipping seed data.`);
        console.log('If you want to reseed, please use --clear flag or run: node seed-database.js --clear');
        await client.close();
        return;
      }
    }

    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // Create admin user
    const adminUser = {
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@safe.com',
      password: defaultPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating admin user...');
    const adminResult = await db.collection('Users').insertOne(adminUser);
    console.log('Admin user created with ID:', adminResult.insertedId);

    // Create a doctor user
    const doctorUser = {
      name: 'Dr. John Smith',
      firstName: 'John',
      lastName: 'Smith',
      email: 'doctor@safe.com',
      password: defaultPassword,
      role: 'doctor',
      phoneNumber: '+1234567890',
      address: '123 Medical Center Dr, Healthcare City',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      gender: 'male',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating doctor user...');
    const doctorResult = await db.collection('Users').insertOne(doctorUser);
    const doctorUserId = doctorResult.insertedId;
    console.log('Doctor user created with ID:', doctorUserId);

    // Create doctor profile
    const doctorProfile = {
      user: doctorUserId,
      medicalLicenseNumber: 'MD12345678',
      specialty: 'Cardiology',
      experienceYears: 15,
      education: [
        {
          degree: 'MD',
          institution: 'Harvard Medical School',
          yearCompleted: 2008
        },
        {
          degree: 'Cardiology Residency',
          institution: 'Mayo Clinic',
          yearCompleted: 2012
        }
      ],
      achievements: [
        'Board Certified in Cardiology',
        'Published 15 research papers',
        'Chief of Cardiology at City Hospital (2015-2020)'
      ],
      hospital: {
        name: 'City General Hospital',
        address: '456 Hospital Avenue, Healthcare City',
        phoneNumber: '+1987654321'
      },
      consultationFee: 150,
      rating: 4.9,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating doctor profile...');
    const doctorProfileResult = await db.collection('Doctors').insertOne(doctorProfile);
    console.log('Doctor profile created with ID:', doctorProfileResult.insertedId);

    // Create a patient user
    const patientUser = {
      name: 'Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'patient@safe.com',
      password: defaultPassword,
      role: 'patient',
      phoneNumber: '+1122334455',
      address: '789 Residential St, Healthcare City',
      dateOfBirth: new Date(1990, 5, 15), // June 15, 1990
      age: 33,
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      gender: 'female',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating patient user...');
    const patientResult = await db.collection('Users').insertOne(patientUser);
    const patientUserId = patientResult.insertedId;
    console.log('Patient user created with ID:', patientUserId);

    // Create patient profile
    const patientProfile = {
      user: patientUserId,
      bloodType: 'A+',
      height: 165, // cm
      weight: 65, // kg
      emergencyContact: {
        name: 'Michael Johnson',
        relationship: 'Spouse',
        phoneNumber: '+1987654321',
        address: '789 Residential St, Healthcare City'
      },
      insurance: {
        provider: 'HealthGuard Insurance',
        policyNumber: 'HGI-12345678',
        expiryDate: new Date(2025, 11, 31), // Dec 31, 2025
        coverageType: 'Comprehensive',
        groupNumber: 'GRP-987654'
      },
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension', 'Asthma'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating patient profile...');
    const patientProfileResult = await db.collection('Patients').insertOne(patientProfile);
    console.log('Patient profile created with ID:', patientProfileResult.insertedId);

    // Create medical file for the patient
    const medicalFile = {
      patientId: patientUserId,
      bloodType: 'A+',
      allergies: [
        {
          name: 'Penicillin',
          severity: 'Severe',
          reaction: 'Rash, difficulty breathing',
          diagnosedDate: new Date(2010, 3, 15) // April 15, 2010
        },
        {
          name: 'Peanuts',
          severity: 'Moderate',
          reaction: 'Hives, swelling',
          diagnosedDate: new Date(2005, 6, 22) // July 22, 2005
        }
      ],
      conditions: [
        {
          name: 'Hypertension',
          diagnosedDate: new Date(2018, 8, 10), // September 10, 2018
          status: 'Ongoing',
          notes: 'Controlled with medication'
        },
        {
          name: 'Asthma',
          diagnosedDate: new Date(2000, 2, 5), // March 5, 2000
          status: 'Ongoing',
          notes: 'Mild, triggered by seasonal allergies'
        }
      ],
      labResults: [
        {
          testName: 'Complete Blood Count',
          date: new Date(2023, 1, 15), // February 15, 2023
          results: [
            { name: 'WBC', value: '7.8', unit: 'K/uL', normalRange: '4.5-11.0', status: 'Normal' },
            { name: 'RBC', value: '4.9', unit: 'M/uL', normalRange: '4.5-5.9', status: 'Normal' },
            { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '12.0-15.5', status: 'Normal' },
            { name: 'Hematocrit', value: '42', unit: '%', normalRange: '36-46', status: 'Normal' },
            { name: 'Platelets', value: '250', unit: 'K/uL', normalRange: '150-450', status: 'Normal' }
          ],
          orderedBy: doctorUserId,
          facility: 'City General Hospital Laboratory',
          notes: 'Routine annual checkup'
        },
        {
          testName: 'Lipid Panel',
          date: new Date(2023, 1, 15), // February 15, 2023
          results: [
            { name: 'Total Cholesterol', value: '195', unit: 'mg/dL', normalRange: '<200', status: 'Normal' },
            { name: 'HDL', value: '62', unit: 'mg/dL', normalRange: '>40', status: 'Normal' },
            { name: 'LDL', value: '110', unit: 'mg/dL', normalRange: '<100', status: 'Borderline High' },
            { name: 'Triglycerides', value: '115', unit: 'mg/dL', normalRange: '<150', status: 'Normal' }
          ],
          orderedBy: doctorUserId,
          facility: 'City General Hospital Laboratory',
          notes: 'Monitoring for cardiovascular risk factors'
        }
      ],
      imaging: [
        {
          type: 'Chest X-ray',
          date: new Date(2022, 10, 8), // November 8, 2022
          facility: 'City General Hospital Radiology',
          requestedBy: doctorUserId,
          results: 'Normal chest radiograph. No active disease.',
          imageUrl: 'https://example.com/placeholder-xray.jpg',
          notes: 'Routine examination for asthma monitoring'
        }
      ],
      prescriptionsList: [],
      medicationsList: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: new Date(2018, 8, 15), // September 15, 2018
          endDate: null,
          prescribedBy: doctorUserId,
          purpose: 'Hypertension management',
          instructions: 'Take in the morning with food',
          status: 'Active'
        },
        {
          name: 'Albuterol Inhaler',
          dosage: '90mcg, 2 puffs',
          frequency: 'As needed',
          startDate: new Date(2000, 3, 10), // April 10, 2000
          endDate: null,
          prescribedBy: doctorUserId,
          purpose: 'Asthma relief',
          instructions: 'Use as needed for shortness of breath or wheezing',
          status: 'Active'
        }
      ],
      immunizations: [
        {
          name: 'Influenza Vaccine',
          date: new Date(2022, 9, 5), // October 5, 2022
          administeredBy: 'City General Hospital',
          batchNumber: 'FL-2022-456789',
          notes: 'Annual flu shot'
        },
        {
          name: 'COVID-19 Vaccine',
          date: new Date(2021, 3, 15), // April 15, 2021
          administeredBy: 'City General Hospital',
          batchNumber: 'CV-2021-123456',
          notes: 'Second dose of Pfizer-BioNTech vaccine'
        }
      ],
      medicalHistory: {
        pastSurgeries: [
          {
            procedure: 'Appendectomy',
            date: new Date(2005, 5, 12), // June 12, 2005
            hospital: 'Memorial Hospital',
            surgeon: 'Dr. Robert Chen',
            notes: 'Laparoscopic procedure, no complications'
          }
        ],
        familyHistory: [
          { condition: 'Hypertension', relationship: 'Father' },
          { condition: 'Type 2 Diabetes', relationship: 'Maternal Grandmother' },
          { condition: 'Breast Cancer', relationship: 'Maternal Aunt' }
        ],
        socialHistory: {
          smoking: 'Never',
          alcohol: 'Occasional',
          exercise: 'Regular - 3 times per week',
          diet: 'Balanced, low sodium due to hypertension',
          occupation: 'Software Engineer',
          notes: 'Works remotely, sedentary job'
        }
      },
      vitalSigns: [
        {
          date: new Date(2023, 1, 15), // February 15, 2023
          bloodPressure: '125/82',
          heartRate: 72,
          respiratoryRate: 16,
          temperature: 98.6,
          oxygenSaturation: 99,
          recordedBy: doctorUserId
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating medical file...');
    const medicalFileResult = await db.collection('MedicalFiles').insertOne(medicalFile);
    console.log('Medical file created with ID:', medicalFileResult.insertedId);

    // Create appointments between the doctor and patient
    const now = new Date();
    const appointments = [
      {
        patientId: patientUserId,
        doctorId: doctorUserId,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7), // 7 days from now
        time: '10:00 AM',
        status: 'scheduled',
        reason: 'Annual physical examination',
        notes: 'Patient requested morning appointment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        patientId: patientUserId,
        doctorId: doctorUserId,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 15), // Last month
        time: '2:30 PM',
        status: 'completed',
        reason: 'Follow-up for hypertension',
        notes: 'Blood pressure well controlled. Continue current medication.',
        followUp: 'Schedule next appointment in 3 months',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 10),
        updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15)
      },
      {
        patientId: patientUserId,
        doctorId: doctorUserId,
        date: new Date(now.getFullYear(), now.getMonth() + 2, 5), // 2 months from now
        time: '11:15 AM',
        status: 'scheduled',
        reason: 'Cardiology consultation',
        notes: 'Discuss recent lipid panel results',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Creating appointments...');
    const appointmentResults = await db.collection('Appointments').insertMany(appointments);
    console.log(`Created ${appointmentResults.insertedCount} appointments`);

    // Create a prescription
    const prescription = {
      patientId: patientUserId,
      doctorId: doctorUserId,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15), // Last month
      expiryDate: new Date(now.getFullYear(), now.getMonth() + 5, 15), // 6 months validity
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '6 months',
          instructions: 'Take in the morning with food'
        }
      ],
      diagnosis: 'Hypertension',
      notes: 'Monitor blood pressure weekly. Report if consistently above 140/90.',
      status: 'active',
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 15),
      updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15)
    };

    console.log('Creating prescription...');
    const prescriptionResult = await db.collection('Prescriptions').insertOne(prescription);
    console.log('Prescription created with ID:', prescriptionResult.insertedId);

    // Create a conversation between the doctor and patient
    const conversation = {
      participants: [
        { userId: patientUserId, role: 'patient' },
        { userId: doctorUserId, role: 'doctor' }
      ],
      messages: [
        {
          senderId: patientUserId,
          content: 'Hello Dr. Smith, I have a question about my blood pressure medication.',
          timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), // 3 days ago
          read: true
        },
        {
          senderId: doctorUserId,
          content: 'Hello Sarah, what would you like to know?',
          timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 2), // 3 days ago, 2 hours later
          read: true
        },
        {
          senderId: patientUserId,
          content: 'I sometimes feel dizzy in the morning after taking Lisinopril. Is this normal?',
          timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 3), // 3 days ago, 3 hours later
          read: true
        },
        {
          senderId: doctorUserId,
          content: 'Some dizziness can occur, especially when you first stand up. Try taking it with food and stay hydrated. If it persists or worsens, we should adjust your dosage. Let me know how it goes over the next few days.',
          timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 4), // 3 days ago, 4 hours later
          read: true
        },
        {
          senderId: patientUserId,
          content: 'Thank you, Dr. Smith. I\'ll try taking it with breakfast and drinking more water.',
          timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), // 2 days ago
          read: true
        },
        {
          senderId: doctorUserId,
          content: 'That sounds good. Don\'t hesitate to reach out if you have any other concerns before our next appointment.',
          timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 1), // 2 days ago, 1 hour later
          read: false
        }
      ],
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
      updatedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 1),
      lastMessageAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 1)
    };

    console.log('Creating conversation...');
    const conversationResult = await db.collection('Conversations').insertOne(conversation);
    console.log('Conversation created with ID:', conversationResult.insertedId);

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
