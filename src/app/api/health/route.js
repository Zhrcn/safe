import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        status: 'healthy', 
        backend: 'connected',
        message: 'Backend server is running',
        data
      });
    } else {
      return NextResponse.json({ 
        status: 'unhealthy', 
        backend: 'error',
        message: 'Backend server responded with error',
        statusCode: response.status
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({ 
      status: 'unhealthy', 
      backend: 'unreachable',
      message: 'Backend server is not accessible',
      error: error.message
    }, { status: 503 });
  }
} 