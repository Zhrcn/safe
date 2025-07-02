import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConversations, addConversation, updateConversation, deleteConversation } from '@/store/services/patient/conversationApi';

export const fetchConversations = createAsyncThunk(
    'conversations/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            return await getConversations();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createConversation = createAsyncThunk(
    'conversations/createConversation',
    async (conversationData, { rejectWithValue }) => {
        try {
            return await addConversation(conversationData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editConversation = createAsyncThunk(
    'conversations/editConversation',
    async ({ id, conversationData }, { rejectWithValue }) => {
        try {
            return await updateConversation(id, conversationData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeConversation = createAsyncThunk(
    'conversations/removeConversation',
    async (id, { rejectWithValue }) => {
        try {
            await deleteConversation(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState: {
        conversations: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createConversation.fulfilled, (state, action) => {
                state.conversations.push(action.payload);
            })
            .addCase(editConversation.fulfilled, (state, action) => {
                const idx = state.conversations.findIndex(c => c.id === action.payload.id);
                if (idx !== -1) state.conversations[idx] = action.payload;
            })
            .addCase(removeConversation.fulfilled, (state, action) => {
                state.conversations = state.conversations.filter(c => c.id !== action.payload);
            });
    },
});

export const { clearError } = conversationsSlice.actions;
export default conversationsSlice.reducer; 