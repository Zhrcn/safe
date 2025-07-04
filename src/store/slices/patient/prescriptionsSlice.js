import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPrescriptions, addPrescription, updatePrescription, deletePrescription } from '@/store/services/patient/prescriptionApi';
import { fetchPrescriptionsService } from '@/services/prescriptionService';

export const fetchPrescriptions = createAsyncThunk(
    'prescriptions/fetchPrescriptions',
    async (_, thunkAPI) => {
        try {
            const response = await fetchPrescriptionsService();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createNewPrescription = createAsyncThunk(
    'prescriptions/createNewPrescription',
    async (prescriptionData, { rejectWithValue }) => {
        try {
            return await addPrescription(prescriptionData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editPrescription = createAsyncThunk(
    'prescriptions/editPrescription',
    async ({ id, prescriptionData }, { rejectWithValue }) => {
        try {
            return await updatePrescription(id, prescriptionData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removePrescription = createAsyncThunk(
    'prescriptions/removePrescription',
    async (id, { rejectWithValue }) => {
        try {
            await deletePrescription(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const prescriptionsSlice = createSlice({
    name: 'prescriptions',
    initialState: {
        prescriptions: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
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
            })
            .addCase(fetchPrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createNewPrescription.fulfilled, (state, action) => {
                state.prescriptions.push(action.payload);
            })
            .addCase(editPrescription.fulfilled, (state, action) => {
                const idx = state.prescriptions.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.prescriptions[idx] = action.payload;
            })
            .addCase(removePrescription.fulfilled, (state, action) => {
                state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
            });
    },
});

export const { clearError } = prescriptionsSlice.actions;
export default prescriptionsSlice.reducer; 