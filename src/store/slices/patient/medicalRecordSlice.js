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
        addVitalSigns: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.vitalSigns) state.medicalRecords.vitalSigns = [];
            state.medicalRecords.vitalSigns.push(action.payload);
        },
        addAllergy: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.allergies) state.medicalRecords.allergies = [];
            state.medicalRecords.allergies.push(action.payload);
        },
        addChronicCondition: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.chronicConditions) state.medicalRecords.chronicConditions = [];
            state.medicalRecords.chronicConditions.push(action.payload);
        },
        addDiagnosis: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.diagnoses) state.medicalRecords.diagnoses = [];
            state.medicalRecords.diagnoses.push(action.payload);
        },
        addLabResult: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.labResults) state.medicalRecords.labResults = [];
            state.medicalRecords.labResults.push(action.payload);
        },
        addImagingReport: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.imagingReports) state.medicalRecords.imagingReports = [];
            state.medicalRecords.imagingReports.push(action.payload);
        },
        addMedication: (state, action) => {
            if (!state.medicalRecords) state.medicalRecords = {};
            if (!state.medicalRecords.medications) state.medicalRecords.medications = [];
            state.medicalRecords.medications.push(action.payload);
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

export const { 
    clearError, 
    clearMedicalRecords,
    addVitalSigns,
    addAllergy,
    addChronicCondition,
    addDiagnosis,
    addLabResult,
    addImagingReport,
    addMedication
} = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer; 