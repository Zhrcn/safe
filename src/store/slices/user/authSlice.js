import { createSlice } from '@reduxjs/toolkit';

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
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            console.log('Setting credentials:', payload);
            if (!payload?.user || !payload?.token) {
                console.error('Invalid credentials:', payload);
                return;
            }
            state.user = payload.user;
            state.token = payload.token;
            state.isAuthenticated = true;
            state.error = null;
            
            // Store in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', payload.token);
                localStorage.setItem('user', JSON.stringify(payload.user));
            }
        },
        setLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        setError: (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            
            // Clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle login success
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && action.type.includes('login'),
                (state, { payload }) => {
                    if (payload?.success && payload?.data) {
                        state.user = payload.data.user;
                        state.token = payload.data.token;
                        state.isAuthenticated = true;
                        state.error = null;
                        
                        // Store in localStorage
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('token', payload.data.token);
                            localStorage.setItem('user', JSON.stringify(payload.data.user));
                        }
                    }
                }
            )
            // Handle token verification success
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && action.type.includes('verifyToken'),
                (state, { payload }) => {
                    if (payload?.success && payload?.data) {
                        state.user = payload.data.user;
                        state.token = payload.data.token || getStoredToken();
                        state.isAuthenticated = true;
                        state.error = null;
                        
                        // Update localStorage if token is provided
                        if (payload.data.token && typeof window !== 'undefined') {
                            localStorage.setItem('token', payload.data.token);
                            localStorage.setItem('user', JSON.stringify(payload.data.user));
                        }
                    }
                }
            )
            // Handle auth errors
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && 
                    (action.type.includes('login') || action.type.includes('verifyToken')),
                (state, { payload }) => {
                    state.error = payload?.message || 'Authentication failed';
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                    
                    // Clear localStorage on auth error
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                }
            );
    }
});

export const { setCredentials, setLoading, setError, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading; 