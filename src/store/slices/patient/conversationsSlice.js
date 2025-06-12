import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunks
export const fetchConversations = createAsyncThunk(
    'conversations/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/conversations');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchConversationMessages = createAsyncThunk(
    'conversations/fetchConversationMessages',
    async (conversationId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/conversations/${conversationId}/messages`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'conversations/sendMessage',
    async ({ conversationId, message }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/conversations/${conversationId}/messages`, { message });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
};

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        clearConversationsError: (state) => {
            state.error = null;
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        clearCurrentConversation: (state) => {
            state.currentConversation = null;
            state.messages = [];
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch conversations
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
                state.error = action.payload?.message || 'Failed to fetch conversations';
            })
            // Fetch conversation messages
            .addCase(fetchConversationMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversationMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchConversationMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch messages';
            })
            // Send message
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to send message';
            });
    },
});

export const {
    clearConversationsError,
    setCurrentConversation,
    clearCurrentConversation,
    addMessage,
} = conversationsSlice.actions;
export default conversationsSlice.reducer; 