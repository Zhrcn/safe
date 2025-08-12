import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/patients/medical-records');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default medicalRecordsSlice.reducer; 