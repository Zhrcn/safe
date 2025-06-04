import { NextResponse } from 'next/server';

/**
 * Creates a standardized API response with consistent format and headers
 * @param {Object} data - The response data or error information
 * @param {number} status - HTTP status code (default: 200)
 * @param {Object} headers - Additional headers to include in the response
 * @returns {NextResponse} Formatted Next.js response object
 */
export function createApiResponse(data, status = 200, headers = {}) {
  const responseHeaders = {
    'x-api-version': '1.0',
    'x-data-source': headers['x-data-source'] || 'mongodb',
    ...headers
  };
  
  // Standard response format
  const responseBody = {
    success: status >= 200 && status < 300,
    ...(status >= 200 && status < 300 
      ? { data } 
      : { error: data.error || 'An error occurred', message: data.message || '' }),
    timestamp: new Date().toISOString(),
    metadata: {
      source: headers['x-data-source'] || 'mongodb',
      ...(headers['x-data-completeness'] ? { completeness: headers['x-data-completeness'] } : {})
    }
  };
  
  return NextResponse.json(responseBody, { status, headers: responseHeaders });
}
