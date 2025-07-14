import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMedicalRecords } from '@/store/services/patient/medicalRecordApi';

export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchMedicalRecords',
  async (_, { rejectWithValue }) => {
    try {
      return await getMedicalRecords();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState: {
    medicalRecords: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalRecords = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer; 