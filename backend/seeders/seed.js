const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

console.log('MONGO_URI:', process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('Deleting old data...'.red);
        await User.deleteMany({});
        await Patient.deleteMany({});
        await MedicalFile.deleteMany({});
        console.log('Old data deleted!'.green);

        console.log('Seeding new data...'.blue);

        const patientUserData = [
            {
                firstName: 'أحمد',
                lastName: 'علي',
                name: 'أحمد علي',
                email: 'ahmad.ali@safe.com',
                password: 'password123',
                phoneNumber: '0933123456',
                address: 'شارع الحمراء، دمشق',
                gender: 'male',
                role: 'patient',
                age: 35,
            },
            {
                firstName: 'فاطمة',
                lastName: 'محمد',
                name: 'فاطمة محمد',
                email: 'fatima.mohammad@safe.com',
                password: 'password123',
                phoneNumber: '0944987654',
                address: 'شارع الثورة، حلب',
                gender: 'female',
                role: 'patient',
                age: 28,
            },
            {
                firstName: 'يوسف',
                lastName: 'حسن',
                name: 'يوسف حسن',
                email: 'youssef.hassan@safe.com',
                password: 'password123',
                phoneNumber: '0955112233',
                address: 'حي الوعر، حمص',
                gender: 'male',
                role: 'patient',
                age: 50,
            },
            {
                firstName: 'مريم',
                lastName: 'خالد',
                name: 'مريم خالد',
                email: 'maryam.khaled@safe.com',
                password: 'password123',
                phoneNumber: '0966778899',
                address: 'المالكي، دمشق',
                gender: 'female',
                role: 'patient',
                age: 22,
            },
            {
                firstName: 'علي',
                lastName: 'رضا',
                name: 'علي رضا',
                email: 'ali.reda@safe.com',
                password: 'password123',
                phoneNumber: '0988456789',
                address: 'جبلة، اللاذقية',
                gender: 'male',
                role: 'patient',
                age: 40,
            },
            {
                firstName: 'ليلى',
                lastName: 'عباس',
                name: 'ليلى عباس',
                email: 'laila.abbas@safe.com',
                password: 'password123',
                phoneNumber: '0999113355',
                address: 'مساكن برزة، دمشق',
                gender: 'female',
                role: 'patient',
                age: 30,
            },
        ];

        // Hash passwords before inserting
        for (let i = 0; i < patientUserData.length; i++) {
            const salt = await bcrypt.genSalt(10);
            patientUserData[i].password = await bcrypt.hash(patientUserData[i].password, salt);
        }

        const createdUsers = await User.insertMany(patientUserData);

        for (const user of createdUsers) {
            if (user.role === 'patient') {
                const medicalFile = await MedicalFile.create({
                    patientId: user._id,
                    bloodType: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
                    allergies: [],
                    chronicConditions: [],
                    vitalSigns: [
                        {
                            date: new Date(),
                            bloodPressure: '120/80',
                            heartRate: 72,
                            temperature: 37,
                            weight: 70,
                        },
                    ],
                    emergencyContact: {
                        name: user.firstName === 'أحمد' ? 'محمد علي' : 'خديجة السيد',
                        relationship: user.firstName === 'أحمد' ? 'أخ' : 'أم',
                        phone: user.firstName === 'أحمد' ? '0933111222' : '0944333444',
                        email: user.firstName === 'أحمد' ? 'mohammad.ali@example.com' : 'khadija.sayed@example.com',
                    },
                    insuranceDetails: {
                        provider: 'شركة التأمين الوطنية',
                        policyNumber: 'INS' + Math.floor(100000 + Math.random() * 900000),
                        groupNumber: 'GRP' + Math.floor(10000 + Math.random() * 90000),
                        expiryDate: new Date(2025, 11, 31),
                    },
                });

                await Patient.create({
                    user: user._id,
                    medicalFile: medicalFile._id,
                });
            }
        }

        console.log('Data seeded successfully!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error.message}`.red.inverse);
        process.exit(1);
    }
};

seedData(); 