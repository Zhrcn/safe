import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/config/app-config';
import { getToken } from '@/utils/tokenUtils';
import { handleAuthError } from '@/utils/errorHandling';

// Debug function to log request details
const logRequest = (request) => {
    console.log('API Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body
    });
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getToken();
            console.log('Current token in prepareHeaders:', token);
            
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            
            console.log('Final headers:', Object.fromEntries(headers.entries()));
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['User', 'Auth'],
    endpoints: (builder) => ({
        // Auth endpoints
        login: builder.mutation({
            query: (credentials) => {
                const request = {
                    url: '/auth/login',
                    method: 'POST',
                    body: credentials
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Login response:', response);
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Login failed');
            },
            invalidatesTags: ['Auth']
        }),
        register: builder.mutation({
            query: (userData) => {
                const request = {
                    url: '/auth/register',
                    method: 'POST',
                    body: userData
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Register response:', response);
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Registration failed');
            },
            invalidatesTags: ['Auth']
        }),
        verifyToken: builder.query({
            query: () => {
                const request = {
                    url: '/auth/verify',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Verify token response:', response);
                return response.success;
            },
            providesTags: ['Auth']
        }),
        getCurrentUser: builder.query({
            query: () => {
                const request = {
                    url: '/auth/me',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Get current user response:', response);
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch user data');
            },
            providesTags: ['Auth']
        }),
        logout: builder.mutation({
            query: () => {
                const request = {
                    url: '/auth/logout',
                    method: 'POST'
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Logout response:', response);
                return response.success;
            },
            invalidatesTags: ['Auth']
        }),
        resetPassword: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/auth/reset-password',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Reset password response:', response);
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
                    url: '/auth/update-password',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Update password response:', response);
                if (response.success) {
                    return true;
                }
                throw new Error(response.message || 'Failed to update password');
            },
            invalidatesTags: ['Auth']
        }),

        // User profile endpoints
        getProfile: builder.query({
            query: () => {
                const request = {
                    url: '/users/profile',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Get profile response:', response);
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
                    url: '/users/profile',
                    method: 'PUT',
                    body: userData
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Update profile response:', response);
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
                    url: '/users',
                    method: 'GET',
                    params
                };
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Get users response:', response);
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
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Get user by id response:', response);
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
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Update user response:', response);
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
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Delete user response:', response);
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
                logRequest(request);
                return request;
            },
            transformResponse: (response) => {
                console.log('Change password response:', response);
                if (response.success) {
                    return true;
                }
                throw new Error(response.message || 'Failed to change password');
            }
        })
    })
});

export const {
    // Auth hooks
    useLoginMutation,
    useRegisterMutation,
    useVerifyTokenQuery,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
    
    // User profile hooks
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useChangePasswordMutation
} = userApi; 