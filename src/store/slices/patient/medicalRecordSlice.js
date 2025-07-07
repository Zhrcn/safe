import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as medicalRecordApi from '@/store/services/patient/medicalRecordApi';

// Async thunks
export const fetchMedicalRecords = createAsyncThunk(
    'medicalRecord/fetchMedicalRecords',
    async (_, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.getMedicalRecords();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addVitalSigns = createAsyncThunk(
    'medicalRecord/addVitalSigns',
    async (vitalSignsData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addVitalSigns(vitalSignsData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addAllergy = createAsyncThunk(
    'medicalRecord/addAllergy',
    async (allergyData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addAllergy(allergyData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addChronicCondition = createAsyncThunk(
    'medicalRecord/addChronicCondition',
    async (conditionData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addChronicCondition(conditionData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addDiagnosis = createAsyncThunk(
    'medicalRecord/addDiagnosis',
    async (diagnosisData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addDiagnosis(diagnosisData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addLabResult = createAsyncThunk(
    'medicalRecord/addLabResult',
    async (labResultData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addLabResult(labResultData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addImagingReport = createAsyncThunk(
    'medicalRecord/addImagingReport',
    async (imagingData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addImagingReport(imagingData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addMedication = createAsyncThunk(
    'medicalRecord/addMedication',
    async (medicationData, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.addMedication(medicationData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateRecordItem = createAsyncThunk(
    'medicalRecord/updateRecordItem',
    async ({ category, itemId, updateData }, { rejectWithValue }) => {
        try {
            return await medicalRecordApi.updateRecordItem(category, itemId, updateData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteRecordItem = createAsyncThunk(
    'medicalRecord/deleteRecordItem',
    async ({ category, itemId }, { rejectWithValue }) => {
        try {
            await medicalRecordApi.deleteRecordItem(category, itemId);
            return { category, itemId };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    medicalRecords: null,
    loading: false,
    error: null,
};

const medicalRecordSlice = createSlice({
    name: 'medicalRecord',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMedicalRecords: (state) => {
            state.medicalRecords = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch medical records
            .addCase(fetchMedicalRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.medicalRecords = action.payload;
            })
            .addCase(fetchMedicalRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add vital signs
            .addCase(addVitalSigns.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.vitalSigns.push(action.payload);
                }
            })
            // Add allergy
            .addCase(addAllergy.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.allergies.push(action.payload);
                }
            })
            // Add chronic condition
            .addCase(addChronicCondition.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.chronicConditions.push(action.payload);
                }
            })
            // Add diagnosis
            .addCase(addDiagnosis.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.diagnoses.push(action.payload);
                }
            })
            // Add lab result
            .addCase(addLabResult.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.labResults.push(action.payload);
                }
            })
            // Add imaging report
            .addCase(addImagingReport.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.imagingReports.push(action.payload);
                }
            })
            // Add medication
            .addCase(addMedication.fulfilled, (state, action) => {
                if (state.medicalRecords) {
                    state.medicalRecords.medications.push(action.payload);
                }
            })
            // Update record item
            .addCase(updateRecordItem.fulfilled, (state, action) => {
                // Handle update logic here if needed
                // For now, we'll refetch the data
            })
            // Delete record item
            .addCase(deleteRecordItem.fulfilled, (state, action) => {
                const { category, itemId } = action.payload;
                if (state.medicalRecords && state.medicalRecords[category]) {
                    state.medicalRecords[category] = state.medicalRecords[category].filter(
                        item => item._id !== itemId
                    );
                }
            });
    },
});

export const { clearError, clearMedicalRecords } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer; 