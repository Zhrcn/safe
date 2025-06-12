import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleApi } from '../../services/doctor/scheduleApi';

// Async thunks
export const fetchSchedule = createAsyncThunk(
    'doctorSchedule/fetchSchedule',
    async (date, { rejectWithValue }) => {
        try {
            const response = await scheduleApi.getSchedule(date);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAvailability = createAsyncThunk(
    'doctorSchedule/updateAvailability',
    async (availabilityData, { rejectWithValue }) => {
        try {
            const response = await scheduleApi.updateAvailability(availabilityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addAppointment = createAsyncThunk(
    'doctorSchedule/addAppointment',
    async (appointmentData, { rejectWithValue }) => {
        try {
            const response = await scheduleApi.addAppointment(appointmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAppointment = createAsyncThunk(
    'doctorSchedule/updateAppointment',
    async ({ appointmentId, appointmentData }, { rejectWithValue }) => {
        try {
            const response = await scheduleApi.updateAppointment(appointmentId, appointmentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteAppointment = createAsyncThunk(
    'doctorSchedule/deleteAppointment',
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await scheduleApi.deleteAppointment(appointmentId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    schedule: [],
    availability: [],
    loading: false,
    error: null,
    success: false
};

const doctorScheduleSlice = createSlice({
    name: 'doctorSchedule',
    initialState,
    reducers: {
        clearSchedule: (state) => {
            state.schedule = [];
            state.availability = [];
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
            // Fetch Schedule
            .addCase(fetchSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.schedule = action.payload.schedule;
                state.availability = action.payload.availability;
                state.success = true;
            })
            .addCase(fetchSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Availability
            .addCase(updateAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAvailability.fulfilled, (state, action) => {
                state.loading = false;
                state.availability = action.payload;
                state.success = true;
            })
            .addCase(updateAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Appointment
            .addCase(addAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.schedule.push(action.payload);
                state.success = true;
            })
            .addCase(addAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Appointment
            .addCase(updateAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAppointment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.schedule.findIndex(app => app.id === action.payload.id);
                if (index !== -1) {
                    state.schedule[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Appointment
            .addCase(deleteAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.schedule = state.schedule.filter(app => app.id !== action.payload.id);
                state.success = true;
            })
            .addCase(deleteAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSchedule, resetStatus } = doctorScheduleSlice.actions;
export default doctorScheduleSlice.reducer; 