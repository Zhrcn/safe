import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConsultations, createConsultation, answerConsultation, addFollowUpQuestion, getConsultationMessages, getConsultationsByDoctorAndPatient } from '@/store/services/patient/consultationApi';
import axiosInstance from '../../services/axiosInstance';

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

export const deleteConsultation = createAsyncThunk(
    'consultations/deleteConsultation',
    async (consultationId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/consultations/${consultationId}`);
            return consultationId;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const sendFollowUpQuestion = createAsyncThunk(
    'consultations/sendFollowUpQuestion',
    async ({ consultationId, question }, { rejectWithValue }) => {
        try {
            return await addFollowUpQuestion(consultationId, question);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchConsultationMessages = createAsyncThunk(
    'consultations/fetchConsultationMessages',
    async (consultationId, { rejectWithValue }) => {
        try {
            return await getConsultationMessages(consultationId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchConsultationsByDoctorAndPatient = createAsyncThunk(
    'consultations/fetchConsultationsByDoctorAndPatient',
    async (patientId, { rejectWithValue }) => {
        try {
            return await getConsultationsByDoctorAndPatient(patientId);
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
        messages: {},
        messagesLoading: false,
        messagesError: null,
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
            })
            .addCase(deleteConsultation.fulfilled, (state, action) => {
                state.consultations = state.consultations.filter(c => c._id !== action.payload);
            })
            .addCase(sendFollowUpQuestion.fulfilled, (state, action) => {
                const index = state.consultations.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.consultations[index] = action.payload;
                }
            })
            .addCase(fetchConsultationMessages.pending, (state) => {
                state.messagesLoading = true;
                state.messagesError = null;
            })
            .addCase(fetchConsultationMessages.fulfilled, (state, action) => {
                state.messagesLoading = false;
                state.messages[action.payload.consultation._id] = action.payload.messages;
            })
            .addCase(fetchConsultationMessages.rejected, (state, action) => {
                state.messagesLoading = false;
                state.messagesError = action.payload;
            });
    },
});

export const { clearError } = consultationsSlice.actions;
export default consultationsSlice.reducer; 