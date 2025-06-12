import { createSlice } from '@reduxjs/toolkit';
import { doctorApi } from '@/store/services/doctor/doctorApi';

const initialState = {
    patients: [],
    selectedPatient: null,
    favorites: [],
    loading: false,
    error: null
};

const doctorPatientsSlice = createSlice({
    name: 'doctorPatients',
    initialState,
    reducers: {
        setSelectedPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
        addPatientToFavorites: (state, action) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removePatientFromFavorites: (state, action) => {
            state.favorites = state.favorites.filter(id => id !== action.payload);
        },
        clearSelectedPatient: (state) => {
            state.selectedPatient = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                doctorApi.endpoints.getPatients.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getPatients.matchFulfilled,
                (state, action) => {
                    state.loading = false;
                    state.patients = action.payload;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getPatients.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getPatientDetails.matchFulfilled,
                (state, action) => {
                    state.selectedPatient = action.payload;
                }
            );
    }
});

export const {
    setSelectedPatient,
    addPatientToFavorites,
    removePatientFromFavorites,
    clearSelectedPatient
} = doctorPatientsSlice.actions;

export default doctorPatientsSlice.reducer; 