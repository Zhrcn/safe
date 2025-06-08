import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// No longer importing medicalFilesApi
import { patientApi } from '../lib/redux/services/patientApi'; // Import the new patientApi

const initialState = {
  data: null, // This will store the patient profile data
  vitalSigns: [], // Initialize vitalSigns
  loading: false,
  error: null
};

// Fetches the logged-in patient's own profile data
export const getPatientData = createAsyncThunk(
  'patient/fetchData',
  async (_, { dispatch, rejectWithValue }) => { // No patientId needed as argument
    try {
      // Dispatch the RTK Query endpoint for getting patient profile
      const response = await dispatch(patientApi.endpoints.getPatientProfile.initiate()).unwrap();
      // Assuming the backend ApiResponse wraps the actual data in a 'data' field
      return response.data; 
    } catch (error) {
      const message = error.data?.message || error.message || 'Failed to fetch patient profile';
      return rejectWithValue(message);
    }
  }
);

// Updates the logged-in patient's own profile data
export const updatePatientData = createAsyncThunk(
  'patient/updateData',
  async (profileData, { dispatch, rejectWithValue }) => { // Takes profileData directly
    try {
      // Dispatch the RTK Query endpoint for updating patient profile
      const response = await dispatch(patientApi.endpoints.updatePatientProfile.initiate(profileData)).unwrap();
      // Assuming the backend ApiResponse wraps the actual data in a 'data' field
      return response.data;
    } catch (error) {
      const message = error.data?.message || error.message || 'Failed to update patient profile';
      return rejectWithValue(message);
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearPatientData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    // setFetchedPatientData might still be useful if you want to manually set data elsewhere
    setFetchedPatientData: (state, action) => { 
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatientData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // action.payload is the ActualPatientData from the thunk
        state.vitalSigns = action.payload?.healthMetrics?.vitalSignsHistory || 
                           action.payload?.vitalSigns || 
                           [];
        state.error = null; // Clear error on successful fetch
      })
      .addCase(getPatientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePatientData.pending, (state) => {
        state.loading = true; // Or a specific 'updating' state: state.updating = true;
        state.error = null;
      })
      .addCase(updatePatientData.fulfilled, (state, action) => {
        state.loading = false; // state.updating = false;
        state.data = action.payload; // action.payload is the ActualPatientData (updated) from the thunk
        state.vitalSigns = action.payload?.healthMetrics?.vitalSignsHistory || 
                           action.payload?.vitalSigns || 
                           state.vitalSigns; // Fallback to existing vital signs
        state.error = null; // Clear error on successful update
      })
      .addCase(updatePatientData.rejected, (state, action) => {
        state.loading = false; // state.updating = false;
        state.error = action.payload;
      });
  }
});

export const { clearPatientData, setFetchedPatientData } = patientSlice.actions;
export default patientSlice.reducer;
