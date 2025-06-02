// Fix for Next.js compatibility - use CommonJS for all imports
const { NextResponse } = require('next/server');
const jwt = require('jsonwebtoken');
const { corsHeaders, handleCorsOptions, addCorsHeaders } = require('@/lib/cors');

// Use the same JWT secret as in the login route
const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return handleCorsOptions();
}

export async function POST(req) {
    console.log('Refresh cookie API called');
    try {
        // Get token from request - try multiple methods
        let token = null;
        
        // Method 1: From Authorization header
        const authHeader = req.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('Token found in Authorization header');
        }
        
        // Method 2: From request body
        if (!token) {
            try {
                const body = await req.json();
                if (body.token) {
                    token = body.token;
                    console.log('Token found in request body');
                }
            } catch (parseError) {
                console.log('No valid JSON body in request');
            }
        }
        
        if (!token) {
            console.error('No token provided in request');
            const response = NextResponse.json({ 
                error: 'No token provided', 
                diagnostics: {
                    has_auth_header: !!authHeader,
                    auth_header: authHeader ? authHeader.substring(0, 10) + '...' : null
                }
            }, { status: 401 });
            return addCorsHeaders(response);
        }
        
        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('Token successfully verified');
            
            // Determine if we're in a secure environment
            const isSecure = process.env.NODE_ENV === 'production';
            const cookieDomain = process.env.COOKIE_DOMAIN || undefined; // Optional domain setting
            
            // Create a response with the token in a cookie
            const response = NextResponse.json({
                success: true,
                message: 'Cookie refreshed successfully',
                user_id: decoded.userId,
                role: decoded.role,
                // Add diagnostics but don't expose sensitive info
                diagnostics: {
                    token_valid: true,
                    secure_cookie: isSecure,
                    cookie_domain: cookieDomain || 'default',
                    environment: process.env.NODE_ENV
                }
            });
            
            // Set the cookie with proper options
            response.cookies.set({
                name: 'safe_auth_token',
                value: token,
                httpOnly: true, 
                secure: isSecure, // Only HTTPS in production
                sameSite: 'lax',  // Allows redirects but provides some CSRF protection
                path: '/',
                maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
                domain: cookieDomain // Will be undefined for localhost which is correct
            });
            
            // Add diagnostic headers
            response.headers.set('X-Cookie-Set', 'true');
            response.headers.set('X-Auth-Valid', 'true');
            
            return addCorsHeaders(response);
        } catch (error) {
            console.error('Token verification error:', error);
            const response = NextResponse.json({ 
                error: 'Invalid token', 
                message: error.message,
                diagnostics: {
                    token_length: token ? token.length : 0,
                    error_type: error.name
                }
            }, { status: 401 });
            return addCorsHeaders(response);
        }
    } catch (error) {
        console.error('Refresh cookie error:', error);
        const response = NextResponse.json({ error: 'Server error' }, { status: 500 });
        return addCorsHeaders(response);
    }
}
