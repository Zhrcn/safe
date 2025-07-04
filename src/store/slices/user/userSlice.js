import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login,
  register,
  logout
} from '@/store/services/user/authApi';
import { getToken, setToken, removeToken } from '@/utils/tokenUtils';
import { handleAuthError } from '@/utils/errorHandling';
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
export const selectCurrentUser = (state) => state?.user?.user ?? null;
export const selectIsAuthenticated = (state) => state?.user?.isAuthenticated ?? false;
export const selectUserLoading = (state) => state?.user?.loading ?? false;
export const selectUserError = (state) => state?.user?.error ?? null;
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await login({ email, password, role });
      const { token, user } = response;
      setToken(token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      // If register returns a token and user, set them
      const { token, user } = response;
      setToken(token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      removeToken();
      return null;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
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
        state.user = user || null;
        state.token = token || null;
        state.isAuthenticated = !!(user && token);
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsLoading: (state, action) => {
      state.loading = action.payload;
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
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});
export const { setCurrentUser, clearError, setIsLoading } = userSlice.actions;
export default userSlice.reducer;
