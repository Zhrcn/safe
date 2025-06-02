// Fix for Next.js compatibility - use CommonJS for all imports
const { NextResponse } = require('next/server');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('@/lib/db/mongodb');
const User = require('@/models/User');
const { corsHeaders, handleCorsOptions, addCorsHeaders } = require('@/lib/cors');

// Use the same JWT secret as in the login route
const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return handleCorsOptions();
}

export async function GET(req) {
    console.log('Auth check API called');

    // Initialize diagnostic info to help troubleshoot auth issues
    const diagnostics = {
        token_sources: [],
        cookie_present: false,
        header_present: false,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
    };

    try {
        // First check for token in cookie
        const tokenCookie = req.cookies.get('safe_auth_token')?.value;
        if (tokenCookie) {
            diagnostics.token_sources.push('cookie');
            diagnostics.cookie_present = true;
            console.log('Token found in cookie');
        }

        // Then check Authorization header as fallback
        const authHeader = req.headers.get('Authorization');
        diagnostics.header_present = !!authHeader;

        const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (headerToken) {
            diagnostics.token_sources.push('header');
            console.log('Token found in Authorization header');
        }

        // Use cookie token if available, otherwise use header token
        const token = tokenCookie || headerToken;
        diagnostics.token_found = !!token;

        if (!token) {
            console.warn('No authentication token found in request');
            const response = NextResponse.json({
                authenticated: false,
                error: 'No token provided',
                diagnostics: diagnostics
            }, { status: 401 });
            return addCorsHeaders(response);
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);
            diagnostics.token_valid = true;
            diagnostics.token_expires = new Date(decoded.exp * 1000).toISOString();
            diagnostics.user_id = decoded.id || decoded.userId;
            diagnostics.role = decoded.role;

            console.log(`Token verified for user ID: ${diagnostics.user_id}, role: ${diagnostics.role}`);

            // Set a timeout for database operations to prevent hanging
            const dbTimeout = 5000; // 5 seconds

            try {
                // Check if user still exists in database with timeout protection
                await connectToDatabase();

                // Create a promise that rejects after the timeout
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Database query timeout')), dbTimeout);
                });

                // Race the user query against the timeout
                const user = await Promise.race([
                    User.findById(diagnostics.user_id),
                    timeoutPromise
                ]);

                if (!user) {
                    console.warn(`User not found in database: ${diagnostics.user_id}`);
                    const response = NextResponse.json({
                        authenticated: false,
                        error: 'User not found',
                        diagnostics: diagnostics
                    }, { status: 401 });
                    return addCorsHeaders(response);
                }

                // Check user status - handle both status and isActive fields
                if ((user.status !== undefined && user.status !== 'active') ||
                    (user.isActive !== undefined && !user.isActive)) {
                    console.warn(`User account is not active: ${diagnostics.user_id}`);
                    const response = NextResponse.json({
                        authenticated: false,
                        error: 'User account is not active',
                        diagnostics: diagnostics
                    }, { status: 403 });
                    return addCorsHeaders(response);
                }

                diagnostics.user_found = true;
                diagnostics.db_connected = true;

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
                console.error('Database query error:', error);
                diagnostics.error = error.message;
                const response = NextResponse.json({
                    authenticated: false,
                    error: 'Database query error',
                    diagnostics: diagnostics
                }, { status: 500 });
                return addCorsHeaders(response);
            }
        } catch (error) {
            console.error('Token verification error:', error);
            diagnostics.token_error = error.message;
            diagnostics.error_type = error.name;

            const response = NextResponse.json({
                authenticated: false,
                error: 'Invalid token',
                diagnostics: diagnostics
            }, { status: 401 });
            return addCorsHeaders(response);
        }
    } catch (error) {
        console.error('Auth check error:', error);

        // Add error details to diagnostics
        diagnostics.error = error.message;
        diagnostics.error_type = error.name;
        diagnostics.error_stack = process.env.NODE_ENV !== 'production' ? error.stack : undefined;

        const response = NextResponse.json({
            authenticated: false,
            error: 'Server error during authentication check',
            diagnostics: diagnostics
        }, {
            status: 500,
            headers: {
                'X-Error-Type': error.name || 'Unknown',
                'X-Error-Message': error.message || 'Unknown error',
            }
        });

        return addCorsHeaders(response);
    }
} 