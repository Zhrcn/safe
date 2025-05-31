import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const publicPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
];

const roleRestrictedPaths = {
    '/doctor': ['doctor'],
    '/patient': ['patient'],
    '/pharmacist': ['pharmacist'],
    '/admin': ['admin'],
};

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;

        for (const [path, roles] of Object.entries(roleRestrictedPaths)) {
            if (pathname.startsWith(path) && !roles.includes(userRole)) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
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