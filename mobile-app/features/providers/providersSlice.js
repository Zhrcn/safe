import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const fetchProviders = createAsyncThunk(
  'providers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/doctors/mobile');
      console.log('Doctors API response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const fetchPharmacists = createAsyncThunk(
  'providers/fetchPharmacists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/pharmacists/mobile');
      console.log('Pharmacists API response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pharmacists:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const providersSlice = createSlice({
  name: 'providers',
  initialState: { list: [], loading: false, error: null, pharmacists: [], loadingPharmacists: false, errorPharmacists: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPharmacists.pending, (state) => {
        state.loadingPharmacists = true;
        state.errorPharmacists = null;
      })
      .addCase(fetchPharmacists.fulfilled, (state, action) => {
        state.loadingPharmacists = false;
        state.pharmacists = action.payload;
        console.log('Pharmacists loaded into state:', action.payload);
      })
      .addCase(fetchPharmacists.rejected, (state, action) => {
        state.loadingPharmacists = false;
        state.errorPharmacists = action.payload;
      });
  },
});

export default providersSlice.reducer;
export { fetchProviders, fetchPharmacists }; 