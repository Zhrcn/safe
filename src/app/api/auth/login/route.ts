import { NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['doctor', 'patient', 'pharmacist', 'admin']),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = loginSchema.parse(body);

        // TODO: Replace with actual database authentication
        // This is just a mock implementation
        const mockUsers = {
            'doctor@example.com': {
                id: '1',
                name: 'Dr. Smith',
                role: 'doctor',
                password: 'password123',
            },
            'patient@example.com': {
                id: '2',
                name: 'John Doe',
                role: 'patient',
                password: 'password123',
            },
            'pharmacist@example.com': {
                id: '3',
                name: 'Jane Pharmacist',
                role: 'pharmacist',
                password: 'password123',
            },
            'admin@example.com': {
                id: '4',
                name: 'Admin User',
                role: 'admin',
                password: 'password123',
            },
        };

        const user = mockUsers[validatedData.email];

        if (!user || user.password !== validatedData.password || user.role !== validatedData.role) {
            return NextResponse.json(
                { error: 'Invalid credentials or role' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: validatedData.email,
                role: user.role,
                name: user.name,
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return NextResponse.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 