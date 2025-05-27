import { NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import MedicalFile from '@/lib/models/MedicalFile';
import { ROLES } from '@/lib/config';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// DEVELOPMENT MODE: Set to true to bypass MongoDB connection for testing
const DEV_MODE = true;

// Registration schema with validation
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
    // Role-specific fields are optional depending on role
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
        // Parse and validate the request body
        const body = await req.json();
        console.log('Registration data received:', JSON.stringify(body, null, 2));

        try {
            const validatedData = registerSchema.parse(body);
            console.log('Validated data:', JSON.stringify(validatedData, null, 2));

            // Connect to MongoDB (bypass in dev mode)
            if (!DEV_MODE) {
                // Try to connect to MongoDB
                try {
                    await connectDB();
                } catch (dbError) {
                    console.error('MongoDB connection error:', dbError);

                    // In development mode, continue without database
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Continuing in development mode without database connection');
                    } else {
                        throw dbError; // Re-throw in production
                    }
                }

                // Check if user with this email already exists
                const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
                if (existingUser) {
                    return NextResponse.json(
                        { error: 'User with this email already exists' },
                        { status: 400 }
                    );
                }
            }

            // Clean up validated data by removing null/undefined nested objects
            const cleanUserData = (data) => {
                const cleanedData = { ...data };

                // Clean up profile fields
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

                // Clean up role-specific profiles
                ['doctorProfile', 'patientProfile', 'pharmacistProfile'].forEach(profileKey => {
                    if (cleanedData[profileKey]) {
                        // Recursively clean nested objects
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

            // In DEV_MODE, create a mock user response
            if (DEV_MODE) {
                // Create a mock user object with the data we received
                const mockUser = {
                    _id: 'dev_' + Date.now(),
                    name: cleanedUserData.name,
                    email: cleanedUserData.email,
                    role: cleanedUserData.role,
                    profile: cleanedUserData.profile || {},
                    ...(cleanedUserData.doctorProfile && { doctorProfile: cleanedUserData.doctorProfile }),
                    ...(cleanedUserData.patientProfile && { patientProfile: cleanedUserData.patientProfile }),
                    ...(cleanedUserData.pharmacistProfile && { pharmacistProfile: cleanedUserData.pharmacistProfile }),
                };

                // Create JWT payload
                const payload = {
                    id: mockUser._id,
                    name: mockUser.name,
                    email: mockUser.email,
                    role: mockUser.role,
                };

                // Generate JWT token
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

                console.log('DEV MODE: Created mock user and token');

                // Return response with token and user data
                return NextResponse.json(
                    {
                        token,
                        user: mockUser,
                    },
                    { status: 201 }
                );
            }

            // Create new user with validated data (This runs if DEV_MODE is false)
            const newUser = new User({
                email: cleanedUserData.email.toLowerCase(),
                password: cleanedUserData.password, // Will be hashed by pre-save hook
                name: cleanedUserData.name,
                role: cleanedUserData.role,
                profile: cleanedUserData.profile || {},
                // Add role-specific fields if provided
                ...(cleanedUserData.doctorProfile && { doctorProfile: cleanedUserData.doctorProfile }),
                ...(cleanedUserData.patientProfile && { patientProfile: cleanedUserData.patientProfile }),
                ...(cleanedUserData.pharmacistProfile && { pharmacistProfile: cleanedUserData.pharmacistProfile }),
            });

            // Save user to database
            await newUser.save();

            // If user is a patient, create a medical file
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

                // Update user with medical file reference
                newUser.medicalFile = medicalFile._id;
                await newUser.save();
            }

            // Create JWT payload
            const payload = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            };

            // Generate JWT token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

            // Get user data to return (exclude sensitive info)
            const sanitizedUserData = newUser.toJSON();

            // Return response with token and user data
            return NextResponse.json(
                {
                    token,
                    user: sanitizedUserData,
                },
                { status: 201 }
            );
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                console.error('Validation error:', JSON.stringify(validationError.errors, null, 2));

                // Format validation errors to be more user-friendly
                const formattedErrors = validationError.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }));

                return NextResponse.json(
                    {
                        error: 'Invalid registration data',
                        details: formattedErrors
                    },
                    { status: 400 }
                );
            }

            throw validationError; // Re-throw if it's not a Zod error
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
} 