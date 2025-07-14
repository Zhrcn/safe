import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login,
  register,
  logout
} from '@/store/services/user/authApi';
import {
  getUserProfile,
  updateUserProfile,
  uploadUserProfileImage
} from '@/store/services/user/userApi';
import { getToken, setToken, removeToken } from '@/utils/tokenUtils';
import { handleAuthError } from '@/utils/errorHandling';
import { API_BASE_URL } from '@/config/api';

// Helper function to transform relative image URLs to full URLs
const transformImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
  return imageUrl;
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
  imageUploadLoading: false,
  imageUploadError: null,
};

export const selectCurrentUser = (state) => state?.user?.user ?? null;
export const selectIsAuthenticated = (state) => state?.user?.isAuthenticated ?? false;
export const selectUserLoading = (state) => state?.user?.loading ?? false;
export const selectUserError = (state) => state?.user?.error ?? null;
export const selectProfileLoading = (state) => state?.user?.profileLoading ?? false;
export const selectProfileError = (state) => state?.user?.profileError ?? null;
export const selectImageUploadLoading = (state) => state?.user?.imageUploadLoading ?? false;
export const selectImageUploadError = (state) => state?.user?.imageUploadError ?? null;

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

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Update user profile
export const updateUserProfileData = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Upload user profile image
export const uploadUserProfileImageData = createAsyncThunk(
  'user/uploadImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await uploadUserProfileImage(formData);
      return response;
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
      state.profileError = null;
      state.imageUploadError = null;
    },
    setIsLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearImageUploadError: (state) => {
      state.imageUploadError = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Transform the user profile image URL to full URL
        const user = {
          ...action.payload.user,
          profileImage: transformImageUrl(action.payload.user?.profileImage)
        };
        state.user = user;
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
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Transform the user profile image URL to full URL
        const user = {
          ...action.payload.user,
          profileImage: transformImageUrl(action.payload.user?.profileImage)
        };
        state.user = user;
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
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        // Transform the user profile image URL to full URL
        const user = {
          ...action.payload.user,
          profileImage: transformImageUrl(action.payload.user?.profileImage)
        };
        state.user = user;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      
      // Update profile
      .addCase(updateUserProfileData.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfileData.fulfilled, (state, action) => {
        state.profileLoading = false;
        // Transform the user profile image URL to full URL
        const user = {
          ...action.payload,
          profileImage: transformImageUrl(action.payload?.profileImage)
        };
        state.user = user;
        state.profileError = null;
      })
      .addCase(updateUserProfileData.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      
      // Upload image
      .addCase(uploadUserProfileImageData.pending, (state) => {
        state.imageUploadLoading = true;
        state.imageUploadError = null;
      })
      .addCase(uploadUserProfileImageData.fulfilled, (state, action) => {
        state.imageUploadLoading = false;
        if (state.user) {
          state.user.profileImage = transformImageUrl(action.payload.imageUrl);
        }
        state.imageUploadError = null;
      })
      .addCase(uploadUserProfileImageData.rejected, (state, action) => {
        state.imageUploadLoading = false;
        state.imageUploadError = action.payload;
      });
  },
});

export const { 
  setCurrentUser, 
  clearError, 
  setIsLoading, 
  clearImageUploadError, 
  clearProfileError 
} = userSlice.actions;

export default userSlice.reducer;
