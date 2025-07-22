import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk(
  'messaging/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/conversations/');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'messaging/fetchConversationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conversations/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: { list: [], loading: false, error: null, current: null, currentLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConversationById.pending, (state) => {
        state.currentLoading = true;
        state.current = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.currentLoading = false;
        state.error = action.payload;
      });
  },
});

export default messagingSlice.reducer; 