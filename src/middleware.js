import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Add paths that don't require authentication
const publicPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
];

// Add paths that require specific roles
const roleRestrictedPaths = {
    '/doctor': ['doctor'],
    '/patient': ['patient'],
    '/pharmacist': ['pharmacist'],
    '/admin': ['admin'],
};

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow access to public paths
    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check for authentication token
    const token = request.cookies.get('token')?.value;

    if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    try {
        // Verify token and check role permissions
        const decoded = jwtDecode(token);
        const userRole = decoded.role;

        // Check role-restricted paths
        for (const [path, roles] of Object.entries(roleRestrictedPaths)) {
            if (pathname.startsWith(path) && !roles.includes(userRole)) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        // If token is invalid, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (static files)
         * 4. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!api|_next|_static|favicon.ico|sitemap.xml).*)',
    ],
}; 