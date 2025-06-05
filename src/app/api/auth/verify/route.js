import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    let token;
    const authHeader = request.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7, authHeader.length); // Extract token from Bearer header
    } else {
      // Fallback to checking cookies if no Bearer token
      const cookieStore = cookies();
      const tokenCookie = cookieStore.get('safe_auth_token');
      if (tokenCookie) {
        token = tokenCookie.value;
      }
    }

    if (!token) {
      console.log('Auth verify: Token not found in header or cookies');
      return NextResponse.json({ message: 'Authentication token not found.' }, { status: 401 });
    }

    console.log('Auth verify: Attempting to verify token:', token.substring(0, 20) + '...'); // Log a truncated token for security
    if (!process.env.JWT_SECRET) {
      console.error('Auth verify: JWT_SECRET is NOT loaded in /api/auth/verify!');
      // Potentially throw an error here or handle it, but for now, logging is key
    } else {
      console.log('Auth verify: JWT_SECRET is loaded.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth verify: Token decoded successfully:', decoded);

    // Token is valid, return user information from token
    return NextResponse.json({ 
      message: 'Token verified successfully.', 
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      },
      source: 'token_verification'
    }, { status: 200 });

  } catch (error) {
    console.error('Auth verify: Token verification error:', error.message, 'Token used:', token ? token.substring(0, 20) + '...' : 'N/A');
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: 'Invalid or expired token.', error: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error during token verification.', error: error.message }, { status: 500 });
  }
}
