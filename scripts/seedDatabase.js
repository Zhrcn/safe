const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Function to connect to the database directly
async function connectToDatabaseDirect() {
    try {
        const MONGODB_URI = 'mongodb://localhost:27017/safe';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB directly');
    } catch (error) {
        console.error('Failed to connect to MongoDB directly:', error);
        throw error;
    }
}

// Import models
const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const MedicalFile = require('../src/models/MedicalFile');
const Appointment = require('../src/models/Appointment');
const Prescription = require('../src/models/Prescription');
const Medicine = require('../src/models/Medicine');
const Consultation = require('../src/models/Consultation');

// Try to import Pharmacist model if it exists
let Pharmacist;
try {
    Pharmacist = require('../src/models/Pharmacist');
} catch (error) {
    console.log('Pharmacist model not found, continuing without it');
}

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safe';
const SALT_ROUNDS = 10;

// Sample data
const users = [
    // Patients
    {
        email: 'patient1@safe.com',
        password: 'patient123',
        name: 'Ali Omar',
        firstName: 'Ali',
        lastName: 'Omar',
        role: 'patient',
        phoneNumber: '+971501234567',
        address: 'Dubai Marina, Tower A, Apt 123',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        isActive: true
    },
    {
        email: 'patient2@safe.com',
        password: 'patient123',
        name: 'Fatima Ahmed',
        firstName: 'Fatima',
        lastName: 'Ahmed',
        role: 'patient',
        phoneNumber: '+971502345678',
        address: 'Abu Dhabi, Corniche Road, Villa 45',
        dateOfBirth: new Date('1985-08-20'),
        gender: 'female',
        profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        isActive: true
    },
    
    // Doctors
    {
        email: 'doctor1@safe.com',
        password: 'doctor123',
        name: 'Dr. Mohammed Al Mansoori',
        firstName: 'Mohammed',
        lastName: 'Al Mansoori',
        role: 'doctor',
        phoneNumber: '+971503456789',
        address: 'Dubai Healthcare City, Building C',
        dateOfBirth: new Date('1975-03-10'),
        gender: 'male',
        profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
        isActive: true
    },
    {
        email: 'doctor2@safe.com',
        password: 'doctor123',
        name: 'Dr. Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'doctor',
        phoneNumber: '+971504567890',
        address: 'Abu Dhabi, Al Reem Island, Medical Tower',
        dateOfBirth: new Date('1980-11-25'),
        gender: 'female',
        profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
        isActive: true
    },
    
    // Admin
    {
        email: 'admin@safe.com',
        password: 'admin123',
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        phoneNumber: '+971505678901',
        address: 'Dubai, Business Bay, Office Tower',
        dateOfBirth: new Date('1982-01-01'),
        gender: 'male',
        profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
        isActive: true
    },
    
    // Pharmacist
    {
        email: 'pharmacist@safe.com',
        password: 'pharmacist123',
        name: 'Layla Mahmoud',
        firstName: 'Layla',
        lastName: 'Mahmoud',
        role: 'pharmacist',
        phoneNumber: '+971506789012',
        address: 'Sharjah, Al Khan, Pharmacy Building',
        dateOfBirth: new Date('1988-07-15'),
        gender: 'female',
        profileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
        isActive: true
    }
];

const doctorProfiles = [
    {
        userEmail: 'doctor1@safe.com',
        specialty: 'Cardiology',
        medicalLicenseNumber: 'DHA-12345',
        experienceYears: 15,
        hospital: 'Dubai Hospital',
        consultationFee: 500,
        education: [
            { degree: 'MBBS', institution: 'University of Sharjah', year: 2005 },
            { degree: 'MD Cardiology', institution: 'Harvard Medical School', year: 2010 }
        ],
        availability: {
            monday: [{ start: '09:00', end: '17:00' }],
            tuesday: [{ start: '09:00', end: '17:00' }],
            wednesday: [{ start: '09:00', end: '17:00' }],
            thursday: [{ start: '09:00', end: '17:00' }],
            friday: [{ start: '09:00', end: '13:00' }],
            saturday: [],
            sunday: []
        }
    },
    {
        userEmail: 'doctor2@safe.com',
        specialty: 'Pediatrics',
        medicalLicenseNumber: 'HAAD-67890',
        experienceYears: 10,
        hospital: 'Sheikh Khalifa Medical City',
        consultationFee: 400,
        education: [
            { degree: 'MBBS', institution: 'UAE University', year: 2010 },
            { degree: 'MD Pediatrics', institution: 'Johns Hopkins University', year: 2015 }
        ],
        availability: {
            monday: [{ start: '10:00', end: '18:00' }],
            tuesday: [{ start: '10:00', end: '18:00' }],
            wednesday: [{ start: '10:00', end: '18:00' }],
            thursday: [{ start: '10:00', end: '18:00' }],
            friday: [],
            saturday: [{ start: '10:00', end: '14:00' }],
            sunday: []
        }
    }
];

