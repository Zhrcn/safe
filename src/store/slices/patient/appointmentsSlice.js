import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAppointments, createAppointment as addAppointment, updateAppointment, deleteAppointment } from '@/store/services/patient/appointmentApi';

export const fetchAppointments = createAsyncThunk(
    'appointments/fetchAppointments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAppointments();
            if (Array.isArray(response)) return response;
            if (response && Array.isArray(response.data)) return response.data;
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createAppointment = createAsyncThunk(
    'appointments/createAppointment',
    async (appointmentData, { rejectWithValue }) => {
        try {
            return await addAppointment(appointmentData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editAppointment = createAsyncThunk(
    'appointments/editAppointment',
    async ({ id, appointmentData }, { rejectWithValue }) => {
        try {
            return await updateAppointment(id, appointmentData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeAppointment = createAsyncThunk(
    'appointments/removeAppointment',
    async (id, { rejectWithValue }) => {
        try {
            await deleteAppointment(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = (action.payload || []).map(app => ({
                    ...app,
                    id: app.id || app._id
                }));
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.appointments.push(action.payload);
            })
            .addCase(editAppointment.fulfilled, (state, action) => {
                const idx = state.appointments.findIndex(a => a.id === action.payload.id);
                if (idx !== -1) state.appointments[idx] = action.payload;
            })
            .addCase(removeAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.filter(a => a.id !== action.payload);
            });
    },
});

export const { clearError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer; 