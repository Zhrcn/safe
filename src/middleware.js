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

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
                return NextResponse.json({ error: 'Token expired' }, { status: 401 });
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
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
                
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('[Middleware] Token verification error:', error);
        
        // For API routes, return 401 instead of redirecting
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
         * 1. /api/auth/* (authentication endpoints)
         * 2. /_next (Next.js internals)
         * 3. /_static (static files)
         * 4. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!_next|_static|favicon.ico|sitemap.xml).*)',
    ],
}; 