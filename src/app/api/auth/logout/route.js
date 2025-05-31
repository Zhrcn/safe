import { NextResponse } from 'next/server';
import { corsHeaders, handleCorsOptions, addCorsHeaders } from '@/lib/cors';

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return handleCorsOptions();
}

export async function POST() {
    try {
        const response = NextResponse.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });

        // Clear the auth token cookie
        response.cookies.set({
            name: 'safe_auth_token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Expire immediately
            sameSite: 'lax',
            path: '/',
        });

        // Add CORS headers
        return addCorsHeaders(response);
    } catch (error) {
        console.error('Logout error:', error);
        const response = NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
        
        // Add CORS headers
        return addCorsHeaders(response);
    }
} 