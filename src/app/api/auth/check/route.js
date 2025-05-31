import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';
import { corsHeaders, handleCorsOptions, addCorsHeaders } from '@/lib/cors';

// Use the same JWT secret as in the login route
const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return handleCorsOptions();
}

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
            const response = NextResponse.json({ authenticated: false, error: 'No token provided' }, { status: 401 });
            return addCorsHeaders(response);
        }
        
        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Check if user still exists in database
            await connectToDatabase();
            const user = await User.findById(decoded.id);
            
            if (!user) {
                const response = NextResponse.json({ authenticated: false, error: 'User not found' }, { status: 401 });
                return addCorsHeaders(response);
            }
            
            // Return user data and token for client-side storage
            const response = NextResponse.json({
                authenticated: true,
                token: token, // Return the token so client can store it
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
            
            return addCorsHeaders(response);
        } catch (error) {
            console.error('Token verification error:', error);
            const response = NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 401 });
            return addCorsHeaders(response);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        const response = NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
        return addCorsHeaders(response);
    }
} 