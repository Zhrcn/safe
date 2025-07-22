import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as patientsApi from '../../services/doctor/patientsApi';
import { API_BASE_URL } from '@/config/api';

const transformImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) {
    const fullUrl = `${API_BASE_URL}${imageUrl}`;
    console.log('Transforming patient image URL:', { original: imageUrl, transformed: fullUrl });
    return fullUrl;
  }
  console.log('Patient image URL not transformed:', imageUrl);
  return imageUrl;
};

const transformPatientData = (patient) => {
  if (!patient) return patient;
  return {
    ...patient,
    profileImage: transformImageUrl(patient.profileImage),
    user: patient.user ? {
      ...patient.user,
      profileImage: transformImageUrl(patient.user.profileImage),
      profilePicture: transformImageUrl(patient.user.profilePicture)
    } : patient.user
  };
};

export const fetchPatients = createAsyncThunk(
  'doctorPatients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching patients from API...');
      const data = await patientsApi.getPatients();
      console.log('Patients fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch patients'
      );
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'doctorPatients/fetchPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await patientsApi.getPatientById(id);
      return data;
    } catch (error) {
      console.error('Error fetching patient by ID:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch patient'
      );
    }
  }
);

export const addPatientById = createAsyncThunk(
  'doctorPatients/addPatientById',
  async (patientId, { rejectWithValue }) => {
    try {
      const data = await patientsApi.addPatientById(patientId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to add patient'
      );
    }
  }
);

const initialState = {
    patients: [],
    selectedPatient: null,
    favorites: [],
    loading: false,
    error: null
};

const doctorPatientsSlice = createSlice({
    name: 'doctorPatients',
    initialState,
    reducers: {
        setSelectedPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
        addPatientToFavorites: (state, action) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removePatientFromFavorites: (state, action) => {
            state.favorites = state.favorites.filter(id => id !== action.payload);
        },
        clearSelectedPatient: (state) => {
            state.selectedPatient = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log('Fetching patients - loading started');
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = Array.isArray(action.payload) 
                    ? action.payload.map(transformPatientData)
                    : action.payload;
                state.error = null;
                console.log('Fetching patients - success:', action.payload);
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log('Fetching patients - failed:', action.payload);
            })
            .addCase(fetchPatientById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPatient = transformPatientData(action.payload);
                state.error = null;
            })
            .addCase(fetchPatientById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPatientById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPatientById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addPatientById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    setSelectedPatient,
    addPatientToFavorites,
    removePatientFromFavorites,
    clearSelectedPatient,
    clearError
} = doctorPatientsSlice.actions;

export default doctorPatientsSlice.reducer; 