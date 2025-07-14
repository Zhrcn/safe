import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile } from '@/store/services/patient/patientApi';
import { API_BASE_URL } from '@/config/api';

// Helper function to transform relative image URLs to full URLs
const transformImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) {
    const fullUrl = `${API_BASE_URL}${imageUrl}`;
    console.log('Transforming image URL:', { original: imageUrl, transformed: fullUrl });
    return fullUrl;
  }
  console.log('Image URL not transformed:', imageUrl);
  return imageUrl;
};

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await getProfile();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editProfile = createAsyncThunk(
    'profile/editProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            return await updateProfile(profileData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addAllergy = createAsyncThunk(
    'profile/addAllergy',
    async (allergyData, { rejectWithValue }) => {
        try {
            // TODO: Replace with API call
            return allergyData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const addChronicCondition = createAsyncThunk(
    'profile/addChronicCondition',
    async (conditionData, { rejectWithValue }) => {
        try {
            // TODO: Replace with API call
            return conditionData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const addMedication = createAsyncThunk(
    'profile/addMedication',
    async (medicationData, { rejectWithValue }) => {
        try {
            // TODO: Replace with API call
            return medicationData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Transform profile image URLs to full URLs
                const profile = {
                    ...action.payload,
                    profileImage: transformImageUrl(action.payload?.profileImage),
                    user: action.payload?.user ? {
                        ...action.payload.user,
                        profileImage: transformImageUrl(action.payload.user?.profileImage)
                    } : action.payload?.user
                };
                state.profile = profile;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                // Transform profile image URLs to full URLs
                const profile = {
                    ...action.payload,
                    profileImage: transformImageUrl(action.payload?.profileImage),
                    user: action.payload?.user ? {
                        ...action.payload.user,
                        profileImage: transformImageUrl(action.payload.user?.profileImage)
                    } : action.payload?.user
                };
                state.profile = profile;
            });
    },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer; 