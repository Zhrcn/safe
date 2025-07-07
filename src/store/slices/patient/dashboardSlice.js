import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardApi from '@/store/services/patient/dashboardApi';

export const fetchDashboardSummary = createAsyncThunk('dashboard/fetchSummary', dashboardApi.getDashboardSummary);
export const fetchUpcomingAppointments = createAsyncThunk('dashboard/fetchUpcomingAppointments', dashboardApi.getUpcomingAppointments);
export const fetchActiveMedications = createAsyncThunk('dashboard/fetchActiveMedications', dashboardApi.getActiveMedications);
export const fetchMedicalFile = createAsyncThunk('dashboard/fetchMedicalFile', dashboardApi.getMedicalFile);
export const fetchRecentLabResults = createAsyncThunk('dashboard/fetchRecentLabResults', dashboardApi.getRecentLabResults);
export const fetchVitalSigns = createAsyncThunk('dashboard/fetchVitalSigns', dashboardApi.getVitalSigns);
export const fetchChronicConditions = createAsyncThunk('dashboard/fetchChronicConditions', dashboardApi.getChronicConditions);
export const fetchAllergies = createAsyncThunk('dashboard/fetchAllergies', dashboardApi.getAllergies);
export const fetchRecentMessages = createAsyncThunk('dashboard/fetchRecentMessages', dashboardApi.getRecentMessages);
export const fetchRecentConsultations = createAsyncThunk('dashboard/fetchRecentConsultations', dashboardApi.getRecentConsultations);

const initialState = {
  summary: null,
  upcomingAppointments: [],
  activeMedications: [],
  medicalFile: null,
  recentLabResults: [],
  vitalSigns: null,
  chronicConditions: [],
  allergies: [],
  recentMessages: [],
  recentConsultations: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };
    builder.addCase(fetchDashboardSummary.pending, handlePending);
    builder.addCase(fetchDashboardSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    });
    builder.addCase(fetchDashboardSummary.rejected, handleRejected);
    builder.addCase(fetchUpcomingAppointments.pending, handlePending);
    builder.addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.upcomingAppointments = action.payload;
    });
    builder.addCase(fetchUpcomingAppointments.rejected, handleRejected);
    builder.addCase(fetchActiveMedications.pending, handlePending);
    builder.addCase(fetchActiveMedications.fulfilled, (state, action) => {
      state.loading = false;
      state.activeMedications = action.payload;
    });
    builder.addCase(fetchActiveMedications.rejected, handleRejected);
    builder.addCase(fetchMedicalFile.pending, handlePending);
    builder.addCase(fetchMedicalFile.fulfilled, (state, action) => {
      state.loading = false;
      state.medicalFile = action.payload;
    });
    builder.addCase(fetchMedicalFile.rejected, handleRejected);
    builder.addCase(fetchRecentLabResults.pending, handlePending);
    builder.addCase(fetchRecentLabResults.fulfilled, (state, action) => {
      state.loading = false;
      state.recentLabResults = action.payload;
    });
    builder.addCase(fetchRecentLabResults.rejected, handleRejected);
    builder.addCase(fetchVitalSigns.pending, handlePending);
    builder.addCase(fetchVitalSigns.fulfilled, (state, action) => {
      state.loading = false;
      state.vitalSigns = action.payload;
    });
    builder.addCase(fetchVitalSigns.rejected, handleRejected);
    builder.addCase(fetchChronicConditions.pending, handlePending);
    builder.addCase(fetchChronicConditions.fulfilled, (state, action) => {
      state.loading = false;
      state.chronicConditions = action.payload;
    });
    builder.addCase(fetchChronicConditions.rejected, handleRejected);
    builder.addCase(fetchAllergies.pending, handlePending);
    builder.addCase(fetchAllergies.fulfilled, (state, action) => {
      state.loading = false;
      state.allergies = action.payload;
    });
    builder.addCase(fetchAllergies.rejected, handleRejected);
    builder.addCase(fetchRecentMessages.pending, handlePending);
    builder.addCase(fetchRecentMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.recentMessages = action.payload;
    });
    builder.addCase(fetchRecentMessages.rejected, handleRejected);
    builder.addCase(fetchRecentConsultations.pending, handlePending);
    builder.addCase(fetchRecentConsultations.fulfilled, (state, action) => {
      state.loading = false;
      state.recentConsultations = action.payload;
    });
    builder.addCase(fetchRecentConsultations.rejected, handleRejected);
  },
});

export default dashboardSlice.reducer;