import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '@/store/slices/auth/authSlice';
import { setToken, getToken, removeToken } from '@/utils/tokenUtils';
import { AUTH_CONSTANTS } from '@/config/constants';
import { ROLES } from '@/config/app-config';

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

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => {
                const request = {
                    url: AUTH_CONSTANTS.API_ENDPOINTS.LOGIN,
                    method: 'POST',
                    body: {
                        ...credentials,
                        role: credentials.role?.toLowerCase()
                    }
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    const userData = {
                        ...response.data.user,
                        role: response.data.user.role?.toLowerCase()
                    };
                    setToken(response.data.token);
                    return {
                        success: true,
                        user: userData,
                        token: response.data.token
                    };
                }
                return {
                    success: false,
                    message: response.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS
                };
            },
            transformErrorResponse: (response) => {
                return {
                    success: false,
                    message: response.data?.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success) {
                        dispatch(setCredentials(data));
                    }
                } catch (error) {
                    removeToken();
                }
            },
        }),
        verifyToken: builder.query({
            query: () => {
                const request = {
                    url: AUTH_CONSTANTS.API_ENDPOINTS.CURRENT_USER,
                    method: 'GET'
                };
                return request;
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    const userData = {
                        ...response.data,
                        role: response.data.role?.toLowerCase()
                    };
                    if (!userData.role) {
                        try {
                            const token = getToken();
                            if (token) {
                                const payload = JSON.parse(atob(token.split('.')[1]));
                                userData.role = payload.role?.toLowerCase();
                            }
                        } catch (error) {
                        }
                    }
                    return {
                        success: true,
                        user: userData
                    };
                }
                return {
                    success: false,
                    message: response.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN
                };
            },
            transformErrorResponse: (response) => {
                removeToken();
                return {
                    success: false,
                    message: response.data?.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.user) {
                        dispatch(setCredentials(data));
                    } else {
                        dispatch(logout());
                    }
                } catch (error) {
                    dispatch(logout());
                }
            },
        }),
        logout: builder.mutation({
            query: () => {
                const request = {
                    url: AUTH_CONSTANTS.API_ENDPOINTS.LOGOUT,
                    method: 'POST'
                };
                return request;
            },
            transformResponse: (response) => {
                removeToken();
                return {
                    success: true,
                    message: response.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.LOGOUT_SUCCESS
                };
            },
            transformErrorResponse: (response) => {
                return {
                    success: false,
                    message: response.data?.message || AUTH_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error) {
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useVerifyTokenQuery,
    useLogoutMutation,
} = authApi; 