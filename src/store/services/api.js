import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleApiError } from '@/utils/errorHandling';
import { API_BASE_URL } from '@/config/api';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}`,
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