import { NextResponse } from 'next/server';

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
            sameSite: 'strict',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
} 