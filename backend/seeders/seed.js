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

const workingHours = [
  { day: 'Monday', startTime: '09:00', endTime: '21:00' },
  { day: 'Tuesday', startTime: '09:00', endTime: '21:00' },
  { day: 'Wednesday', startTime: '09:00', endTime: '21:00' },
  { day: 'Thursday', startTime: '09:00', endTime: '21:00' },
  { day: 'Friday', startTime: '09:00', endTime: '21:00' },
  { day: 'Saturday', startTime: '09:00', endTime: '21:00' },
  { day: 'Sunday', startTime: '09:00', endTime: '21:00' }
];

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
      gender: 'male',
      address: 'Damascus, Syria',
      isActive: true,
      isVerified: true
    });

    const pharmacistUsers = [];
    const pharmacists = [];
    for (let i = 1; i <= 2; i++) {
      const user = await User.create({
        firstName: `Pharmacist${i}`,
        lastName: 'User',
        email: `pharmacist${i}@safemedical.com`,
        password: 'pharm123',
        role: 'pharmacist',
        phoneNumber: `+96398765432${i}`,
        gender: i % 2 === 0 ? 'female' : 'male',
        address: `${syrianCities[i]}, Syria`,
        isActive: true,
        isVerified: true
      });
      pharmacistUsers.push(user);
      const pharmacist = await Pharmacist.create({
        user: user._id,
        licenseNumber: `PHARM${1000 + i}`,
        pharmacyName: `Safe Pharmacy ${i}`,
        pharmacyAddress: `${syrianCities[i]}, Syria`,
        workingHours: workingHours,
        specialties: ['General Pharmacy', 'Clinical Pharmacy'],
        experienceYears: 5 + i,
        education: [{
          degree: 'PharmD',
          institution: 'University of Damascus',
          yearCompleted: 2018 + i
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      pharmacists.push(pharmacist);
    }

    const doctors = [];
    const doctorUsers = [];
    for (let i = 1; i <= 5; i++) {
      const { firstName, lastName, gender } = generateSyrianName();
      const user = await User.create({
        firstName,
        lastName,
        email: `doctor${i}@safe.com`,
        password: 'doctor123',
        role: 'doctor',
        phoneNumber: `+963${100000000 + i * 1000000}`,
        gender,
        address: `${syrianCities[i]}, Syria`,
        isActive: true,
        isVerified: true
      });
      doctorUsers.push(user);
      const doctor = await Doctor.create({
        user: user._id,
        medicalLicenseNumber: `MD${1000 + i}`,
        specialty: specialties[i % specialties.length],
        experienceYears: 10 + i,
        education: [{
          degree: 'MD',
          institution: 'University of Damascus',
          yearCompleted: 2010 + i
        }],
        currentHospitalAffiliation: {
          name: syrianHospitals[i % syrianHospitals.length],
          address: `${syrianCities[i]}, Syria`,
          phoneNumber: `+963${200000000 + i * 1000000}`
        },
        achievements: [`Award ${i}`],
        languages: ['Arabic', 'English'],
        rating: 4.5 + (i * 0.1),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      doctors.push(doctor);
    }

    const patients = [];
    const patientUsers = [];
    for (let i = 1; i <= 3; i++) {
      const { firstName, lastName, gender } = generateSyrianName();
      const user = await User.create({
        firstName,
        lastName,
        email: `patient${i}@safe.com`,
        password: 'patient123',
        role: 'patient',
        phoneNumber: `+963${300000000 + i * 1000000}`,
        gender,
        address: `${syrianCities[i]}, Syria`,
        isActive: true,
        isVerified: true
      });
      patientUsers.push(user);
      const bloodType = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][i % 8];
      const medicalFile = await MedicalFile.create({
        patientId: user._id,
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
            status: 'active',
            notes: 'Regular monitoring required'
          }
        ],
        vitalSigns: [
          {
            date: new Date(),
            bloodPressure: '120/80',
            heartRate: 75,
            temperature: 37,
            weight: 70 + i,
            height: 170 + i,
            bmi: 22.9 + i,
            oxygenSaturation: 98
          }
        ],
        emergencyContact: {
          name: `${commonSyrianNames.male[i % 10]} ${commonSyrianLastNames[i % commonSyrianLastNames.length]}`,
          relationship: 'Brother',
          phone: `+963${400000000 + i * 1000000}`,
          email: `emergency${i}@safe.com`
        },
        insuranceDetails: {
          provider: 'Syrian Insurance Company',
          policyNumber: `POL${1000 + i}`,
          groupNumber: `GRP${100 + i}`,
          expiryDate: new Date(2025, 11, 31)
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const patient = await Patient.create({
        user: user._id,
        medicalFile: medicalFile._id,
        bloodType,
        doctorsList: [doctors[i % doctors.length]._id],
        allergies: [
          {
            name: 'Penicillin',
            severity: 'moderate',
            notes: 'Rash and hives'
          }
        ],
        chronicConditions: [
          {
            name: 'Hypertension',
            diagnosisDate: randomDate(new Date(2015, 0, 1), new Date()),
            status: 'active',
            notes: 'Regular monitoring required'
          }
        ],
        medications: [
          {
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            startDate: new Date(),
            endDate: new Date(2025, 11, 31),
            prescribedBy: doctors[i % doctors.length]._id,
            status: 'active',
            notes: 'Take in the morning'
          }
        ],
        emergencyContacts: [
          {
            name: 'Ali Al-Kurdi',
            relationship: 'Father',
            phoneNumber: '+963500000000',
            email: 'ali.kurdi@safe.com',
            isPrimary: true
          }
        ],
        insurance: {
          provider: 'Syrian Insurance Company',
          policyNumber: `POL${1000 + i}`,
          groupNumber: `GRP${100 + i}`,
          expiryDate: new Date(2025, 11, 31)
        },
        preferredPharmacy: {
          name: 'Safe Pharmacy',
          address: 'Damascus, Syria',
          phoneNumber: '+963600000000'
        },
        appointments: [],
        consultations: [],
        prescriptions: [],
        messages: [],
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      patients.push({ user, patient, medicalFile });
    }

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i].patient;
      const doctor = doctors[i % doctors.length];
      const appointment = await Appointment.create({
        patient: patient._id,
        doctor: doctor._id,
        date: new Date(Date.now() + 86400000 * (i + 1)),
        time: '09:00',
        type: 'consultation',
        status: 'scheduled',
        reason: 'Routine checkup',
        notes: 'Bring previous reports'
      });
      patient.appointments.push(appointment._id);
      await patient.save();
      await Prescription.create({
        patientId: patient.user,
        doctorId: doctor.user,
        issueDate: new Date(),
        expiryDate: new Date(2025, 11, 31),
        medications: [
          {
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the morning'
          }
        ],
        diagnosis: 'Hypertension',
        status: 'active'
      });
      await Consultation.create({
        patient: patient._id,
        doctor: doctor.user,
        question: 'What is the best way to manage hypertension?',
        answer: 'Lifestyle changes and regular medication.',
        status: 'Answered'
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