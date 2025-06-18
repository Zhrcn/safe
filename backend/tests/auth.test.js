const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const MedicalFile = require('../models/MedicalFile');
describe('Authentication System', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost27107');
    });
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
    beforeEach(async () => {
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        await Pharmacist.deleteMany({});
        await MedicalFile.deleteMany({});
    });
    describe('User Registration', () => {
        const validPatientData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'Test123!@#',
            role: 'patient',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            phoneNumber: '1234567890',
            address: '123 Main St'
        };
        const validDoctorData = {
            ...validPatientData,
            email: 'doctor@example.com',
            role: 'doctor',
            specialization: 'Cardiology',
            licenseNumber: 'DOC123',
            qualifications: ['MD', 'PhD'],
            yearsOfExperience: 10,
            professionalBio: 'Experienced cardiologist',
            workingHours: '9-5'
        };
        const validPharmacistData = {
            ...validPatientData,
            email: 'pharmacist@example.com',
            role: 'pharmacist',
            licenseNumber: 'PHARM123',
            pharmacyName: 'Health Pharmacy',
            qualifications: ['PharmD'],
            yearsOfExperience: 5,
            professionalBio: 'Licensed pharmacist',
            workingHours: '8-6'
        };
        test('should register a patient successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validPatientData);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user).toHaveProperty('_id');
            expect(res.body.data.user.role).toBe('patient');
            expect(res.body.data.token).toBeDefined();
        });
        test('should register a doctor successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validDoctorData);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.role).toBe('doctor');
        });
        test('should register a pharmacist successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validPharmacistData);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.role).toBe('pharmacist');
        });
        test('should reject registration with invalid password', async () => {
            const invalidData = {
                ...validPatientData,
                password: 'weak'
            };
            const res = await request(app)
                .post('/api/auth/register')
                .send(invalidData);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
        test('should reject registration with existing email', async () => {
            await request(app)
                .post('/api/auth/register')
                .send(validPatientData);
            const res = await request(app)
                .post('/api/auth/register')
                .send(validPatientData);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
    describe('User Login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'patient'
                });
        });
        test('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'patient'
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });
        test('should reject login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword',
                    role: 'patient'
                });
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
        test('should reject login with incorrect role', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'doctor'
                });
            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });
    describe('Password Reset', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'patient'
                });
        });
        test('should send password reset email', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'john@example.com'
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        test('should reset password with valid token', async () => {
            await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'john@example.com'
                });
            const user = await User.findOne({ email: 'john@example.com' });
            const resetToken = user.resetPasswordToken;
            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: resetToken,
                    password: 'NewTest123!@#'
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });
    });
    describe('Email Verification', () => {
        let verificationToken;
        beforeEach(async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'patient'
                });
            const user = await User.findOne({ email: 'john@example.com' });
            verificationToken = user.verificationToken;
        });
        test('should verify email with valid token', async () => {
            const res = await request(app)
                .post('/api/auth/verify-email')
                .send({
                    token: verificationToken
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            const user = await User.findOne({ email: 'john@example.com' });
            expect(user.isVerified).toBe(true);
        });
        test('should reject verification with invalid token', async () => {
            const res = await request(app)
                .post('/api/auth/verify-email')
                .send({
                    token: 'invalidtoken'
                });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
    describe('Profile Management', () => {
        let authToken;
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'patient'
                });
            const user = await User.findOne({ email: 'john@example.com' });
            await request(app)
                .post('/api/auth/verify-email')
                .send({
                    token: user.verificationToken
                });
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'Test123!@#',
                    role: 'patient'
                });
            authToken = loginRes.body.data.token;
        });
        test('should get user profile', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('john@example.com');
        });
        test('should update user profile', async () => {
            const res = await request(app)
                .put('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    firstName: 'Johnny',
                    lastName: 'Doe',
                    phoneNumber: '9876543210'
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.firstName).toBe('Johnny');
            expect(res.body.data.user.phoneNumber).toBe('9876543210');
        });
        test('should change password', async () => {
            const res = await request(app)
                .post('/api/auth/change-password')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    currentPassword: 'Test123!@#',
                    newPassword: 'NewTest123!@#'
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });
    });
}); 