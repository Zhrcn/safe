import { createSlice } from '@reduxjs/toolkit';
import { doctorApi } from '@/store/services/doctor/doctorApi';

const initialState = {
    consultations: [],
    selectedConsultation: null,
    loading: false,
    error: null
};

const doctorConsultationsSlice = createSlice({
    name: 'doctorConsultations',
    initialState,
    reducers: {
        setSelectedConsultation: (state, action) => {
            state.selectedConsultation = action.payload;
        },
        clearSelectedConsultation: (state) => {
            state.selectedConsultation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                doctorApi.endpoints.getConsultations.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getConsultations.matchFulfilled,
                (state, action) => {
                    state.loading = false;
                    state.consultations = action.payload;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getConsultations.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getConsultationsByPatient.matchFulfilled,
                (state, action) => {
                    state.consultations = action.payload;
                }
            )
            .addMatcher(
                doctorApi.endpoints.createConsultation.matchFulfilled,
                (state, action) => {
                    state.consultations.push(action.payload);
                }
            )
            .addMatcher(
                doctorApi.endpoints.updateConsultation.matchFulfilled,
                (state, action) => {
                    const index = state.consultations.findIndex(c => c.id === action.payload.id);
                    if (index !== -1) {
                        state.consultations[index] = action.payload;
                    }
                }
            );
    }
});

export const {
    setSelectedConsultation,
    clearSelectedConsultation
} = doctorConsultationsSlice.actions;

export default doctorConsultationsSlice.reducer; 