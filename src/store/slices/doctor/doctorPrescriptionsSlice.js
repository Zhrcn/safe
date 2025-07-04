import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription as createPrescriptionApi,
  updatePrescription as updatePrescriptionApi,
  addMedication,
  removeMedication,
  renewPrescription
} from '../../services/doctor/prescriptionsApi';

export const fetchPrescriptions = createAsyncThunk(
    'doctorPrescriptions/fetchPrescriptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPrescriptions();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const fetchPrescriptionDetails = createAsyncThunk(
    'doctorPrescriptions/fetchPrescriptionDetails',
    async (prescriptionId, { rejectWithValue }) => {
        try {
            const response = await getPrescriptionById(prescriptionId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const createPrescription = createAsyncThunk(
    'doctorPrescriptions/createPrescription',
    async (prescriptionData, { rejectWithValue }) => {
        try {
            const response = await createPrescriptionApi(prescriptionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updatePrescription = createAsyncThunk(
    'doctorPrescriptions/updatePrescription',
    async ({ prescriptionId, prescriptionData }, { rejectWithValue }) => {
        try {
            const response = await updatePrescriptionApi(prescriptionId, prescriptionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const addPrescriptionMedication = createAsyncThunk(
    'doctorPrescriptions/addMedication',
    async ({ prescriptionId, medication }, { rejectWithValue }) => {
        try {
            const response = await addMedication(prescriptionId, medication);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const removePrescriptionMedication = createAsyncThunk(
    'doctorPrescriptions/removeMedication',
    async ({ prescriptionId, medicationId }, { rejectWithValue }) => {
        try {
            const response = await removeMedication(prescriptionId, medicationId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const renewPrescriptionThunk = createAsyncThunk(
    'doctorPrescriptions/renewPrescription',
    async ({ prescriptionId, renewalData }, { rejectWithValue }) => {
        try {
            const response = await renewPrescription(prescriptionId, renewalData);
            return response;
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
            .addCase(addPrescriptionMedication.fulfilled, (state, action) => {
                if (state.selectedPrescription) {
                    state.selectedPrescription.medications.push(action.payload);
                }
            })
            .addCase(removePrescriptionMedication.fulfilled, (state, action) => {
                if (state.selectedPrescription) {
                    state.selectedPrescription.medications = state.selectedPrescription.medications.filter(
                        med => med.id !== action.payload.medicationId
                    );
                }
            })
            .addCase(renewPrescriptionThunk.fulfilled, (state, action) => {
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