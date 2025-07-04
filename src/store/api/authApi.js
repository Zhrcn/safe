import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '@/utils/tokenUtils';
import { API_BASE_URL } from '@/config/api';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${API_BASE_URL}/api/v1`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: 'auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
        }),
        getCurrentUser: builder.query({
            query: () => 'auth/me',
        }),
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: 'auth/profile',
                method: 'PUT',
                body: profileData,
            }),
        }),
        refreshToken: builder.mutation({
            query: () => ({
                url: 'auth/refresh',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useRefreshTokenMutation,
} = authApi; 