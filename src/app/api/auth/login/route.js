import { NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['doctor', 'patient', 'pharmacist', 'admin']),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
// DEVELOPMENT MODE: Set to true to bypass MongoDB connection for testing
const DEV_MODE = true;

export async function POST(req) {
    try {
        const body = await req.json();
        const validatedData = loginSchema.parse(body);

        console.log('Login attempt:', JSON.stringify({
            email: validatedData.email,
            role: validatedData.role
        }, null, 2));

        // DEV MODE - Skip database connection and return mock data
        if (DEV_MODE) {
            console.log('DEV MODE: Bypassing database authentication');

            // Mock users for development testing
            const mockUsers = {
                'patient@example.com': {
                    _id: 'dev_patient_123',
                    name: 'Test Patient',
                    email: 'patient@example.com',
                    role: 'patient',
                    password: 'patient'
                },
                'doctor@example.com': {
                    _id: 'dev_doctor_123',
                    name: 'Test Doctor',
                    email: 'doctor@example.com',
                    role: 'doctor',
                    password: 'doctor'
                },
                'pharmacist@example.com': {
                    _id: 'dev_pharmacist_123',
                    name: 'Test Pharmacist',
                    email: 'pharmacist@example.com',
                    role: 'pharmacist',
                    password: 'pharmacist'
                }
            };

            // Check if user exists in mock data
            const mockUser = mockUsers[validatedData.email.toLowerCase()];

            if (!mockUser || mockUser.role !== validatedData.role) {
                return NextResponse.json(
                    { error: 'Invalid credentials or role' },
                    { status: 401 }
                );
            }

            // Simple password check
            if (mockUser.password !== validatedData.password) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    id: mockUser._id,
                    email: mockUser.email,
                    role: mockUser.role,
                    name: mockUser.name,
                },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            console.log('DEV MODE: Login successful for', mockUser.email);

            return NextResponse.json({
                token,
                user: {
                    id: mockUser._id,
                    name: mockUser.name,
                    email: mockUser.email,
                    role: mockUser.role
                }
            });
        }

        // Connect to MongoDB for production mode
        await connectDB();

        // Find user by email and role
        const user = await User.findOne({
            email: validatedData.email.toLowerCase(),
            role: validatedData.role
        });

        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials or role' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(validatedData.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return NextResponse.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
} 