import { createSlice } from '@reduxjs/toolkit';
import { consultationsApi } from '@/store/services/doctor/consultationsApi';
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
                consultationsApi.endpoints.getConsultations.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                consultationsApi.endpoints.getConsultations.matchFulfilled,
                (state, action) => {
                    state.loading = false;
                    state.consultations = action.payload;
                }
            )
            .addMatcher(
                consultationsApi.endpoints.getConsultations.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            )
            .addMatcher(
                consultationsApi.endpoints.createConsultation.matchFulfilled,
                (state, action) => {
                    state.consultations.push(action.payload);
                }
            )
            .addMatcher(
                consultationsApi.endpoints.answerConsultation.matchFulfilled,
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