// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../lib/services/api'; // Assuming your auth API calls are defined here
import { jwtDecode } from 'jwt-decode';

const TOKEN_STORAGE_KEY = 'safe_auth_token';
const USER_STORAGE_KEY = 'safe_user_data';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(email, password, role);
      const { token, user } = response.data.data; // Access nested data object
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return { token, user };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Assuming authApi.register takes userData (e.g., { email, password, name, role })
      const response = await authApi.register(userData);
      // Assuming the registration API also returns token and user upon successful registration
      const { token, user } = response.data.data; // Access nested data object
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return { token, user };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      if (action.payload) {
        const { user, token } = action.payload;
        state.user = user || null; // Ensure user is null if undefined
        state.token = token || null; // Ensure token is null if undefined
        state.isAuthenticated = !!(user && token); // Only true if both are truthy
      } else {
        // Handle null payload, e.g., during logout or explicit clear
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsLoading: (state, action) => {
      state.loading = action.payload;
    },
    checkAuthStatus: (state) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const userDataString = localStorage.getItem(USER_STORAGE_KEY);
      if (token && userDataString) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp > currentTime) {
            state.user = JSON.parse(userDataString);
            state.token = token;
            state.isAuthenticated = true;
          } else {
            // Token expired
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
          }
        } catch (error) {
          console.error('Error decoding token on auth check:', error);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Handle registerUser cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { setCurrentUser, logoutUser, clearError, checkAuthStatus, setIsLoading } = userSlice.actions;

export default userSlice.reducer;
