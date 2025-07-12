import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/doctor/dashboardApi';

// Fetch comprehensive analytics
export const fetchComprehensiveAnalytics = createAsyncThunk(
  'dashboardAnalytics/fetchComprehensiveAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getComprehensiveAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comprehensive analytics');
    }
  }
);

// Fetch dashboard analytics
export const fetchDashboardAnalytics = createAsyncThunk(
  'dashboardAnalytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getDashboardAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// Fetch appointments analytics for charts
export const fetchAppointmentsAnalytics = createAsyncThunk(
  'dashboardAnalytics/fetchAppointmentsAnalytics',
  async (period = 'week', { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getAppointmentsAnalytics(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments analytics');
    }
  }
);

// Fetch patient distribution
export const fetchPatientDistribution = createAsyncThunk(
  'dashboardAnalytics/fetchPatientDistribution',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getPatientDistribution();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient distribution');
    }
  }
);

// Fetch recent appointments
export const fetchRecentAppointments = createAsyncThunk(
  'dashboardAnalytics/fetchRecentAppointments',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getRecentAppointments(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent appointments');
    }
  }
);

// Fetch appointments by date
export const fetchAppointmentsByDate = createAsyncThunk(
  'dashboardAnalytics/fetchAppointmentsByDate',
  async (date, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getAppointmentsByDate(date);
      return { date, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments by date');
    }
  }
);

const initialState = {
  // Comprehensive analytics data
  comprehensiveAnalytics: {
    totalPatients: 0,
    newPatientsThisMonth: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: 0,
    prescriptionsIssued: 0,
    appointmentTrends: { labels: [], data: [] },
    patientDistribution: { labels: [], data: [] },
    topConditions: [],
    prescriptionTrends: { labels: [], data: [] },
    appointmentTypeDistribution: { labels: [], data: [] },
    avgAppointmentDuration: 0,
    avgPatientAge: 0,
    genderAgeDistribution: { labels: [], data: [] },
    noShowRate: 0,
    busiestDay: '',
    busiestHour: '',
    recentPatients: []
  },
  // Dashboard analytics data
  analytics: {
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    revenue: 0,
    averageRating: 0
  },
  appointmentsChart: {
    labels: [],
    data: []
  },
  patientDistribution: {
    labels: [],
    data: []
  },
  recentAppointments: [],
  appointmentsByDate: {},
  loading: false,
  error: null
};

const dashboardAnalyticsSlice = createSlice({
  name: 'dashboardAnalytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAppointmentsByDate: (state) => {
      state.appointmentsByDate = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Comprehensive Analytics
      .addCase(fetchComprehensiveAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprehensiveAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.comprehensiveAnalytics = action.payload;
        state.error = null;
      })
      .addCase(fetchComprehensiveAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Dashboard Analytics
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Appointments Analytics
      .addCase(fetchAppointmentsAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentsChart = action.payload;
        state.error = null;
      })
      .addCase(fetchAppointmentsAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Patient Distribution
      .addCase(fetchPatientDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDistribution = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Recent Appointments
      .addCase(fetchRecentAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.recentAppointments = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Appointments by Date
      .addCase(fetchAppointmentsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentsByDate[action.payload.date] = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAppointmentsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearAppointmentsByDate } = dashboardAnalyticsSlice.actions;
export default dashboardAnalyticsSlice.reducer; 