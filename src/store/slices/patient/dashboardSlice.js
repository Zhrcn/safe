import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUpcomingAppointments = createAsyncThunk(
    'dashboard/fetchUpcomingAppointments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/appointments');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchRecentMedications = createAsyncThunk(
    'dashboard/fetchRecentMedications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/medications');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    summary: null,
    upcomingAppointments: [],
    recentMedications: [],
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch dashboard data
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch dashboard data';
            })
            // Fetch upcoming appointments
            .addCase(fetchUpcomingAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.upcomingAppointments = action.payload;
            })
            .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch upcoming appointments';
            })
            // Fetch recent medications
            .addCase(fetchRecentMedications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentMedications.fulfilled, (state, action) => {
                state.loading = false;
                state.recentMedications = action.payload;
            })
            .addCase(fetchRecentMedications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch recent medications';
            });
    },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 