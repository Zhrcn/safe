import { NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectToDatabase, withTimeout } from '@/lib/db/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';
import Pharmacist from '@/models/Pharmacist';

const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'), 
    role: z.enum(['doctor', 'patient', 'pharmacist', 'admin'], { 
        errorMap: () => ({ message: 'Invalid role specified' })
    }),
});

async function getRoleSpecificDetails(userId, role) {
    try {
        switch (role) {
            case 'doctor':
                return await Doctor.findOne({ user: userId }).lean();
            case 'patient':
                return await Patient.findOne({ user: userId }).lean();
            case 'pharmacist':
                return await Pharmacist.findOne({ user: userId }).lean();
            default:
                return null;
        }
    } catch (error) {
        console.error(`Error fetching ${role} details:`, error);
        return null;
    }
}

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const validatedData = loginSchema.parse(requestBody);

        console.log("Attempting live database connection for login...");
        const dbConnection = await connectToDatabase();
        
        // Explicitly check if the connection object itself indicates an issue,
        // but don't rely on dbConnection.isMock to trigger mock login path.
        if (!dbConnection || dbConnection.error) {
            console.error("Failed to establish live database connection:", dbConnection ? dbConnection.error : "No connection object");
            return NextResponse.json({ message: 'Database connection error.' }, { status: 503 }); // Service Unavailable
        }

        const emailLowercase = validatedData.email.toLowerCase();

        const user = await withTimeout(
            User.findOne({ email: emailLowercase }).select('+password').lean(),
            5000, // 5 seconds timeout
            'Database query timed out while finding user.'
        );

        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        if (user.role !== validatedData.role) {
            return NextResponse.json({ message: `You are trying to log in as ${validatedData.role}, but your account is registered as ${user.role}.` }, { status: 403 });
        }

        const roleSpecificDetails = await getRoleSpecificDetails(user._id, user.role);

        // Update lastLogin asynchronously (fire and forget)
        User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })
            .catch(err => console.error('Failed to update lastLogin:', err));

        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 3600 // Default 1 hour, adjust based on JWT_EXPIRES_IN if needed
        };

        // Attempt to parse JWT_EXPIRES_IN (e.g., '1h', '7d') to seconds for maxAge
        try {
            if (JWT_EXPIRES_IN.endsWith('h')) {
                cookieOptions.maxAge = parseInt(JWT_EXPIRES_IN.replace('h', '')) * 60 * 60;
            } else if (JWT_EXPIRES_IN.endsWith('d')) {
                cookieOptions.maxAge = parseInt(JWT_EXPIRES_IN.replace('d', '')) * 24 * 60 * 60;
            }
        } catch (e) {
            console.warn('Could not parse JWT_EXPIRES_IN for cookie maxAge, defaulting to 1 hour.');
        }

        cookies().set('safe_auth_token', token, cookieOptions);

        const { password, ...userWithoutPassword } = user; // Exclude password from response

        return NextResponse.json({
            message: 'Login successful',
            token: token, // Send token in response body
            user: {
                id: userWithoutPassword._id.toString(),
                email: userWithoutPassword.email,
                role: userWithoutPassword.role,
                name: userWithoutPassword.name || `${userWithoutPassword.firstName || ''} ${userWithoutPassword.lastName || ''}`.trim(),
                firstName: userWithoutPassword.firstName,
                lastName: userWithoutPassword.lastName,
                profileImage: userWithoutPassword.profileImage,
                // Add any other non-sensitive user fields you want to return
                ...(roleSpecificDetails && { roleDetails: roleSpecificDetails })
            },
            source: 'database'
        }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
        }
        console.error('Login API error:', error);
        // More specific error messages based on error type
        if (error.message.includes('timed out')) {
            return NextResponse.json({ message: 'Login operation timed out. Please try again.' }, { status: 504 }); // Gateway Timeout
        }
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}
