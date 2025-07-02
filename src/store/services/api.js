import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '@/utils/tokenUtils';
import { handleApiError } from '@/utils/errorHandling';

const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api/v1';
    }
    return 'http://localhost:5001/api/v1';
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: getApiUrl(),
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('safe_auth_token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
            headers.set('Origin', origin);
            return headers;
        },
        credentials: 'include',
        mode: 'cors',
    }),
    endpoints: () => ({}),
    transformErrorResponse: handleApiError,
}); 