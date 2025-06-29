require('dotenv').config({ path: __dirname + '/../config/config.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const Pharmacist = require('../models/Pharmacist');

console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: "mongodb+srv://muhammadzouherkanaan:Zouher123@cluster0.jofcmme.mongodb.net/SAFE-Medical_Health_Platform?retryWrites=true&w=majority&appName=Cluster0",
    PORT: process.env.PORT
});

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for seeding...'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 8; 
  const minutes = Math.floor(Math.random() * 4) * 15; 
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const syrianCities = ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Tartus', 'Deir ez-Zor', 'Al-Hasakah', 'Raqqa', 'Daraa'];
const syrianHospitals = [
  'Al-Mouwasat University Hospital',
  'Tishreen Military Hospital',
  'Al-Shami Hospital',
  'Ibn Al-Nafis Hospital',
  'Al-Assad University Hospital',
  'Al-Kindi Hospital',
  'Al-Razi Hospital',
  'Al-Biruni Hospital'
];

const specialties = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'General Medicine'
];

const commonSyrianNames = {
  male: ['Ahmad', 'Mohammed', 'Ali', 'Omar', 'Yasser', 'Karim', 'Bassel', 'Fadi', 'Rami', 'Samir'],
  female: ['Fatima', 'Aisha', 'Layla', 'Nour', 'Hala', 'Rana', 'Sara', 'Maya', 'Zeina', 'Lama']
};

const commonSyrianLastNames = ['Al-Assad', 'Al-Kurdi', 'Al-Halabi', 'Al-Homsi', 'Al-Dimashqi', 'Al-Hamwi', 'Al-Aleppo', 'Al-Lataki'];

const generateSyrianName = () => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = commonSyrianNames[gender][Math.floor(Math.random() * commonSyrianNames[gender].length)];
  const lastName = commonSyrianLastNames[Math.floor(Math.random() * commonSyrianLastNames.length)];
  return { firstName, lastName, gender };
};

