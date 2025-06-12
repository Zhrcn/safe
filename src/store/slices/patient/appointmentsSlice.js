import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentApi } from '@/store/services/patient/appointmentApi';

const initialState = {
    appointments: [],
    loading: false,
    error: null,
};

export const fetchAppointments = createAsyncThunk(
    'appointments/fetchAppointments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await appointmentApi.getAppointments();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createAppointment = createAsyncThunk(
    'appointments/createAppointment',
    async (appointmentData, { rejectWithValue }) => {
        try {
            const response = await appointmentApi.createAppointment(appointmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAppointment = createAsyncThunk(
    'appointments/updateAppointment',
    async ({ id, appointmentData }, { rejectWithValue }) => {
        try {
            const response = await appointmentApi.updateAppointment(id, appointmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteAppointment = createAsyncThunk(
    'appointments/deleteAppointment',
    async (id, { rejectWithValue }) => {
        try {
            await appointmentApi.deleteAppointment(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch appointments
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create appointment
            .addCase(createAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments.push(action.payload);
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update appointment
            .addCase(updateAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAppointment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.appointments.findIndex(
                    (appointment) => appointment.id === action.payload.id
                );
                if (index !== -1) {
                    state.appointments[index] = action.payload;
                }
            })
            .addCase(updateAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete appointment
            .addCase(deleteAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = state.appointments.filter(
                    (appointment) => appointment.id !== action.payload
                );
            })
            .addCase(deleteAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer; 