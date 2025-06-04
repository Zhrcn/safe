import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPatientData, updatePatientProfile } from '@/services/patientService';

const initialState = {
  data: null,
  loading: false,
  error: null
};

export const getPatientData = createAsyncThunk(
  'patient/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPatientData();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePatientData = createAsyncThunk(
  'patient/updateData',
  async (updateData, { rejectWithValue }) => {
    try {
      return await updatePatientProfile(updateData);
    } catch (error) {
      return rejectWithValue(error.message);
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
        state.data = action.payload;
      })
      .addCase(getPatientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePatientData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePatientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPatientData } = patientSlice.actions;
export default patientSlice.reducer;
