import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile } from '@/store/services/patient/patientApi';

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
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            });
    },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer; 