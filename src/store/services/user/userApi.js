import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_CONSTANTS } from '@/config/constants';
import { getToken } from '@/utils/tokenUtils';
import { handleAuthError } from '@/utils/errorHandling';

const logRequest = (request) => {
    console.log('API Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body
    });
};

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = getToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        headers.set('Origin', 'http://localhost:3000');
        return headers;
    },
});

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    tagTypes: ['Auth', 'User'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => {
                const request = {
                    url: '/api/v1/auth/login',
                    method: 'POST',
                    body: credentials,
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    const { token, user } = response.data;
                    localStorage.setItem('safe_auth_token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    return { user, token };
                }
                throw new Error(response.message || 'Login failed');
            },
            transformErrorResponse: (response) => {
                return response;
            },
            invalidatesTags: ['Auth']
        }),
        verifyToken: builder.mutation({
            query: () => {
                const token = localStorage.getItem('safe_auth_token');
                const request = {
                    url: '/api/v1/auth/me',
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': 'http://localhost:3000'
                    }
                };
                return request;
            },
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return response;
            },
        }),
        getCurrentUser: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/auth/me',
                    method: 'GET'
                };
                return request;
            },
            providesTags: ['User']
        }),
        logout: builder.mutation({
            query: () => {
                const request = {
                    url: '/api/v1/auth/logout',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`,
                        'Content-Type': 'application/json'
                    }
                };
                return request;
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('safe_auth_token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('role');
                        localStorage.removeItem('sessionTimeout');
                    }
                    dispatch(logout());
                } catch (error) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('safe_auth_token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('role');
                        localStorage.removeItem('sessionTimeout');
                    }
                    dispatch(logout());
                }
            },
            invalidatesTags: ['Auth', 'User']
        }),
        register: builder.mutation({
            query: (userData) => {
                const request = {
                    url: '/api/v1/auth/register',
                    method: 'POST',
                    body: userData
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Registration failed');
            },
            invalidatesTags: ['Auth']
        }),
        resetPassword: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/auth/reset-password',
                    method: 'POST',
                    body: data
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success) {
                    return true;
                }
                throw new Error(response.message || 'Failed to reset password');
            },
            invalidatesTags: ['Auth']
        }),
        updatePassword: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/auth/update-password',
                    method: 'POST',
                    body: data
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success) {
                    return true;
                }
                throw new Error(response.message || 'Failed to update password');
            },
            invalidatesTags: ['Auth']
        }),
        getProfile: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/users/profile',
                    method: 'GET'
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch profile');
            },
            providesTags: ['User']
        }),
        updateProfile: builder.mutation({
            query: (userData) => {
                const request = {
                    url: '/api/v1/users/profile',
                    method: 'PUT',
                    body: userData
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to update profile');
            },
            invalidatesTags: ['User']
        }),
        getUsers: builder.query({
            query: (params) => {
                const request = {
                    url: '/api/v1/users',
                    method: 'GET',
                    params
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch users');
            },
            providesTags: ['User']
        }),
        getUserById: builder.query({
            query: (id) => {
                const request = {
                    url: `/users/${id}`,
                    method: 'GET'
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch user');
            },
            providesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/users/${id}`,
                    method: 'PATCH',
                    body: data
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to update user');
            },
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: (id) => {
                const request = {
                    url: `/users/${id}`,
                    method: 'DELETE'
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success) {
                    return true;
                }
                throw new Error(response.message || 'Failed to delete user');
            },
            invalidatesTags: ['User']
        }),
        changePassword: builder.mutation({
            query: (passwordData) => {
                const request = {
                    url: '/users/change-password',
                    method: 'POST',
                    body: passwordData
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success) {
                    return true;
                }
                throw new Error(response.message || 'Failed to change password');
            }
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useVerifyTokenMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useChangePasswordMutation
} = userApi; 