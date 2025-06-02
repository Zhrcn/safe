import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Public paths that don't require authentication
const publicPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/logout',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/auth/check',
];

// Role-restricted paths
const roleRestrictedPaths = {
    '/doctor': ['doctor'],
    '/patient': ['patient'],
    '/pharmacist': ['pharmacist'],
    '/admin': ['admin'],
};

// Store a flag indicating whether we're using mock data
let USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Define mock API paths to intercept
const MOCK_API_PATHS = [
    '/api/appointments',
    '/api/users',
    '/api/auth/login',
    '/api/medical-file',
    '/api/prescriptions',
    '/api/consultations',
    // Helper function to add CORS headers
    function addCorsHeaders(response) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
        response.headers.set(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        );
        return response;
    }

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return addCorsHeaders(new NextResponse(null, { status: 200 }));
    }

    // Skip middleware for API routes except those that need role checking
    if (pathname.startsWith('/api/') &&
        !pathname.includes('/api/doctor/') &&
        !pathname.includes('/api/patient/') &&
        !pathname.includes('/api/pharmacist/') &&
        !pathname.includes('/api/admin/')) {
        return NextResponse.next();
    }

    // Allow access to public paths without authentication
    if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
        return NextResponse.next();
    }

    // Allow access to static resources
    if (pathname.startsWith('/_next') ||
        pathname.startsWith('/assets') ||
        pathname.startsWith('/avatars') ||
        pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check for token in cookies or Authorization header
    const token = request.cookies.get('safe_auth_token')?.value ||
        request.headers.get('Authorization')?.replace('Bearer ', '');

    // If no token found, redirect to login
    if (!token) {
        console.log(`[Middleware] No token found for ${pathname}, redirecting to login`);

        // For API routes, return 401 instead of redirecting
        if (pathname.startsWith('/api/')) {
            return addCorsHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
        }

        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        const currentTime = Date.now() / 1000;

        console.log(`[Middleware] Token found for ${pathname}, role: ${userRole}`);

        // Check if token is expired
        if (decoded.exp && decoded.exp < currentTime) {
            console.log(`[Middleware] Token expired for ${pathname}, redirecting to login`);

            // For API routes, return 401 instead of redirecting
            if (pathname.startsWith('/api/')) {
                return addCorsHeaders(NextResponse.json({ error: 'Token expired' }, { status: 401 }));
            }

            const url = new URL('/login', request.url);
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }

        // Check role-based access restrictions
        for (const [path, roles] of Object.entries(roleRestrictedPaths)) {
            if (pathname.startsWith(path) && !roles.includes(userRole)) {
                console.log(`[Middleware] User with role ${userRole} attempted to access ${pathname}`);

                // For API routes, return 403 instead of redirecting
                if (pathname.startsWith('/api/')) {
                    return addCorsHeaders(NextResponse.json({ error: 'Forbidden' }, { status: 403 }));
                }

                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        // Add CORS headers to API responses
        if (pathname.startsWith('/api/')) {
            const response = NextResponse.next();
            return addCorsHeaders(response);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('[Middleware] Token verification error:', error);

        // For API routes, return 401 instead of redirecting
        if (pathname.startsWith('/api/')) {
            return addCorsHeaders(NextResponse.json({ error: 'Invalid token' }, { status: 401 }));
        }

        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /_next (Next.js internals)
         * 2. /_static (static files)
         * 3. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!_next|_static|favicon.ico|sitemap.xml).*)',
    ],
}; 