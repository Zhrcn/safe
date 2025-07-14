import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as medicalRecordApi from '@/store/services/patient/medicalRecordApi';

export const fetchMedicalRecords = createAsyncThunk(
    'medicalRecord/fetchMedicalRecords',
    async (_, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.getMedicalRecords();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    medicalRecords: null,
    loading: false,
    error: null,
};

const medicalRecordSlice = createSlice({
    name: 'medicalRecord',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMedicalRecords: (state) => {
            state.medicalRecords = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicalRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.medicalRecords = action.payload;
            })
            .addCase(fetchMedicalRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMedicalRecords } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer; 