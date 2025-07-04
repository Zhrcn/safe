import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDoctorById,
  updateDoctor
} from '../../services/doctor/doctorApi';

export const fetchDoctorProfile = createAsyncThunk(
    'doctorProfile/fetchProfile',
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await getDoctorById(doctorId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updateDoctorProfile = createAsyncThunk(
    'doctorProfile/updateProfile',
    async ({ doctorId, profileData }, { rejectWithValue }) => {
        try {
            const response = await updateDoctor(doctorId, profileData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
const initialState = {
    profile: null,
    loading: false,
    error: null,
    success: false
};
const doctorProfileSlice = createSlice({
    name: 'doctorProfile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.success = false;
        },
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(fetchDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.success = true;
            })
            .addCase(updateDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
export const { clearProfile, resetStatus } = doctorProfileSlice.actions;
export default doctorProfileSlice.reducer; 