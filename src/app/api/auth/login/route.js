// Use CommonJS imports for compatibility with Next.js 14.x
const { NextResponse } = require('next/server');
const { corsHeaders, handleCorsOptions } = require('@/lib/cors');
const { handleLogin } = require('@/controllers/auth/loginController');

export async function OPTIONS() {
    return handleCorsOptions();
}

export async function POST(req) {
    try {
        const body = await req.json();
        const result = await handleLogin(body);

        console.log('Login attempt:', JSON.stringify({
            email: body.email,
            role: body.role
        }, null, 2));

        if (result.success) {
            const response = NextResponse.json({
                token: result.token,
                user: result.user,
                source: result.source
            });
            
            response.cookies.set({
                name: 'safe_auth_token',
                value: result.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60, 
                path: '/',
            });
            
            Object.entries(corsHeaders).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
            
            return response;
        } else {
            const status = result.status || 500;
            const errorResponse = NextResponse.json(
                {
                    error: result.error,
                    message: result.message,
                    type: result.type,
                    diagnostic: result.diagnostic,
                    details: result.details
                },
                { status }
            );
            
            if (result.type) {
                errorResponse.headers.set('X-Error-Type', result.type);
            }
            if (result.message) {
                errorResponse.headers.set('X-Error-Message', result.message.substring(0, 200));
            }
            Object.entries(corsHeaders).forEach(([key, value]) => {
                errorResponse.headers.set(key, value);
            });

            return errorResponse;
        }
    } catch (error) {
        console.error('Unexpected error in login route:', error);
        
        // Create structured error response with more information
        const errorType = error.code || 'UNKNOWN_ERROR';
        const errorMessage = error.message || 'Unknown error';
        const diagnostic = error.diagnostic || 'Internal server error';
        
        const errorResponse = NextResponse.json(
            {
                error: 'Internal server error',
                message: errorMessage,
                type: errorType,
                diagnostic: diagnostic
            },
            { status: 500 }
        );
        
        // Add diagnostic headers
        errorResponse.headers.set('X-Error-Type', errorType);
        errorResponse.headers.set('X-Error-Message', errorMessage.substring(0, 200));
        Object.entries(corsHeaders).forEach(([key, value]) => {
            errorResponse.headers.set(key, value);
        });

        return errorResponse;
    }
}