const patientProfiles = [
    {
        userEmail: 'patient1@safe.com',
        bloodType: 'O+',
        height: 175,
        weight: 70,
        emergencyContact: {
            name: 'Khalid Omar',
            relationship: 'Brother',
            phoneNumber: '+971507890123'
        },
        allergies: [
            { name: 'Penicillin', severity: 'severe', reaction: 'Rash and difficulty breathing' },
            { name: 'Peanuts', severity: 'moderate', reaction: 'Swelling and hives' }
        ],
        chronicConditions: ['Hypertension'],
        pastSurgeries: [{ procedure: 'Appendectomy', date: new Date('2015-03-20'), hospital: 'Dubai Hospital' }]
    },
    {
        userEmail: 'patient2@safe.com',
        bloodType: 'A-',
        height: 165,
        weight: 58,
        emergencyContact: {
            name: 'Hassan Ahmed',
            relationship: 'Husband',
            phoneNumber: '+971508901234'
        },
        allergies: [
            { name: 'Sulfa drugs', severity: 'severe', reaction: 'Skin rash and fever' },
            { name: 'Aspirin', severity: 'mild', reaction: 'Headache' } 
        ],
        chronicConditions: ['Asthma', 'Diabetes Type 2'],
        pastSurgeries: [{ procedure: 'Cesarean section', date: new Date('2018-06-10'), hospital: 'Burjeel Hospital' }]
    }
];

const pharmacistProfiles = [
    {
        userEmail: 'pharmacist@safe.com',
        licenseNumber: 'MOH-PH-12345',
        pharmacy: 'SAFE Pharmacy',
        experience: 10,
        specialization: 'Clinical Pharmacy',
        address: {
            street: 'Jumeirah Beach Road',
            city: 'Dubai',
            state: 'Dubai',
            zipCode: '12345',
            country: 'UAE'
        },
        workingHours: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
            saturday: { start: '10:00', end: '14:00' },
            sunday: { start: '', end: '' }
        },
        contactNumber: '+97143456789',
        education: [
            { degree: 'Bachelor of Pharmacy', institution: 'Ajman University', year: 2010 },
            { degree: 'PharmD', institution: 'University of Dubai', year: 2012 }
        ]
    }
];

const medicines = [
    {
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        brandName: 'Tylenol',
        category: 'Analgesic',
        description: 'Pain reliever and fever reducer',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'GSK',
        price: 15,
        requiresPrescription: false,
        sideEffects: ['Nausea', 'Liver damage (with overdose)'],
        contraindications: ['Liver disease', 'Alcohol consumption']
    },
    {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        brandName: 'Amoxil',
        category: 'Antibiotic',
        description: 'Antibiotic used to treat bacterial infections',
        dosageForm: 'Capsule',
        strength: '500mg',
        manufacturer: 'GSK',
        price: 45,
        requiresPrescription: true,
        sideEffects: ['Diarrhea', 'Rash', 'Nausea'],
        contraindications: ['Penicillin allergy', 'Mononucleosis']
    },
    {
        name: 'Salbutamol',
        genericName: 'Albuterol',
        brandName: 'Ventolin',
        category: 'Bronchodilator',
        description: 'Bronchodilator that relaxes muscles in the airways',
        dosageForm: 'Inhaler',
        strength: '100mcg/dose',
        manufacturer: 'GSK',
        price: 65,
        requiresPrescription: true,
        sideEffects: ['Tremor', 'Headache', 'Rapid heartbeat'],
        contraindications: ['Hypersensitivity to salbutamol']
    },
    {
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        brandName: 'Glucophage',
        category: 'Antidiabetic',
        description: 'Oral diabetes medicine that helps control blood sugar levels',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'Merck',
        price: 35,
        requiresPrescription: true,
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach pain'],
        contraindications: ['Kidney disease', 'Metabolic acidosis']
    },
    {
        name: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        brandName: 'Lipitor',
        category: 'Statin',
        description: 'Statin medication used to lower blood cholesterol',
        dosageForm: 'Tablet',
        strength: '20mg',
        manufacturer: 'Pfizer',
        price: 120,
        requiresPrescription: true,
        sideEffects: ['Muscle pain', 'Liver problems', 'Digestive problems'],
        contraindications: ['Liver disease', 'Pregnancy']
    }
];

