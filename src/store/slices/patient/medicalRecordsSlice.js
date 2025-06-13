import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    basicInfo: null,
    vitalSigns: null,
    allergies: [],
    conditions: [],
    medications: [],
    immunizations: [],
    labResults: [],
    procedures: [],
    familyHistory: [],
    lifestyle: null,
    loading: false,
    error: null
};

const medicalRecordsSlice = createSlice({
    name: 'medicalRecords',
    initialState,
    reducers: {
        setMedicalRecords: (state, action) => {
            return { ...state, ...action.payload };
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { setMedicalRecords, setLoading, setError, clearError } = medicalRecordsSlice.actions;

export default medicalRecordsSlice.reducer; 