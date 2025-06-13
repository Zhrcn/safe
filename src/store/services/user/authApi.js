import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '@/store/slices/user/authSlice';
import { setToken, getToken, removeToken } from '@/utils/tokenUtils';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/v1/auth',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response) => {
                if (response.success && response.data) {
                    setToken(response.data.token);
                    return {
                        success: true,
                        user: response.data.user,
                        token: response.data.token
                    };
                }
                return {
                    success: false,
                    message: response.message || 'Login failed'
                };
            },
            transformErrorResponse: (response) => {
                return {
                    success: false,
                    message: response.data?.message || 'Invalid email or password'
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success) {
                        dispatch(setCredentials(data));
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    removeToken();
                }
            },
        }),
        verifyToken: builder.query({
            query: () => ({
                url: '/me',
                method: 'GET',
            }),
            transformResponse: (response) => {
                if (response.success && response.data) {
                    // Ensure we have a valid user object with role
                    const userData = response.data;
                    if (!userData.role) {
                        // If role is not in the response, try to get it from the token
                        try {
                            const token = getToken();
                            if (token) {
                                const payload = JSON.parse(atob(token.split('.')[1]));
                                userData.role = payload.role;
                            }
                        } catch (error) {
                            console.error('Error parsing token:', error);
                        }
                    }

                    return {
                        success: true,
                        user: userData,
                        token: getToken()
                    };
                }
                return {
                    success: false,
                    message: response.message || 'Token verification failed'
                };
            },
            transformErrorResponse: (response) => {
                removeToken();
                return {
                    success: false,
                    message: response.data?.message || 'Invalid or expired token'
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.user && data.user.role) {
                        dispatch(setCredentials(data));
                    } else {
                        dispatch(logout());
                    }
                } catch (error) {
                    console.error('Token verification error:', error);
                    dispatch(logout());
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            transformResponse: (response) => {
                removeToken();
                return {
                    success: true,
                    message: response.message || 'Logged out successfully'
                };
            },
            transformErrorResponse: (response) => {
                return {
                    success: false,
                    message: response.data?.message || 'Logout failed'
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error) {
                    console.error('Logout error:', error);
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