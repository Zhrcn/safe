import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Schema for validating the request body
const setCookieSchema = z.object({
  token: z.string().min(1, "Token is required")
});

// Cookie settings
const COOKIE_NAME = 'safe_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * Handles POST requests to set the authentication cookie
 * @param {Request} request - The incoming request
 * @returns {NextResponse} The response
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validatedData = setCookieSchema.parse(body);
    
    // Set the cookie
    cookies().set({
      name: COOKIE_NAME,
      value: validatedData.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'strict'
    });
    
    console.log('Auth cookie set successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Authentication cookie set successfully'
    });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: error.errors 
        }, 
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to set authentication cookie',
        message: error.message || 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
