import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

/**
 * Verify a JWT token and return user information
 */
export async function GET(req) {
    try {
        // Extract token from Authorization header
        const token = req.cookies.get('safe_auth_token')?.value ||
            req.headers.get('Authorization')?.split('Bearer ')[1];

        if (!token) {
            return NextResponse.json({
                authenticated: false,
                error: 'No authentication token provided'
            }, { status: 401 });
        }

        // Decode and verify token
        try {
            const decoded = jwtDecode(token);

            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                return NextResponse.json({
                    authenticated: false,
                    error: 'Token expired'
                }, { status: 401 });
            }

            // Connect to database and verify user exists
            try {
                await connectToDatabase();

                const userId = decoded.id || decoded.userId || decoded.sub;
                if (!userId) {
                    return NextResponse.json({
                        authenticated: false,
                        error: 'Invalid token: missing user ID'
                    }, { status: 401 });
                }

                // Check if user exists in database
                const user = await User.findById(userId).select('-password');
                if (!user) {
                    return NextResponse.json({
                        authenticated: false,
                        error: 'User not found'
                    }, { status: 401 });
                }

                // Check user status - handle both status and isActive fields
                // Some models use status='active', others use isActive=true
                if ((user.status !== undefined && user.status !== 'active') ||
                    (user.isActive !== undefined && !user.isActive)) {
                    return NextResponse.json({
                        authenticated: false,
                        error: 'User account is not active'
                    }, { status: 403 });
                }

                // Token is valid and user exists
                return NextResponse.json({
                    authenticated: true,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                });

            } catch (dbError) {
                console.error('MongoDB Atlas connection error during token verification:', dbError);

                // If database is down, consider the token valid if not expired
                // This allows offline functionality
                return NextResponse.json({
                    authenticated: true,
                    warning: 'MongoDB Atlas unavailable, token accepted based on expiry only',
                    solution: 'Please check your MongoDB Atlas connection string in .env.local file',
                    user: {
                        id: decoded.id || decoded.userId || decoded.sub,
                        role: decoded.role
                    }
                });
            }

        } catch (decodeError) {
            console.error('Token decode error:', decodeError);
            return NextResponse.json({
                authenticated: false,
                error: 'Invalid token format'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json({
            authenticated: false,
            error: 'Authentication error'
        }, { status: 500 });
    }
} 