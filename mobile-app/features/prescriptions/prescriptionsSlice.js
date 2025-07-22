import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/patients/prescriptions');
      console.log('Prescriptions API response:', response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default prescriptionsSlice.reducer; 