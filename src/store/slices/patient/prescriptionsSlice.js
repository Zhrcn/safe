import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPrescriptions, addPrescription, updatePrescription, deletePrescription } from '@/store/services/patient/prescriptionApi';
import { fetchPrescriptionsService } from '@/services/prescriptionService';
import { getSocket } from '@/utils/socket';

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
        addPrescriptionRealTime: (state, action) => {
            const newPrescription = action.payload;
            if (!Array.isArray(state.prescriptions)) {
                state.prescriptions = [];
            }
            const existingIndex = state.prescriptions.findIndex(p => p.id === newPrescription.prescriptionId);
            if (existingIndex === -1) {
                state.prescriptions.unshift(newPrescription.prescription);
            }
        },
        updatePrescriptionRealTime: (state, action) => {
            const updatedPrescription = action.payload;
            if (!Array.isArray(state.prescriptions)) {
                state.prescriptions = [];
            }
            const index = state.prescriptions.findIndex(p => p.id === updatedPrescription.prescriptionId);
            if (index !== -1) {
                state.prescriptions[index] = updatedPrescription.prescription;
            }
        },
        dispensePrescriptionRealTime: (state, action) => {
            const dispensedPrescription = action.payload;
            if (!Array.isArray(state.prescriptions)) {
                state.prescriptions = [];
            }
            const index = state.prescriptions.findIndex(p => p.id === dispensedPrescription.prescriptionId);
            if (index !== -1) {
                state.prescriptions[index] = dispensedPrescription.prescription;
            }
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
                state.prescriptions = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
            })
            .addCase(fetchPrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createNewPrescription.fulfilled, (state, action) => {
                if (!Array.isArray(state.prescriptions)) {
                    state.prescriptions = [];
                }
                state.prescriptions.push(action.payload);
            })
            .addCase(editPrescription.fulfilled, (state, action) => {
                if (!Array.isArray(state.prescriptions)) {
                    state.prescriptions = [];
                }
                const idx = state.prescriptions.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.prescriptions[idx] = action.payload;
            })
            .addCase(removePrescription.fulfilled, (state, action) => {
                state.prescriptions = (state.prescriptions || []).filter(p => p.id !== action.payload);
            });
    },
});

export const { 
    clearError, 
    addPrescriptionRealTime, 
    updatePrescriptionRealTime, 
    dispensePrescriptionRealTime 
} = prescriptionsSlice.actions;

export const setupPrescriptionSocketListeners = () => (dispatch) => {
    const socket = getSocket();
    if (!socket) {
        console.warn('Socket not available for prescription listeners');
        return;
    }

    const handleNewPrescription = (data) => {
        console.log('Received new prescription via socket:', data);
        dispatch(addPrescriptionRealTime(data));
    };

    const handlePrescriptionUpdate = (data) => {
        console.log('Received prescription update via socket:', data);
        dispatch(updatePrescriptionRealTime(data));
    };

    const handlePrescriptionDispensed = (data) => {
        console.log('Received prescription dispensed via socket:', data);
        dispatch(dispensePrescriptionRealTime(data));
    };

    socket.on('prescription:new', handleNewPrescription);
    socket.on('prescription:updated', handlePrescriptionUpdate);
    socket.on('prescription:dispensed', handlePrescriptionDispensed);

    return () => {
        socket.off('prescription:new', handleNewPrescription);
        socket.off('prescription:updated', handlePrescriptionUpdate);
        socket.off('prescription:dispensed', handlePrescriptionDispensed);
    };
};

export default prescriptionsSlice.reducer; 