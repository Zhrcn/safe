import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../services/api'; // Assuming api.js is in src/lib/services/

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginCredentials, { rejectWithValue }) => { // loginCredentials = { email, password, role }
    try {
      const { email, password, role } = loginCredentials;
      const response = await authApi.login(email, password, role);
      // API returns { message, user: {id, email, role, name, ...}, source }
      // Token is set as an httpOnly cookie by the server
      if (response.data && response.data.user && response.data.token) { // Check for token as well
        return response.data; // Return the full response data, including token and user
      } else {
        return rejectWithValue(response.data?.message || 'Login failed: No user data received');
      }
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null, 
    isAuthenticated: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => { // payload should be user object or null
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.status = action.payload ? 'succeeded' : 'idle';
      state.error = null;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      // Consider calling an API endpoint for logout if it exists
    },
    // Example: loadUserFromStorage can be added if needed
    // loadUserFromStorage: (state) => {
    //   const storedUser = localStorage.getItem('safe_user_data');
    //   if (storedUser) {
    //     state.currentUser = JSON.parse(storedUser);
    //     state.isAuthenticated = true;
    //     state.status = 'succeeded';
    //   }
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => { // action.payload is { message, token, user, source }
        state.status = 'succeeded';
        state.currentUser = action.payload.user; // Extract user from payload
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
        state.currentUser = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCurrentUser, logoutUser /*, loadUserFromStorage*/ } = userSlice.actions;
export default userSlice.reducer;
