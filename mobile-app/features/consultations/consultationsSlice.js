import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const fetchConsultations = createAsyncThunk(
  'consultations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/consultations');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const addConsultation = createAsyncThunk(
  'consultations/add',
  async ({ doctorId, question }, { rejectWithValue }) => {
    try {
      const response = await api.post('/consultations', { doctorId, question });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const deleteConsultation = createAsyncThunk(
  'consultations/delete',
  async (consultationId, { rejectWithValue }) => {
    try {
      await api.delete(`/consultations/${consultationId}`);
      return consultationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const sendFollowUpQuestion = createAsyncThunk(
  'consultations/sendFollowUp',
  async ({ consultationId, question }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/consultations/${consultationId}/follow-up`, { question });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const consultationsSlice = createSlice({
  name: 'consultations',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addConsultation.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteConsultation.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c._id !== action.payload);
      })
      .addCase(sendFollowUpQuestion.fulfilled, (state, action) => {
        const idx = state.list.findIndex(c => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default consultationsSlice.reducer;
export { fetchConsultations, addConsultation, deleteConsultation, sendFollowUpQuestion }; 