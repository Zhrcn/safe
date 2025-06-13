import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientApi } from '@/store/services/patient/patientApi';

// Async thunks
export const fetchPatientProfile = createAsyncThunk(
    'patientProfile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await patientApi.endpoints.getProfile.initiate();
            if ('data' in response) {
                return response.data;
            }
            return rejectWithValue(response.error);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAllergy = createAsyncThunk(
    'patientProfile/addAllergy',
    async (allergyData, { rejectWithValue }) => {
        try {
            const response = await patientApi.endpoints.addAllergy.initiate(allergyData);
            if ('data' in response) {
                return response.data;
            }
            return rejectWithValue(response.error);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addChronicCondition = createAsyncThunk(
    'patientProfile/addChronicCondition',
    async (conditionData, { rejectWithValue }) => {
        try {
            const response = await patientApi.endpoints.addChronicCondition.initiate(conditionData);
            if ('data' in response) {
                return response.data;
            }
            return rejectWithValue(response.error);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addMedication = createAsyncThunk(
    'patientProfile/addMedication',
    async (medicationData, { rejectWithValue }) => {
        try {
            const response = await patientApi.endpoints.addMedication.initiate(medicationData);
            if ('data' in response) {
                return response.data;
            }
            return rejectWithValue(response.error);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    profile: null,
    loading: false,
    error: null
};

const patientProfileSlice = createSlice({
    name: 'patientProfile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchPatientProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchPatientProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Allergy
            .addCase(addAllergy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAllergy.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile.allergies = [...state.profile.allergies, action.payload];
                }
            })
            .addCase(addAllergy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Chronic Condition
            .addCase(addChronicCondition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addChronicCondition.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile.chronicConditions = [...state.profile.chronicConditions, action.payload];
                }
            })
            .addCase(addChronicCondition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Medication
            .addCase(addMedication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMedication.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile.medications = [...state.profile.medications, action.payload];
                }
            })
            .addCase(addMedication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfile } = patientProfileSlice.actions;
export default patientProfileSlice.reducer; 