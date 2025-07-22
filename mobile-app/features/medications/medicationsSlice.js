import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMedications = createAsyncThunk(
  'medications/fetchMedications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/patients/medications');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addMedication = createAsyncThunk(
  'medications/addMedication',
  async (medicationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/patients/medications', medicationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const editMedication = createAsyncThunk(
  'medications/editMedication',
  async ({ id, medicationData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/patients/medications/${id}`, medicationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeMedication = createAsyncThunk(
  'medications/removeMedication',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/patients/medications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateReminders = createAsyncThunk(
  'medications/updateReminders',
  async ({ id, reminderData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/patients/medications/${id}/reminders`, reminderData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const requestRefill = createAsyncThunk(
  'medications/requestRefill',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/patients/medications/${id}/refill`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editMedication.fulfilled, (state, action) => {
        const idx = state.items.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeMedication.fulfilled, (state, action) => {
        state.items = state.items.filter(m => m._id !== action.payload);
      })
      .addCase(updateReminders.fulfilled, (state, action) => {
        const idx = state.items.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(requestRefill.fulfilled, (state, action) => {
        const idx = state.items.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearError } = medicationsSlice.actions;
export default medicationsSlice.reducer; 