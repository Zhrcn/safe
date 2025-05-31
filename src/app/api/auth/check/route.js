import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';

// Use the same JWT secret as in the login route
const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';

export async function GET(req) {
    try {
        // First check for token in cookie
        const tokenCookie = req.cookies.get('safe_auth_token')?.value;
        
        // Then check Authorization header as fallback
        const authHeader = req.headers.get('Authorization');
        const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        
        // Use cookie token if available, otherwise use header token
        const token = tokenCookie || headerToken;
        
        if (!token) {
            return NextResponse.json({ authenticated: false, error: 'No token provided' }, { status: 401 });
        }
        
        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Check if user still exists in database
            await connectToDatabase();
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return NextResponse.json({ authenticated: false, error: 'User not found' }, { status: 401 });
            }
            
            // Return user data and token for client-side storage
            return NextResponse.json({
                authenticated: true,
                token: token, // Return the token so client can store it
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Token verification error:', error);
            return NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 401 });
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
    }
} 