const seedDatabase = async () => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      MedicalFile.deleteMany({}),
      Appointment.deleteMany({}),
      Consultation.deleteMany({}),
      Prescription.deleteMany({}),
      Medicine.deleteMany({}),
      Conversation.deleteMany({}),
      Notification.deleteMany({}),
      Pharmacist.deleteMany({})
    ]);
    console.log('Cleared existing data');

    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@safe.com',
      password: 'admin123',
      role: 'admin',
      phoneNumber: '+963123456789',
      gender: 'male'
    });

    const pharmacistUser = await User.create({
      firstName: 'Pharmacist',
      lastName: 'User',
      email: 'pharmacist@safemedical.com',
      password: 'pharm123',
      role: 'pharmacist',
      phoneNumber: '+963987654321',
      gender: 'male',
      address: 'Damascus, Syria'
    });

    const workingHours = [
      { day: 'Monday', startTime: '09:00', endTime: '21:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '21:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '21:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '21:00' },
      { day: 'Friday', startTime: '09:00', endTime: '21:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '21:00' },
      { day: 'Sunday', startTime: '09:00', endTime: '21:00' }
    ];

    const pharmacist = await Pharmacist.create({
      user: pharmacistUser._id,
      licenseNumber: 'PHARM12345',
      pharmacyName: 'Safe Medical Pharmacy',
      pharmacyAddress: 'Damascus, Syria',
      workingHours,
      specialties: ['General Pharmacy', 'Clinical Pharmacy'],
      experienceYears: 5,
      education: [{
        degree: 'PharmD',
        institution: 'University of Damascus',
        yearCompleted: 2018
      }]
    });

    const doctors = [];
    for (let i = 0; i < 5; i++) {
      const { firstName, lastName, gender } = generateSyrianName();
      const doctorUser = await User.create({
        firstName,
        lastName,
        email: `doctor${i + 1}@safe.com`,
        password: 'doctor123',
        role: 'doctor',
        phoneNumber: `+963${Math.floor(Math.random() * 900000000) + 100000000}`,
        gender,
        address: `${syrianCities[Math.floor(Math.random() * syrianCities.length)]}, Syria`
      });
      const doctor = await Doctor.create({
        user: doctorUser._id,
        medicalLicenseNumber: `MD${Math.floor(Math.random() * 10000)}`,
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
        experienceYears: Math.floor(Math.random() * 20) + 5,
        education: [{
          degree: 'MD',
          institution: 'University of Damascus',
          yearCompleted: 2010 + Math.floor(Math.random() * 10)
        }],
        currentHospitalAffiliation: {
          name: syrianHospitals[Math.floor(Math.random() * syrianHospitals.length)],
          address: `${syrianCities[Math.floor(Math.random() * syrianCities.length)]}, Syria`,
          phoneNumber: `+963${Math.floor(Math.random() * 900000000) + 100000000}`
        }
      });
      doctors.push({ user: doctorUser, doctor });
    }

    const patients = [];
    for (let i = 0; i < 10; i++) {
      const { firstName, lastName, gender } = generateSyrianName();
      const patientUser = await User.create({
        firstName,
        lastName,
        email: `patient${i + 1}@safe.com`,
        password: 'patient123',
        role: 'patient',
        phoneNumber: `+963${Math.floor(Math.random() * 900000000) + 100000000}`,
        gender,
        address: `${syrianCities[Math.floor(Math.random() * syrianCities.length)]}, Syria`
      });
      const bloodType = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)];
      const medicalFile = await MedicalFile.create({
        patientId: patientUser._id,
        bloodType,
        allergies: [
          {
            name: 'Penicillin',
            severity: 'moderate',
            reaction: 'Rash and hives'
          }
        ],
        chronicConditions: [
          {
            name: 'Hypertension',
            diagnosisDate: randomDate(new Date(2015, 0, 1), new Date()),
            status: 'managed',
            notes: 'Regular monitoring required'
          }
        ],
        vitalSigns: [
          {
            date: new Date(),
            bloodPressure: '120/80',
            heartRate: 75,
            temperature: 37,
            weight: 70,
            height: 175,
            bmi: 22.9,
            oxygenSaturation: 98
          }
        ],
        emergencyContact: {
          name: `${commonSyrianNames.male[Math.floor(Math.random() * commonSyrianNames.male.length)]} ${commonSyrianLastNames[Math.floor(Math.random() * commonSyrianLastNames.length)]}`,
          relationship: 'Brother',
          phone: `+963${Math.floor(Math.random() * 900000000) + 100000000}`,
          email: `emergency${i + 1}@safe.com`
        },
        insuranceDetails: {
          provider: 'Syrian Insurance Company',
          policyNumber: `POL${Math.floor(Math.random() * 10000)}`,
          groupNumber: `GRP${Math.floor(Math.random() * 1000)}`,
          expiryDate: new Date(2025, 11, 31)
        }
      });
      const patient = await Patient.create({
        user: patientUser._id,
        medicalFile: medicalFile._id,
        bloodType,
        doctorsList: [doctors[Math.floor(Math.random() * doctors.length)].doctor._id]
      });
      patients.push({ user: patientUser, patient, medicalFile });
    }
    for (const { patient } of patients) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)].doctor;
      const appointmentDate = randomDate(new Date(), new Date(2024, 11, 31));
      await Appointment.create({
        patient: patient._id,
        doctor: doctor._id,
        date: appointmentDate,
        time: randomTime(),
        type: ['checkup', 'consultation', 'follow-up'][Math.floor(Math.random() * 3)],
        status: 'scheduled',
        reason: 'Regular checkup',
        notes: 'Please bring previous medical reports'
      });
    }
    for (const { patient } of patients) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)].doctor;
      await Consultation.create({
        patient: patient._id,
        doctor: doctor.user._id,
        question: 'I have been experiencing persistent headaches for the past week. What could be the cause?',
        answer: 'Headaches can be caused by various factors including stress, dehydration, or underlying medical conditions. I recommend scheduling an appointment for a thorough examination.',
        status: 'Answered'
      });
    }
    const medicines = [
      {
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        description: 'Pain reliever and fever reducer',
        category: 'Analgesic',
        availableForms: [{ form: 'Tablet', strengths: ['500mg', '1000mg'] }],
        sideEffects: ['Nausea', 'Liver problems in high doses'],
        manufacturer: 'Syrian Pharmaceutical Industries'
      },
      {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        description: 'Antibiotic for bacterial infections',
        category: 'Antibiotic',
        availableForms: [{ form: 'Capsule', strengths: ['250mg', '500mg'] }],
        sideEffects: ['Diarrhea', 'Allergic reactions'],
        manufacturer: 'Syrian Pharmaceutical Industries'
      }
    ];
    for (const medicine of medicines) {
      await Medicine.create(medicine);
    }
    for (const { patient } of patients) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)].doctor;
      await Prescription.create({
        patientId: patient.user,
        doctorId: doctor.user,
        issueDate: new Date(),
        expiryDate: new Date(2024, 11, 31),
        medications: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Every 6 hours',
            duration: '5 days',
            instructions: 'Take after meals'
          }
        ],
        diagnosis: 'Fever and mild pain',
        status: 'active'
      });
    }
    for (const { patient } of patients) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)].doctor;
      await Conversation.create({
        participants: [patient.user, doctor.user],
        messages: [
          {
            sender: doctor.user,
            recever: patient.user,
            content: 'Hello, how can I help you today?',
            timestamp: new Date()
          },
          {
            sender: patient.user,
            recever: doctor.user,
            content: 'I have a question about my medication.',
            timestamp: new Date()
          }
        ],
        subject: 'Medication Inquiry',
        status: 'active'
      });
    }
    for (const { patient } of patients) {
      await Notification.create({
        user: patient.user,
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'You have an appointment scheduled for tomorrow',
        isRead: false
      });
    }
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};
seedDatabase(); 