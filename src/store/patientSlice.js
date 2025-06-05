import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { medicalFilesApi } from '../lib/services/api'; // Assuming api.js is in src/lib/services/
import { getMedicalFileById } from '../lib/api/medicalFile'; // Import the new function

const initialState = {
  vitalSigns: [],
  vitalSignsLoading: false,
  vitalSignsError: null,
  data: null,
  loading: false,
  error: null
};

export const getPatientData = createAsyncThunk(
  'patient/fetchData',
  async (patientId, { rejectWithValue }) => {
    if (!patientId) return rejectWithValue('Patient ID is required to fetch data.');
    try {
      const response = await medicalFilesApi.getPatientFile(patientId);
      return response.data; // Assuming API returns { data: patientProfile }
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const updatePatientData = createAsyncThunk(
  'patient/updateData',
  async ({ patientId, data }, { rejectWithValue }) => { // Expects an object { patientId, data }
    if (!patientId) return rejectWithValue('Patient ID is required to update data.');
    try {
      const response = await medicalFilesApi.updateMedicalFile(data, patientId);
      return response.data; // Assuming API returns { data: updatedPatientProfile }
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchVitalSignsByMedicalFileId = createAsyncThunk(
  'patient/fetchVitalSigns',
  async (medicalFileId, { rejectWithValue }) => {
    if (!medicalFileId) return rejectWithValue('Medical File ID is required to fetch vital signs.');
    try {
      const medicalFile = await getMedicalFileById(medicalFileId);
      // Assuming medicalFile contains a vitalSigns array directly
      // If it's nested like medicalFile.data.vitalSigns, adjust here
      return medicalFile.vitalSigns || []; 
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
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
      })
      // Reducers for fetchVitalSignsByMedicalFileId
      .addCase(fetchVitalSignsByMedicalFileId.pending, (state) => {
        state.vitalSignsLoading = true;
        state.vitalSignsError = null;
      })
      .addCase(fetchVitalSignsByMedicalFileId.fulfilled, (state, action) => {
        state.vitalSignsLoading = false;
        state.vitalSigns = action.payload;
      })
      .addCase(fetchVitalSignsByMedicalFileId.rejected, (state, action) => {
        state.vitalSignsLoading = false;
        state.vitalSignsError = action.payload;
        state.vitalSigns = []; // Optionally clear or keep stale data
      });
  }
});

export const { clearPatientData, setFetchedPatientData } = patientSlice.actions;
export default patientSlice.reducer;
