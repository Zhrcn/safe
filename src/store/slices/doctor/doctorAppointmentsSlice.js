import { createSlice } from '@reduxjs/toolkit';
import { doctorApi } from '@/store/services/doctor/doctorApi';

const initialState = {
    appointments: [],
    selectedAppointment: null,
    loading: false,
    error: null
};

const doctorAppointmentsSlice = createSlice({
    name: 'doctorAppointments',
    initialState,
    reducers: {
        setSelectedAppointment: (state, action) => {
            state.selectedAppointment = action.payload;
        },
        clearSelectedAppointment: (state) => {
            state.selectedAppointment = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                doctorApi.endpoints.getAppointments.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getAppointments.matchFulfilled,
                (state, action) => {
                    state.loading = false;
                    state.appointments = action.payload;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getAppointments.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            )
            .addMatcher(
                doctorApi.endpoints.getAppointmentsByPatient.matchFulfilled,
                (state, action) => {
                    state.appointments = action.payload;
                }
            )
            .addMatcher(
                doctorApi.endpoints.createAppointment.matchFulfilled,
                (state, action) => {
                    state.appointments.push(action.payload);
                }
            )
            .addMatcher(
                doctorApi.endpoints.updateAppointment.matchFulfilled,
                (state, action) => {
                    const index = state.appointments.findIndex(a => a.id === action.payload.id);
                    if (index !== -1) {
                        state.appointments[index] = action.payload;
                    }
                }
            );
    }
});

export const {
    setSelectedAppointment,
    clearSelectedAppointment
} = doctorAppointmentsSlice.actions;

export default doctorAppointmentsSlice.reducer; 