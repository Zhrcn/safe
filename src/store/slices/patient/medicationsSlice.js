import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMedications, addMedication, updateMedication, deleteMedication } from '@/store/services/patient/medicationApi';

export const fetchMedications = createAsyncThunk(
    'medications/fetchMedications',
    async (_, { rejectWithValue }) => {
        try {
            return await getMedications();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createMedication = createAsyncThunk(
    'medications/createMedication',
    async (medicationData, { rejectWithValue }) => {
        try {
            return await addMedication(medicationData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editMedication = createAsyncThunk(
    'medications/editMedication',
    async ({ id, medicationData }, { rejectWithValue }) => {
        try {
            return await updateMedication(id, medicationData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeMedication = createAsyncThunk(
    'medications/removeMedication',
    async (id, { rejectWithValue }) => {
        try {
            await deleteMedication(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const medicationsSlice = createSlice({
    name: 'medications',
    initialState: {
        medications: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
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
                state.error = action.payload;
            })
            .addCase(createMedication.fulfilled, (state, action) => {
                state.medications.push(action.payload);
            })
            .addCase(editMedication.fulfilled, (state, action) => {
                const idx = state.medications.findIndex(m => m.id === action.payload.id);
                if (idx !== -1) state.medications[idx] = action.payload;
            })
            .addCase(removeMedication.fulfilled, (state, action) => {
                state.medications = state.medications.filter(m => m.id !== action.payload);
            });
    },
});

export const { clearError } = medicationsSlice.actions;
export default medicationsSlice.reducer; 