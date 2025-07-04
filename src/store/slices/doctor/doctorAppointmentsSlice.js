import { createSlice } from '@reduxjs/toolkit';
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
    }
});
export const {
    setSelectedAppointment,
    clearSelectedAppointment
} = doctorAppointmentsSlice.actions;
export default doctorAppointmentsSlice.reducer; 