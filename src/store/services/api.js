import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '@/utils/tokenUtils';
import { handleApiError } from '@/utils/errorHandling';

const logRequest = (request) => {
    console.log('API Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body
    });
}; 

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('safe_auth_token');
            console.log('Current token in prepareHeaders:', token);
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            // Set origin dynamically based on environment
            const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
            headers.set('Origin', origin);
            console.log('Final headers:', headers);
            return headers;
        },
        credentials: 'include',
        mode: 'cors',
    }),
    endpoints: () => ({}),
    transformErrorResponse: handleApiError,
}); 