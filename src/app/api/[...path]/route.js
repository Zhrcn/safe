import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request, { params }) {
  return handleRequest(request, params, 'GET');
}

export async function POST(request, { params }) {
  return handleRequest(request, params, 'POST');
}

export async function PUT(request, { params }) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(request, { params }) {
  return handleRequest(request, params, 'PATCH');
}

async function handleRequest(request, params, method) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}/api/v1/${path}${url.search}`;
    
    console.log(`Proxying ${method} request to: ${backendUrl}`);
    
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    });

    let body = null;
    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text();
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    const responseBody = await response.text();
    
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('API proxy error:', error);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Backend service unavailable',
          message: 'The backend server is not running or not accessible. Please check your BACKEND_URL environment variable.',
          details: `Tried to connect to: ${BACKEND_URL}`,
          solution: 'Deploy your backend to a hosting service like Render or Railway and set the BACKEND_URL environment variable in Vercel.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 