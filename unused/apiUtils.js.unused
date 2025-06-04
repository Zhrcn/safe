import { NextResponse } from 'next/server';
import { isMockModeEnabled } from '../mockdb';

/**
 * Wrap API handlers with error handling and mock data support
 * @param {Function} handler - The API route handler function
 * @returns {Function} - Wrapped handler function
 */
export function withErrorHandling(handler) {
    return async function (req, ...args) {
        try {
            // Add header to indicate if we're using mock data
            const response = await handler(req, ...args);

            if (response instanceof NextResponse && isMockModeEnabled()) {
                response.headers.set('X-Data-Source', 'mock_data');
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            return NextResponse.json(
                {
                    error: error.message || 'An unexpected error occurred',
                    code: error.code || 'UNKNOWN_ERROR',
                    diagnostic: error.diagnostic || null
                },
                { status: error.status || 500 }
            );
        }
    };
}

/**
 * Add CORS headers to a Next.js API route
 * @param {Object} corsHeaders - CORS headers to add
 * @returns {Function} - Middleware function that adds CORS headers
 */
export function withCors(corsHeaders = {}) {
    const defaultCorsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const finalCorsHeaders = { ...defaultCorsHeaders, ...corsHeaders };

    return function (handler) {
        return async function (req, ...args) {
            // Handle OPTIONS request for preflight
            if (req.method === 'OPTIONS') {
                const response = new NextResponse(null, { status: 204 });

                // Add CORS headers
                Object.entries(finalCorsHeaders).forEach(([key, value]) => {
                    response.headers.set(key, value);
                });

                return response;
            }

            // Call the original handler
            const response = await handler(req, ...args);

            // Add CORS headers to the response
            if (response instanceof NextResponse) {
                Object.entries(finalCorsHeaders).forEach(([key, value]) => {
                    response.headers.set(key, value);
                });
            }

            return response;
        };
    };
}

/**
 * Combine multiple middleware functions
 * @param {...Function} middlewares - Middleware functions to combine
 * @returns {Function} - Combined middleware function
 */
export function compose(...middlewares) {
    return function (handler) {
        return middlewares.reduceRight((wrapped, middleware) => {
            return middleware(wrapped);
        }, handler);
    };
}

/**
 * Create an API wrapper with error handling and CORS support
 * @param {Object} options - Options for the API wrapper
 * @returns {Function} - Function that wraps API handlers
 */
export function createApiHandler(options = {}) {
    const { corsHeaders = {} } = options;

    return function (handler) {
        return compose(
            withErrorHandling,
            withCors(corsHeaders)
        )(handler);
    };
} 