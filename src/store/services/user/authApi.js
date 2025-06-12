import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '@/utils/tokenUtils';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/v1',
    prepareHeaders: (headers) => {
        const token = getToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials
            }),
            transformResponse: (response) => {
                console.log('Login response:', response);
                if (response.success && response.data) {
                    return {
                        user: response.data.user,
                        token: response.data.token
                    };
                }
                return response;
            }
        }),
        verifyToken: builder.query({
            query: () => ({
                url: '/auth/me',
                method: 'GET'
            }),
            transformResponse: (response) => {
                console.log('Token verification response:', response);
                if (response.success && response.data) {
                    const userData = {
                        ...response.data,
                        role: response.data.role || 'patient'
                    };
                    
                    return {
                        success: true,
                        data: {
                            user: userData,
                            token: getToken()
                        }
                    };
                }
                return {
                    success: false,
                    error: response.message || 'Token verification failed'
                };
            },
            transformErrorResponse: (response) => {
                console.error('Token verification error:', response);
                return {
                    success: false,
                    error: response.data?.message || 'Token verification failed'
                };
            }
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData
            })
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email }
            })
        }),
        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { token, password }
            })
        }),
        verifyEmail: builder.mutation({
            query: (token) => ({
                url: '/auth/verify-email',
                method: 'POST',
                body: { token }
            })
        }),
        resendVerification: builder.mutation({
            query: (email) => ({
                url: '/auth/resend-verification',
                method: 'POST',
                body: { email }
            })
        })
    })
});

export const {
    useLoginMutation,
    useVerifyTokenQuery,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailMutation,
    useResendVerificationMutation
} = authApi; 