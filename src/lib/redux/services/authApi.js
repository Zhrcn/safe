import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/app-config';

const TOKEN_STORAGE_KEY = 'safe_auth_token'; 

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            let token = getState().user?.token; // Try getting token from Redux state

            if (!token) {
                // Fallback: If not in Redux state, try getting it from localStorage.
                try {
                    const tokenFromStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
                    if (tokenFromStorage) {
                        token = tokenFromStorage;
                        console.log('authApi/prepareHeaders: Using token from localStorage fallback.');
                    }
                } catch (e) {
                    console.warn('authApi/prepareHeaders: localStorage not accessible or token not found for fallback.', e);
                }
            }

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            } else {
                // This log is important to see if NO token is being found anywhere
                console.warn('authApi/prepareHeaders: No token found in Redux state or localStorage fallback to set Authorization header.');
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        verifyToken: builder.query({
            query: () => ({ // Changed to object form to be consistent
                url: `/auth/verify?timestamp=${Date.now()}`,
                method: 'GET', // Explicitly GET
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/update-password',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useVerifyTokenQuery,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
} = authApi; 