import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '@/store/services/user/userApi';
import { users } from '@/mockdata/users';
import { AUTH_CONSTANTS, ROLES } from '@/config/constants';

// Helper functions for localStorage
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
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

const getStoredSessionTimeout = () => {
    if (typeof window !== 'undefined') {
        return parseInt(localStorage.getItem('sessionTimeout')) || 30 * 60 * 1000; // 30 minutes default
    }
    return 30 * 60 * 1000;
};

const initialState = {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    loading: true,
    error: null,
    authChecked: false,
    lastActivity: Date.now(),
    sessionTimeout: getStoredSessionTimeout(),
    permissions: [],
    role: getStoredUser()?.role?.toLowerCase() || ROLES.PATIENT
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            if (payload?.user && payload?.token) {
                state.user = payload.user;
                state.token = payload.token;
                state.isAuthenticated = true;
                state.role = payload.user.role?.toLowerCase() || ROLES.PATIENT;
                state.permissions = payload.user.permissions || [];
                state.lastActivity = Date.now();
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, payload.token);
                    localStorage.setItem('user', JSON.stringify(payload.user));
                    localStorage.setItem('role', state.role);
                }
            } else if (payload?.user) {
                state.user = payload.user;
                state.isAuthenticated = true;
                state.role = payload.user.role?.toLowerCase() || ROLES.PATIENT;
                state.permissions = payload.user.permissions || [];
            } else {
                console.error('Invalid credentials payload:', payload);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.role = null;
            state.permissions = [];
            state.lastActivity = null;
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
                localStorage.removeItem('user');
                localStorage.removeItem('role');
            }
        },
        setLoading: (state, { payload }) => {
            state.loading = payload;
        },
        setError: (state, { payload }) => {
            state.error = payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, { payload }) => {
            state.user = { ...state.user, ...payload };
            if (payload.role) {
                state.role = payload.role.toLowerCase();
            }
            if (payload.permissions) {
                state.permissions = payload.permissions;
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        updateLastActivity: (state) => {
            state.lastActivity = Date.now();
        },
        setSessionTimeout: (state, { payload }) => {
            state.sessionTimeout = payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('sessionTimeout', payload.toString());
            }
        },
        checkSessionTimeout: (state) => {
            const now = Date.now();
            if (state.lastActivity && (now - state.lastActivity > state.sessionTimeout)) {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.role = null;
                state.permissions = [];
                state.lastActivity = null;
                
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login success
            .addMatcher(
                userApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    const { username, password } = payload;
                    const user = users.find(u => u.username === username && u.password === password);
                    if (user) {
                        state.user = user;
                        state.token = `mock-token-${user.id}`;
                        state.isAuthenticated = true;
                        state.role = user.role?.toLowerCase() || ROLES.PATIENT;
                        state.permissions = user.permissions || [];
                        state.loading = false;
                        state.error = null;
                        state.lastActivity = Date.now();
                        
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, state.token);
                            localStorage.setItem('user', JSON.stringify(user));
                            localStorage.setItem('role', state.role);
                        }
                    } else {
                        state.loading = false;
                        state.error = 'Invalid credentials';
                    }
                }
            )
            // Login failure
            .addMatcher(
                userApi.endpoints.login.matchRejected,
                (state, { payload }) => {
                    state.loading = false;
                    state.error = payload?.data?.message || 'Login failed';
                }
            )
            // Get current user success
            .addMatcher(
                userApi.endpoints.getCurrentUser.matchFulfilled,
                (state, { payload }) => {
                    if (state.token) {
                        const userId = state.token.split('-')[2];
                        const user = users.find(u => u.id === userId);
                        if (user) {
                            state.user = user;
                            state.role = user.role?.toLowerCase() || ROLES.PATIENT;
                            state.permissions = user.permissions || [];
                            state.isAuthenticated = true;
                            state.loading = false;
                            state.error = null;
                            state.authChecked = true;
                            state.lastActivity = Date.now();
                        } else {
                            state.user = null;
                            state.token = null;
                            state.isAuthenticated = false;
                            state.role = null;
                            state.permissions = [];
                            state.loading = false;
                            state.error = 'User not found';
                            state.authChecked = true;
                        }
                    } else {
                        state.user = null;
                        state.token = null;
                        state.isAuthenticated = false;
                        state.role = null;
                        state.permissions = [];
                        state.loading = false;
                        state.error = 'No token found';
                        state.authChecked = true;
                    }
                }
            )
            // Get current user failure
            .addMatcher(
                userApi.endpoints.getCurrentUser.matchRejected,
                (state, { payload }) => {
                    state.user = null;
                    state.token = null;
                    state.isAuthenticated = false;
                    state.role = null;
                    state.permissions = [];
                    state.loading = false;
                    state.error = payload?.data?.message || 'Failed to fetch user data';
                    state.authChecked = true;
                }
            )
            // Token verification success
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && action.type.includes('verifyToken'),
                (state, { payload }) => {
                    if (payload?.success && payload?.data) {
                        state.user = payload.data.user;
                        state.token = payload.data.token || getStoredToken();
                        state.isAuthenticated = true;
                        state.role = payload.data.user.role?.toLowerCase() || ROLES.PATIENT;
                        state.permissions = payload.data.user.permissions || [];
                        state.error = null;
                        state.lastActivity = Date.now();
                        state.authChecked = true;
                        
                        if (payload.data.token && typeof window !== 'undefined') {
                            localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, payload.data.token);
                            localStorage.setItem('user', JSON.stringify(payload.data.user));
                            localStorage.setItem('role', state.role);
                        }
                    }
                }
            )
            // Token verification failure
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && action.type.includes('verifyToken'),
                (state, { payload }) => {
                    state.error = payload?.message || 'Token verification failed';
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                    state.role = null;
                    state.permissions = [];
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
    updateUser,
    updateLastActivity,
    setSessionTimeout,
    checkSessionTimeout
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthChecked = (state) => state.auth.authChecked;
export const selectLastActivity = (state) => state.auth.lastActivity;
export const selectUserRole = (state) => state.auth.role;
export const selectUserPermissions = (state) => state.auth.permissions;
export const selectSessionTimeout = (state) => state.auth.sessionTimeout;

export default authSlice.reducer; 