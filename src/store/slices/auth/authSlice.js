import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_CONSTANTS, ROLES } from '@/config/constants';
import { logout as logoutApi } from '@/store/services/user/authApi';
import { authApi } from '@/store/api/authApi';
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
    }
    return null;
};

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            await logoutApi();
            removeToken();
            // Clear RTK Query cache
            dispatch(authApi.util.resetApiState());
            return null;
        } catch (error) {
            // Even if the API call fails, we should still clear local state
            removeToken();
            // Clear RTK Query cache even on error
            dispatch(authApi.util.resetApiState());
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

const getStoredUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

const getStoredSessionTimeout = () => {
    if (typeof window !== 'undefined') {
        return parseInt(localStorage.getItem('sessionTimeout')) || 30 * 60 * 1000;
    }
    return 30 * 60 * 1000;
};

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    authChecked: false,
    lastActivity: Date.now(),
    sessionTimeout: getStoredSessionTimeout(),
    permissions: [],
    role: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            if (payload?.user && payload?.token) {
                // Clear any existing state first
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.role = null;
                state.permissions = [];
                
                // Set new credentials
                state.user = payload.user;
                state.token = payload.token;
                state.isAuthenticated = true;
                state.role = payload.user.role?.toLowerCase() || ROLES.PATIENT;
                state.permissions = payload.user.permissions || [];
                state.lastActivity = Date.now();
                state.loading = false;
                state.error = null;
                
                if (typeof window !== 'undefined') {
                    // Clear old data first
                    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    
                    // Set new data
                    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, payload.token);
                    localStorage.setItem('user', JSON.stringify(payload.user));
                    localStorage.setItem('role', state.role);
                }
            } else if (payload?.user) {
                // Clear any existing state first
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.role = null;
                state.permissions = [];
                
                // Set new user data
                state.user = payload.user;
                state.isAuthenticated = true;
                state.role = payload.user.role?.toLowerCase() || ROLES.PATIENT;
                state.permissions = payload.user.permissions || [];
                state.loading = false;
                state.error = null;
            } else {
                console.error('Invalid credentials payload:', payload);
                state.loading = false;
                state.error = 'Invalid credentials payload';
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
        },
        setAuthLoading: (state, { payload }) => {
            state.loading = payload;
        },
        setLoginError: (state, { payload }) => {
            state.error = payload;
            state.loading = false;
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.role = null;
            state.permissions = [];
            state.lastActivity = null;
            state.loading = false;
            state.error = null;
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
                localStorage.removeItem('user');
                localStorage.removeItem('role');
            }
        },
        clearCache: () => {
            // This action will be handled by middleware to clear RTK Query cache
        },
        restoreAuth: (state) => {
            const storedUser = getStoredUser();
            const storedToken = getStoredToken();
            
            if (storedUser && storedToken) {
                state.user = storedUser;
                state.token = storedToken;
                state.isAuthenticated = true;
                state.role = storedUser.role?.toLowerCase() || ROLES.PATIENT;
                state.permissions = storedUser.permissions || [];
                state.authChecked = true;
            } else {
                state.authChecked = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.role = null;
                state.permissions = [];
                state.lastActivity = null;
                state.loading = false;
                state.error = null;
                
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                }
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // Even if logout fails, clear the state
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.role = null;
                state.permissions = [];
                state.lastActivity = null;
                state.loading = false;
                state.error = action.payload;
                
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                }
            });
    }
});

export const { setCredentials, logout, setLoading, setError, clearError, updateUser, updateLastActivity, setSessionTimeout, checkSessionTimeout, setAuthLoading, setLoginError, clearAuth, clearCache, restoreAuth } = authSlice.actions;
export default authSlice.reducer;

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