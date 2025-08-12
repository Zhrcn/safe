import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/store/services/axiosInstance';

export const fetchPrescriptions = createAsyncThunk(
  'pharmacistPrescriptions/fetchPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/prescriptions');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const approvePrescription = createAsyncThunk(
  'pharmacistPrescriptions/approvePrescription',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/prescriptions/${id}`, { status: 'filled' });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const rejectPrescription = createAsyncThunk(
  'pharmacistPrescriptions/rejectPrescription',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/prescriptions/${id}`, { status: 'rejected' });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const prescriptionsSlice = createSlice({
  name: 'pharmacistPrescriptions',
  initialState: {
    prescriptions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPrescriptions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approvePrescription.fulfilled, (state, action) => {
        state.prescriptions = state.prescriptions.map(p =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(rejectPrescription.fulfilled, (state, action) => {
        state.prescriptions = state.prescriptions.map(p =>
          p.id === action.payload.id ? action.payload : p
        );
      });
  },
});

export default prescriptionsSlice.reducer; 