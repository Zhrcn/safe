import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { corsHeaders } from '@/lib/cors';

export async function GET(request) {
  // Add CORS headers
  const response = NextResponse.json({
    message: 'Debug endpoint',
    environment: process.env.NODE_ENV,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
    headers: Object.fromEntries(headers()),
    timestamp: new Date().toISOString(),
  });

  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  
  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
} 