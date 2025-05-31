import { NextResponse } from 'next/server';

// Handle OPTIONS requests for CORS
export async function OPTIONS(req) {
    const response = new NextResponse(null, { status: 200 });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    
    return response;
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
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Origin', '*');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        const response = NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
        
        // Add CORS headers
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Origin', '*');
        
        return response;
    }
} 