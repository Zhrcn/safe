// Use CommonJS imports for compatibility with Next.js 14.x
const { NextResponse } = require('next/server');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('@/lib/db/mongodb');
const User = require('@/models/User');
const MedicalFile = require('@/models/MedicalFile');

// Define roles
const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  ADMIN: 'admin'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(Object.values(ROLES)),
    profile: z.object({
        phoneNumber: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        dateOfBirth: z.string().optional().nullable()
            .transform(val => val ? new Date(val) : undefined),
        gender: z.enum(['Male', 'Female', 'Other']).optional().nullable()
    }).optional().nullable(),
    doctorProfile: z.object({
        specialization: z.string().optional().nullable(),
        licenseNumber: z.string().optional().nullable(),
        yearsOfExperience: z.preprocess(
            val => val === '' ? undefined : val,
            z.string().optional().nullable()
                .transform(val => val ? parseInt(val, 10) : undefined)
        )
    }).optional().nullable(),
    patientProfile: z.object({
        emergencyContact: z.object({
            name: z.string().optional().nullable(),
            relationship: z.string().optional().nullable(),
            phoneNumber: z.string().optional().nullable()
        }).optional().nullable(),
        insurance: z.object({
            provider: z.string().optional().nullable(),
            policyNumber: z.string().optional().nullable(),
            expiryDate: z.string().optional().nullable()
                .transform(val => val ? new Date(val) : undefined)
        }).optional().nullable()
    }).optional().nullable(),
    pharmacistProfile: z.object({
        licenseNumber: z.string().optional().nullable(),
        pharmacy: z.object({
            name: z.string().optional().nullable(),
            address: z.string().optional().nullable(),
            phoneNumber: z.string().optional().nullable()
        }).optional().nullable()
    }).optional().nullable()
});

export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Registration data received:', JSON.stringify(body, null, 2));

        try {
            const validatedData = registerSchema.parse(body);
            console.log('Validated data:', JSON.stringify(validatedData, null, 2));

            // Connect to MongoDB
            await connectToDatabase();

            // Check if user already exists
            const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'User with this email already exists' },
                    { status: 400 }
                );
            }

            // Clean user data to remove null/undefined values
            const cleanUserData = (data) => {
                const cleanedData = { ...data };
                
                if (cleanedData.profile) {
                    Object.keys(cleanedData.profile).forEach(key => {
                        if (cleanedData.profile[key] === null || cleanedData.profile[key] === undefined) {
                            delete cleanedData.profile[key];
                        }
                    });

                    if (Object.keys(cleanedData.profile).length === 0) {
                        delete cleanedData.profile;
                    }
                }

                ['doctorProfile', 'patientProfile', 'pharmacistProfile'].forEach(profileKey => {
                    if (cleanedData[profileKey]) {
                        const cleanNestedObject = (obj) => {
                            for (const key in obj) {
                                if (obj[key] === null || obj[key] === undefined) {
                                    delete obj[key];
                                } else if (typeof obj[key] === 'object') {
                                    cleanNestedObject(obj[key]);
                                    if (Object.keys(obj[key]).length === 0) {
                                        delete obj[key];
                                    }
                                }
                            }
                        };

                        cleanNestedObject(cleanedData[profileKey]);

                        if (Object.keys(cleanedData[profileKey]).length === 0) {
                            delete cleanedData[profileKey];
                        }
                    }
                });

                return cleanedData;
            };

            const cleanedUserData = cleanUserData(validatedData);
            console.log('Cleaned user data for saving:', JSON.stringify(cleanedUserData, null, 2));

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(cleanedUserData.password, salt);

            // Create new user
            const newUser = new User({
                email: cleanedUserData.email.toLowerCase(),
                password: hashedPassword, 
                name: cleanedUserData.name,
                role: cleanedUserData.role,
                profile: cleanedUserData.profile || {},
                ...(cleanedUserData.doctorProfile && { doctorProfile: cleanedUserData.doctorProfile }),
                ...(cleanedUserData.patientProfile && { patientProfile: cleanedUserData.patientProfile }),
                ...(cleanedUserData.pharmacistProfile && { pharmacistProfile: cleanedUserData.pharmacistProfile }),
            });

            await newUser.save();

            // Create medical file for patients
            if (cleanedUserData.role === ROLES.PATIENT) {
                const medicalFile = new MedicalFile({
                    patientId: newUser._id,
                    accessLog: [{
                        userId: newUser._id,
                        userName: newUser.name,
                        userRole: newUser.role,
                        action: 'Created',
                        details: 'Initial medical file created during registration',
                    }],
                });

                await medicalFile.save();

                newUser.medicalFile = medicalFile._id;
                await newUser.save();
            }

            // Generate JWT token
            const payload = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

            // Return user data and token
            return NextResponse.json(
                {
                    token,
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                    },
                },
                { status: 201 }
            );
        } catch (validationError) {
            console.error('Validation error:', validationError);
            return NextResponse.json(
                { error: 'Invalid data', details: validationError.errors },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
} 