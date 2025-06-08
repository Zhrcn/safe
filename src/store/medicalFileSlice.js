// src/store/medicalFileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicalFileApi } from '../lib/redux/services/medicalFileApi';

const initialState = {
  data: null, // Stores the detailed medical file (vitals, appointments, prescriptions, etc.)
  loading: false,
  error: null,
};

// Async thunk to fetch medical file data by ID
export const fetchMedicalFileById = createAsyncThunk(
  'medicalFile/fetchById',
  async (medicalFileId, { dispatch, rejectWithValue }) => {
    if (!medicalFileId) {
      return rejectWithValue('Medical File ID is required to fetch dashboard data.');
    }
    try {
      // The .initiate() call returns an action, and .unwrap() gives a promise that resolves with the action payload or rejects with an error.
      const response = await dispatch(medicalFileApi.endpoints.getMedicalFileById.initiate(medicalFileId)).unwrap();
      
      // Assuming 'response' is the actual data after unwrap. 
      // If medicalFileApi.getMedicalFileById has a transformResponse, it's already applied.
      // If the backend sends { success: true, data: {...} } and there's no transformResponse, 
      // you might need 'return response.data;' here. For now, we assume 'response' is the data.
      return response; 
    } catch (error) {
      // error.data should contain the body of the error response from the server
      // error.message is a generic message
      const message = error.data?.message || error.message || 'Failed to fetch medical file data';
      return rejectWithValue(message);
    }
  }
);

const medicalFileSlice = createSlice({
  name: 'medicalFile',
  initialState,
  reducers: {
    clearMedicalFileData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    // Potentially add other reducers here if needed, e.g., for optimistic updates
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchMedicalFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // payload from rejectWithValue
      });
  },
});

export const { clearMedicalFileData } = medicalFileSlice.actions;
export default medicalFileSlice.reducer;