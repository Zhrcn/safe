import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunks
export const fetchMedications = createAsyncThunk(
    'medications/fetchMedications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/medications');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addMedication = createAsyncThunk(
    'medications/addMedication',
    async (medicationData, { rejectWithValue }) => {
        try {
            const response = await api.post('/medications', medicationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateMedication = createAsyncThunk(
    'medications/updateMedication',
    async ({ id, medicationData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/medications/${id}`, medicationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteMedication = createAsyncThunk(
    'medications/deleteMedication',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/medications/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    medications: [],
    loading: false,
    error: null,
};

const medicationsSlice = createSlice({
    name: 'medications',
    initialState,
    reducers: {
        clearMedicationsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch medications
            .addCase(fetchMedications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedications.fulfilled, (state, action) => {
                state.loading = false;
                state.medications = action.payload;
            })
            .addCase(fetchMedications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch medications';
            })
            // Add medication
            .addCase(addMedication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMedication.fulfilled, (state, action) => {
                state.loading = false;
                state.medications.push(action.payload);
            })
            .addCase(addMedication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add medication';
            })
            // Update medication
            .addCase(updateMedication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMedication.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.medications.findIndex(med => med.id === action.payload.id);
                if (index !== -1) {
                    state.medications[index] = action.payload;
                }
            })
            .addCase(updateMedication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update medication';
            })
            // Delete medication
            .addCase(deleteMedication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMedication.fulfilled, (state, action) => {
                state.loading = false;
                state.medications = state.medications.filter(med => med.id !== action.payload);
            })
            .addCase(deleteMedication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete medication';
            });
    },
});

export const { clearMedicationsError } = medicationsSlice.actions;
export default medicationsSlice.reducer; 