// Function to seed the database
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        await connectToDatabaseDirect();
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Doctor.deleteMany({}),
            Patient.deleteMany({}),
            MedicalFile.deleteMany({}),
            Appointment.deleteMany({}),
            Prescription.deleteMany({}),
            Medicine.deleteMany({}),
            Consultation.deleteMany({}),
            Pharmacist ? Pharmacist.deleteMany({}) : Promise.resolve()
        ]);
        console.log('Existing data cleared');

        // Create medicines
        console.log('Creating medicines...');
        const createdMedicines = await Medicine.insertMany(medicines);
        console.log(`Created ${createdMedicines.length} medicines`);

        // Create users
        console.log('Creating users...');
        const createdUsers = [];
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            createdUsers.push(user);
            console.log(`Created user: ${user.email}`);
        }

        // Create doctor profiles
        console.log('Creating doctor profiles...');
        const createdDoctors = [];
        for (const doctorData of doctorProfiles) {
            const user = createdUsers.find(u => u.email === doctorData.userEmail);
            if (user) {
                const doctor = new Doctor({
                    user: user._id,
                    medicalLicenseNumber: doctorData.medicalLicenseNumber,
                    specialty: doctorData.specialty,
                    experienceYears: doctorData.experienceYears,
                    hospital: doctorData.hospital,
                    consultationFee: doctorData.consultationFee,
                    education: doctorData.education,
                    availability: doctorData.availability
                });
                await doctor.save();
                createdDoctors.push(doctor);
                console.log(`Created doctor profile for: ${user.email}`);
            }
        }

        // Create patient profiles and medical files
        console.log('Creating patient profiles and medical files...');
        const createdPatients = [];
        for (const patientData of patientProfiles) {
            const user = createdUsers.find(u => u.email === patientData.userEmail);
            if (user) {
                // Create medical file first
                const medicalFile = new MedicalFile({
                    patientId: user._id,
                    status: 'active',
                    bloodType: patientData.bloodType,
                    height: patientData.height,
                    weight: patientData.weight,
                    allergies: patientData.allergies,
                    chronicConditions: patientData.chronicConditions,
                    pastSurgeries: patientData.pastSurgeries,
                    accessLog: [{
                        userId: user._id,
                        userName: user.name,
                        userRole: user.role,
                        action: 'Created',
                        details: 'Initial medical file created during seeding',
                        timestamp: new Date()
                    }]
                });
                await medicalFile.save();
                
                // Create patient profile
                const patient = new Patient({
                    user: user._id,
                    medicalFile: medicalFile._id,
                    bloodType: patientData.bloodType,
                    height: patientData.height,
                    weight: patientData.weight,
                    emergencyContact: patientData.emergencyContact
                });
                await patient.save();
                createdPatients.push(patient);
                console.log(`Created patient profile and medical file for: ${user.email}`);
            }
        }

        // Create pharmacist profiles if model exists
        if (Pharmacist) {
            console.log('Creating pharmacist profiles...');
            for (const pharmacistData of pharmacistProfiles) {
                const user = createdUsers.find(u => u.email === pharmacistData.userEmail);
                if (user) {
                    const pharmacist = new Pharmacist({
                        user: user._id,
                        licenseNumber: pharmacistData.licenseNumber,
                        pharmacy: pharmacistData.pharmacy,
                        education: pharmacistData.education
                    });
                    await pharmacist.save();
                    console.log(`Created pharmacist profile for: ${user.email}`);
                }
            }
        }

        // Create doctor-patient relationships
        console.log('Creating doctor-patient relationships...');
        // Assign all patients to first doctor
        const firstDoctor = createdDoctors[0];
        if (firstDoctor) {
            firstDoctor.patientsList = createdPatients.map(patient => patient._id);
            await firstDoctor.save();
            
            // Update patients to have this doctor
            for (const patient of createdPatients) {
                patient.doctorsList = [firstDoctor._id];
                await patient.save();
            }
            console.log(`Assigned ${createdPatients.length} patients to doctor: ${doctorProfiles[0].userEmail}`);
        }

        // Create appointments
        console.log('Creating appointments...');
        const appointments = [];
        
        // Create past and upcoming appointments for each patient with their doctor
        for (const patient of createdPatients) {
            const doctor = createdDoctors[0]; // Using the first doctor for all appointments
            const patientUser = createdUsers.find(u => u._id.toString() === patient.user.toString());
            const doctorUser = createdUsers.find(u => u._id.toString() === doctor.user.toString());
            
            if (patientUser && doctorUser) {
                // Past appointment (completed)
                const pastDate = new Date();
                pastDate.setDate(pastDate.getDate() - 7); // 7 days ago
                
                const pastAppointment = new Appointment({
                    patientId: patient._id,
                    patientName: `${patientUser.firstName} ${patientUser.lastName}`,
                    doctorId: doctor._id,
                    doctorName: `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`,
                    date: pastDate,
                    time: '10:00',
                    duration: 30,
                    status: 'completed',
                    reason: 'Regular checkup',
                    notes: 'Patient reported feeling better. Prescribed medication for maintenance.',
                    createdAt: new Date(pastDate.getTime() - 1000*60*60*24*3) // 3 days before appointment
                });
                await pastAppointment.save();
                appointments.push(pastAppointment);
                
                // Create a consultation record for the past appointment
                const consultation = new Consultation({
                    patientId: patient._id,
                    doctorId: doctor._id,
                    reason: 'Headache and mild fever',
                    status: 'completed',
                    messages: [{
                        sender: doctor._id,
                        content: 'Diagnosis: Viral infection. Treatment: Rest, hydration, and medication. Follow up in 2 weeks if symptoms persist.'
                    }],
                    createdAt: pastDate,
                    updatedAt: pastDate
                });
                await consultation.save();
                
                // Create a prescription for the past appointment
                // Calculate expiry date (30 days from issue date)
                const expiryDate = new Date(pastDate);
                expiryDate.setDate(expiryDate.getDate() + 30);
                
                const prescription = new Prescription({
                    patientId: patient._id,
                    doctorId: doctor._id,
                    date: pastDate,
                    expiryDate: expiryDate,
                    diagnosis: 'Viral infection',
                    medications: [
                        {
                            name: createdMedicines[0].name,
                            dosage: '1 tablet',
                            frequency: 'Every 6 hours as needed',
                            duration: '5 days',
                            instructions: 'Take with food'
                        }
                    ],
                    notes: 'Take medication as prescribed. Drink plenty of fluids.',
                    status: 'filled'
                });
                await prescription.save();
                
                // Upcoming appointment (scheduled)
                const upcomingDate = new Date();
                upcomingDate.setDate(upcomingDate.getDate() + 3); // 3 days from now
                
                const upcomingAppointment = new Appointment({
                    patientId: patient._id,
                    patientName: `${patientUser.firstName} ${patientUser.lastName}`,
                    doctorId: doctor._id,
                    doctorName: `Dr. ${doctorUser.firstName} ${doctorUser.lastName}`,
                    date: upcomingDate,
                    time: '14:30',
                    duration: 30,
                    status: 'scheduled',
                    reason: 'Follow-up appointment',
                    notes: '',
                    createdAt: new Date() // Created today
                });
                await upcomingAppointment.save();
                appointments.push(upcomingAppointment);
                
                console.log(`Created appointments for patient: ${patientUser.email}`);
            }
        }

        console.log('Database seeding completed successfully!');
        console.log(`Created ${createdUsers.length} users`);
        console.log(`Created ${createdDoctors.length} doctor profiles`);
        console.log(`Created ${createdPatients.length} patient profiles`);
        console.log(`Created ${appointments.length} appointments`);
        console.log('You can now log in with the following credentials:');
        console.log('- Patient: patient1@safe.com / patient123');
        console.log('- Doctor: doctor1@safe.com / doctor123');
        console.log('- Admin: admin@safe.com / admin123');
        console.log('- Pharmacist: pharmacist@safe.com / pharmacist123');
        
        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        
        return { success: true };
    } catch (error) {
        console.error('Error seeding database:', error);
        // Close the connection in case of error
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed after error');
        } catch (closeError) {
            console.error('Error closing MongoDB connection:', closeError);
        }
        return { success: false, error };
    }
}

// Run the seed function
seedDatabase()
    .then(result => {
        if (result.success) {
            console.log('Seeding completed successfully');
            process.exit(0);
        } else {
            console.error('Seeding failed');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('Unhandled error during seeding:', error);
        process.exit(1);
    });
