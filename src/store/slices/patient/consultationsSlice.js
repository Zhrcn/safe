import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConsultations, createConsultation, answerConsultation } from '@/store/services/patient/consultationApi';

export const fetchConsultations = createAsyncThunk(
    'consultations/fetchConsultations',
    async (_, { rejectWithValue }) => {
        try {
            return await getConsultations();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addConsultation = createAsyncThunk(
    'consultations/addConsultation',
    async ({ doctorId, question }, { rejectWithValue }) => {
        try {
            return await createConsultation(doctorId, question);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const replyConsultation = createAsyncThunk(
    'consultations/replyConsultation',
    async ({ id, answer }, { rejectWithValue }) => {
        try {
            return await answerConsultation(id, answer);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const consultationsSlice = createSlice({
    name: 'consultations',
    initialState: {
        consultations: [],
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
            .addCase(fetchConsultations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConsultations.fulfilled, (state, action) => {
                state.loading = false;
                state.consultations = action.payload;
            })
            .addCase(fetchConsultations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addConsultation.fulfilled, (state, action) => {
                state.consultations.push(action.payload);
            })
            .addCase(replyConsultation.fulfilled, (state, action) => {
                const idx = state.consultations.findIndex(c => c.id === action.payload.id);
                if (idx !== -1) state.consultations[idx] = action.payload;
            });
    },
});

export const { clearError } = consultationsSlice.actions;
export default consultationsSlice.reducer; 