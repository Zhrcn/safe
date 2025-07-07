import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMedicalRecords, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '@/store/services/patient/medicalRecordApi';

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

export const createMedicalRecord = createAsyncThunk(
  'medicalRecords/createMedicalRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      return await addMedicalRecord(recordData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editMedicalRecord = createAsyncThunk(
  'medicalRecords/editMedicalRecord',
  async ({ id, recordData }, { rejectWithValue }) => {
    try {
      return await updateMedicalRecord(id, recordData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeMedicalRecord = createAsyncThunk(
  'medicalRecords/removeMedicalRecord',
  async (id, { rejectWithValue }) => {
    try {
      await deleteMedicalRecord(id);
      return id;
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
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.medicalRecords.push(action.payload);
      })
      .addCase(editMedicalRecord.fulfilled, (state, action) => {
        const idx = state.medicalRecords.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.medicalRecords[idx] = action.payload;
      })
      .addCase(removeMedicalRecord.fulfilled, (state, action) => {
        state.medicalRecords = state.medicalRecords.filter(r => r.id !== action.payload);
      });
  },
});

export const { clearError } = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer; 