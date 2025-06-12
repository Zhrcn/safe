import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientApi } from '@/store/services/patient/patientApi';

const initialState = {
  profile: null,
  loading: false,
  error: null
};

export const getPatientData = createAsyncThunk(
  'patientProfile/fetchPatientData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(patientApi.endpoints.getPatientProfile.initiate()).unwrap();
      return response.data;
    } catch (error) {
      const message = error.data?.message || error.message || 'Failed to fetch patient data';
      return rejectWithValue(message);
    }
  }
);

const patientProfileSlice = createSlice({
  name: 'patientProfile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
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
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPatientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setProfile,
  setLoading,
  setError,
  clearError,
  updateProfile
} = patientProfileSlice.actions;

// Selectors
export const selectPatientProfile = (state) => state.patientProfile.profile;
export const selectProfileLoading = (state) => state.patientProfile.loading;
export const selectProfileError = (state) => state.patientProfile.error;

export default patientProfileSlice.reducer; 