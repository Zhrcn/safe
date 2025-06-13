import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '@/store/services/user/userApi';
import { users } from '../../mockdata/users';

// Helper function to safely access localStorage
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

const getStoredUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

const initialState = {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    loading: true,
    error: null,
    authChecked: false,
    lastActivity: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = !!token;
            state.loading = false;
            state.error = null;
            state.lastActivity = Date.now();
            
            if (typeof window !== 'undefined') {
                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        },
        initializeAuth: (state) => {
            state.user = getStoredUser();
            state.token = getStoredToken();
            state.isAuthenticated = !!getStoredToken();
            state.loading = false;
            state.authChecked = true;
            state.lastActivity = Date.now();
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.lastActivity = null;
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            }
        },
        updateLastActivity: (state) => {
            state.lastActivity = Date.now();
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle login success
            .addMatcher(
                userApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    const { username, password } = payload; // Assuming payload contains username and password
                    const user = users.find(u => u.username === username && u.password === password);

                    if (user) {
                        state.user = user;
                        state.token = `mock-token-${user.id}`;
                        state.isAuthenticated = true;
                        state.loading = false;
                        state.error = null;
                        state.lastActivity = Date.now();
                        
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('token', state.token);
                            localStorage.setItem('user', JSON.stringify(user));
                        }
                    } else {
                        state.loading = false;
                        state.error = 'Invalid credentials';
                    }
                }
            )
            // Handle login failure
            .addMatcher(
                userApi.endpoints.login.matchRejected,
                (state, { payload }) => {
                    state.loading = false;
                    state.error = payload?.data?.message || 'Login failed';
                }
            )
            // Handle getCurrentUser success
            .addMatcher(
                userApi.endpoints.getCurrentUser.matchFulfilled,
                (state, { payload }) => {
                    // For mock data, we can assume if there's a token, the user is authenticated.
                    // In a real app, this would fetch user details based on the token.
                    if (state.token) {
                        const userId = state.token.split('-')[2]; // Extract user ID from mock token
                        state.user = users.find(u => u.id === userId);
                        state.isAuthenticated = true;
                        state.loading = false;
                        state.error = null;
                        state.authChecked = true;
                        state.lastActivity = Date.now();
                    } else {
                        state.user = null;
                        state.token = null;
                        state.isAuthenticated = false;
                        state.loading = false;
                        state.error = 'No token found';
                        state.authChecked = true;
                    }
                }
            )
            // Handle getCurrentUser failure
            .addMatcher(
                userApi.endpoints.getCurrentUser.matchRejected,
                (state, { payload }) => {
                    state.user = null;
                    state.token = null;
                    state.isAuthenticated = false;
                    state.loading = false;
                    state.error = payload?.data?.message || 'Failed to fetch user data';
                    state.authChecked = true;
                }
            );
    }
});

export const {
    setCredentials,
    logout,
    setLoading,
    setError,
    clearError,
    initializeAuth,
    updateUser,
    updateLastActivity
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthChecked = (state) => state.auth.authChecked;
export const selectLastActivity = (state) => state.auth.lastActivity; 