import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { prescriptionsApi } from '../../services/doctor/prescriptionsApi';

// Async thunks
export const fetchPrescriptions = createAsyncThunk(
    'doctorPrescriptions/fetchPrescriptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.getPrescriptions();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPrescriptionDetails = createAsyncThunk(
    'doctorPrescriptions/fetchPrescriptionDetails',
    async (prescriptionId, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.getPrescriptionDetails(prescriptionId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createPrescription = createAsyncThunk(
    'doctorPrescriptions/createPrescription',
    async (prescriptionData, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.createPrescription(prescriptionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updatePrescription = createAsyncThunk(
    'doctorPrescriptions/updatePrescription',
    async ({ prescriptionId, prescriptionData }, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.updatePrescription(prescriptionId, prescriptionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addPrescriptionMedication = createAsyncThunk(
    'doctorPrescriptions/addMedication',
    async ({ prescriptionId, medication }, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.addMedication(prescriptionId, medication);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removePrescriptionMedication = createAsyncThunk(
    'doctorPrescriptions/removeMedication',
    async ({ prescriptionId, medicationId }, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.removeMedication(prescriptionId, medicationId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const renewPrescription = createAsyncThunk(
    'doctorPrescriptions/renewPrescription',
    async ({ prescriptionId, renewalData }, { rejectWithValue }) => {
        try {
            const response = await prescriptionsApi.renewPrescription(prescriptionId, renewalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    prescriptions: [],
    selectedPrescription: null,
    loading: false,
    error: null,
    success: false
};

const doctorPrescriptionsSlice = createSlice({
    name: 'doctorPrescriptions',
    initialState,
    reducers: {
        clearPrescriptions: (state) => {
            state.prescriptions = [];
            state.selectedPrescription = null;
            state.error = null;
            state.success = false;
        },
        clearSelectedPrescription: (state) => {
            state.selectedPrescription = null;
        },
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Prescriptions
            .addCase(fetchPrescriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrescriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions = action.payload;
                state.success = true;
            })
            .addCase(fetchPrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Prescription Details
            .addCase(fetchPrescriptionDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrescriptionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPrescription = action.payload;
                state.success = true;
            })
            .addCase(fetchPrescriptionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Prescription
            .addCase(createPrescription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPrescription.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions.push(action.payload);
                state.success = true;
            })
            .addCase(createPrescription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Prescription
            .addCase(updatePrescription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePrescription.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.prescriptions.findIndex(pres => pres.id === action.payload.id);
                if (index !== -1) {
                    state.prescriptions[index] = action.payload;
                }
                if (state.selectedPrescription?.id === action.payload.id) {
                    state.selectedPrescription = action.payload;
                }
                state.success = true;
            })
            .addCase(updatePrescription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Medication
            .addCase(addPrescriptionMedication.fulfilled, (state, action) => {
                if (state.selectedPrescription) {
                    state.selectedPrescription.medications.push(action.payload);
                }
            })
            // Remove Medication
            .addCase(removePrescriptionMedication.fulfilled, (state, action) => {
                if (state.selectedPrescription) {
                    state.selectedPrescription.medications = state.selectedPrescription.medications.filter(
                        med => med.id !== action.payload.medicationId
                    );
                }
            })
            // Renew Prescription
            .addCase(renewPrescription.fulfilled, (state, action) => {
                const index = state.prescriptions.findIndex(pres => pres.id === action.payload.id);
                if (index !== -1) {
                    state.prescriptions[index] = action.payload;
                }
                if (state.selectedPrescription?.id === action.payload.id) {
                    state.selectedPrescription = action.payload;
                }
            });
    }
});

export const { clearPrescriptions, clearSelectedPrescription, resetStatus } = doctorPrescriptionsSlice.actions;
export default doctorPrescriptionsSlice.reducer; 