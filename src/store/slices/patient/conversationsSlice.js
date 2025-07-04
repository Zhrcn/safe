import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getConversations,
  getConversationById,
  addConversation,
  updateConversation,
  deleteConversation,
  markAsRead,
  sendMessage as sendMessageSocket
} from '@/store/services/patient/conversationApi';

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

export const fetchConversationById = createAsyncThunk(
  'conversations/fetchConversationById',
  async (id, { rejectWithValue }) => {
    try {
      return await getConversationById(id);
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

export const updateConversationThunk = createAsyncThunk(
  'conversations/updateConversation',
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

export const markConversationAsRead = createAsyncThunk(
  'conversations/markAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      return await markAsRead(conversationId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async ({ conversationId, content, currentUserId }, { getState, rejectWithValue }) => {
    try {
      console.log('[sendMessage thunk] called', { conversationId, content, currentUserId });
      // Get the conversation from state
      const state = getState();
      const conversation = state.conversations.conversations.find(c => c._id === conversationId);
      console.log('[sendMessage thunk] found conversation:', conversation);
      if (!conversation) throw new Error('Conversation not found');
      // Determine receiver (always a user ID string)
      const receiver = conversation.participants
        .map(p => typeof p === 'string' ? p : p._id)
        .find(id => id !== currentUserId);
      console.log('[sendMessage thunk] determined receiver:', receiver);
      if (!receiver) throw new Error('Could not determine receiver');
      // Construct the message object
      const message = {
        content,
        sender: currentUserId,
        receiver,
        timestamp: new Date(),
        read: false,
      };
      console.log('[sendMessage thunk] constructed message:', message);
      return await sendMessageSocket({ conversationId, message });
    } catch (err) {
      console.error('[sendMessage thunk] error:', err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  conversations: [],
  loading: false,
  error: null,
  currentConversation: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
    },
    addMessageToConversation(state, action) {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        if (!conversation.messages) conversation.messages = [];
        if (!conversation.messages.some(m => m._id === message._id)) {
          conversation.messages.push(message);
          conversation.lastMessage = message;
          conversation.updatedAt = new Date().toISOString();
        }
      }
    },
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
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
      })
      .addCase(removeConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(c => c._id !== action.payload);
        if (state.currentConversation?._id === action.payload) {
          state.currentConversation = null;
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c._id === action.payload.conversationId);
        if (conversation) {
          if (!conversation.messages) conversation.messages = [];
          if (!conversation.messages.some(m => m._id === action.payload.message._id)) {
            conversation.messages.push(action.payload.message);
            conversation.lastMessage = action.payload.message;
            conversation.updatedAt = new Date().toISOString();
          }
        }
      });
  },
});

export const {
  clearError,
  setCurrentConversation,
  addMessageToConversation,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
