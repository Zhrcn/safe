const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local or .env at the project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') }); // Adjusted path for src/
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // Adjusted path for src/

// Import models
const User = require('./models/User'); // Adjusted path for src/
const Doctor = require('./models/Doctor'); // Adjusted path for src/
const Patient = require('./models/Patient'); // Adjusted path for src/
const MedicalFile = require('./models/MedicalFile'); // Adjusted path for src/
const Appointment = require('./models/Appointment'); // Adjusted path for src/

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in your environment variables.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await MedicalFile.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Existing data cleared.');

    // --- Create Patient User ---
    const patientUser = new User({
      email: 'patient1@safe.com',
      password: 'password123', // Password will be hashed by pre-save hook
      role: 'patient',
      firstName: 'SeedPatient',
      lastName: 'User',
      name: 'SeedPatient1 User',
      dateOfBirth: new Date('1990-05-15'),
      phoneNumber: '123-456-7890',
      gender: 'female',
      address: '123 Patient St, Health City'
    });
    await patientUser.save();
    console.log('Patient User created:', patientUser.email);

    // --- Create Doctor User ---
    const doctorUser = new User({
      email: 'doctor1@safe.com',
      password: 'password123',
      role: 'doctor',
      firstName: 'SeedDoctor',
      lastName: 'User',
      name: 'SeedDoctor1 User',
      dateOfBirth: new Date('1980-10-20'),
      phoneNumber: '987-654-3210',
      gender: 'male',
      address: '456 Doctor Ave, Wellness Town'
    });
    await doctorUser.save();
    console.log('Doctor User created:', doctorUser.email);

    // --- Create Patient Profile ---
    const patientProfile = new Patient({
      user: patientUser._id,
      bloodType: 'O+',
      height: 170, // cm
      weight: 70, // kg
      emergencyContact: {
        name: 'Jane Seed',
        relationship: 'Spouse',
        phoneNumber: '+11234567890'
      },
      allergies: [
        { allergen: 'Pollen', severity: 'mild', reaction: 'Sneezing' },
        { allergen: 'Dust Mites', severity: 'moderate', reaction: 'Itching, Runny Nose' }
      ],
      medicalHistory: [
        { condition: 'Childhood Asthma', diagnosedDate: new Date('1995-06-01'), notes: 'Resolved in teens' }
      ]
    });
    await patientProfile.save();
    console.log('Patient Profile created for:', patientUser.email);

    // --- Create Doctor Profile ---
    const doctorProfile = new Doctor({
      user: doctorUser._id,
      medicalLicenseNumber: 'DOCSEED12345',
      specialty: 'Cardiology',
      experienceYears: 15,
      education: [
        { degree: 'MD', institution: 'University of Medicine', yearCompleted: 2005 },
        { degree: 'Cardiology Fellowship', institution: 'Heart Institute', yearCompleted: 2009 }
      ],
      currentHospital: {
        name: 'General Hospital of Wellness Town',
        address: '789 Health Rd, Wellness Town',
        phoneNumber: '555-123-4567'
      }
    });
    await doctorProfile.save();
    console.log('Doctor Profile created for:', doctorUser.email);

    // --- Create Medical File for Patient ---
    const medicalFile = new MedicalFile({
      patientId: patientUser._id, // Reference to User model's ID for the patient
      bloodType: patientProfile.bloodType, // from patient profile
      allergies: patientProfile.allergies.map(a => ({ name: a.allergen, severity: a.severity, reaction: a.reaction })),
      conditions: [
        { name: 'Hypertension', diagnosisDate: new Date('2022-01-10'), status: 'managed', notes: 'Controlled with medication and diet.' },
        { name: 'Previous Minor Surgery (Appendix)', diagnosisDate: new Date('2010-03-15'), status: 'resolved', notes: 'Appendectomy, no complications.' }
      ],
      medications: [], 
      familyHistory: [
        { relative: 'Father', condition: 'Heart Disease', notes: 'Diagnosed at age 60'}
      ],
      lifestyle: {
        smokingStatus: 'never_smoked',
        alcoholConsumption: 'occasional',
        exerciseFrequency: '3-4 times a week'
      },
      vitalSigns: [
        {
          date: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 36.5, // Celsius
          weight: 70, // kg
          height: 170, // cm
          notes: 'Routine check-up'
        },
        {
          date: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
          bloodPressure: '122/81',
          heartRate: 75,
          temperature: 36.8, // Celsius
          weight: 70.5, // kg
          height: 170, // cm
          notes: 'Follow-up visit'
        },
        {
          date: new Date(), // Today
          bloodPressure: '118/78',
          heartRate: 70,
          temperature: 36.6, // Celsius
          weight: 70.2, // kg
          height: 170, // cm
          notes: 'Current vitals'
        }
      ]
    });
    await medicalFile.save();
    console.log('Medical File created for patient:', patientUser.email);

    // Link MedicalFile to PatientProfile
    patientProfile.medicalFile = medicalFile._id;
    await patientProfile.save();
    console.log('Linked Medical File to Patient Profile.');

    // --- Create Appointments ---
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const appointmentsData = [
      {
        patientId: patientUser._id,
        doctorId: doctorUser._id,
        reason: 'Routine check-up request',
        status: 'pending',
        preferredTimeSlot: 'morning',
        notes: 'Patient requests a general check-up.'
      },
      {
        patientId: patientUser._id,
        doctorId: doctorUser._id,
        reason: 'Follow-up consultation for Hypertension',
        status: 'scheduled', 
        date: sevenDaysFromNow,
        time: '10:00 AM',
        notes: 'Scheduled follow-up to discuss blood pressure readings.'
      },
      {
        patientId: patientUser._id,
        doctorId: doctorUser._id,
        reason: 'Annual physical examination',
        status: 'completed',
        date: sevenDaysAgo,
        time: '02:00 PM',
        notes: 'Patient completed annual physical. Overall health is good. Advised on continued diet and exercise.'
      }
    ];

    const createdAppointments = await Appointment.insertMany(appointmentsData);
    console.log(`${createdAppointments.length} appointments created.`);

    // Update Patient and Doctor profiles with appointment IDs
    const appointmentIds = createdAppointments.map(app => app._id);
    patientProfile.appointments.push(...appointmentIds);
    doctorProfile.appointments.push(...appointmentIds);
    
    if (!patientProfile.doctorsList.includes(doctorProfile._id)) {
        patientProfile.doctorsList.push(doctorProfile._id);
    }
    if (!doctorProfile.patientsList.includes(patientProfile._id)) {
        doctorProfile.patientsList.push(patientProfile._id);
    }

    await patientProfile.save();
    await doctorProfile.save();
    console.log('Updated patient and doctor profiles with appointment and cross-references.');


    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDatabase();
