import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getConversations, 
  getConversationById, 
  addConversation as addConversationApi,
  updateConversation as updateConversationApi,
  deleteConversation as deleteConversationApi,
  markAsRead,
  sendMessage as sendMessageApi
} from '@/store/services/patient/conversationApi';

// If you use async thunks, import them here
// import { fetchConversations, createConversation, editConversation, removeConversation } from '../actions/conversationThunks';

const initialState = {
  conversations: [],
  loading: false,
  error: null,
  currentConversation: null,
};

// Async thunks
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
      return await addConversationApi(conversationData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateConversation = createAsyncThunk(
  'conversations/updateConversation',
  async ({ id, conversationData }, { rejectWithValue }) => {
    try {
      return await updateConversationApi(id, conversationData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeConversation = createAsyncThunk(
  'conversations/removeConversation',
  async (id, { rejectWithValue }) => {
    try {
      await deleteConversationApi(id);
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

// Only uses socket-based sendMessage
export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      return await sendMessageApi({ conversationId, message });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

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
        if (!conversation.messages) {
          conversation.messages = [];
        }
        // Deduplicate by _id if needed
        if (!conversation.messages.some(m => m._id === message._id)) {
          conversation.messages.push(message);
          conversation.lastMessage = message;
          conversation.updatedAt = new Date().toISOString();
        }
      }
    },
    updateConversationLastMessage(state, action) {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = new Date().toISOString();
      }
    },
    setUnreadCount(state, action) {
      const { conversationId, count } = action.payload;
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        conversation.unreadCount = count;
      }
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
        state.error = action.payload;
      })
      // Fetch single conversation
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
      })
      // Create conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
      })
      // Update conversation
      .addCase(updateConversation.fulfilled, (state, action) => {
        const idx = state.conversations.findIndex(c => c._id === action.payload._id);
        if (idx !== -1) {
          state.conversations[idx] = action.payload;
        }
        if (state.currentConversation?._id === action.payload._id) {
          state.currentConversation = action.payload;
        }
      })
      // Delete conversation
      .addCase(removeConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(c => c._id !== action.payload);
        if (state.currentConversation?._id === action.payload) {
          state.currentConversation = null;
        }
      })
      // Mark as read
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c._id === action.payload._id);
        if (conversation) {
          conversation.unreadCount = 0;
          conversation.messages = action.payload.messages;
        }
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c._id === action.payload.conversationId);
        if (conversation) {
          if (!conversation.messages) {
            conversation.messages = [];
          }
          conversation.messages.push(action.payload.message);
          conversation.lastMessage = action.payload.message;
          conversation.updatedAt = new Date().toISOString();
        }
      });
  },
  // If you use async thunks, you can add extraReducers here
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchConversations.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchConversations.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.conversations = action.payload;
  //     })
  //     .addCase(fetchConversations.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload;
  //     })
  //     .addCase(createConversation.fulfilled, (state, action) => {
  //       state.conversations.push(action.payload);
  //     })
  //     .addCase(editConversation.fulfilled, (state, action) => {
  //       const idx = state.conversations.findIndex(c => c.id === action.payload.id);
  //       if (idx !== -1) state.conversations[idx] = action.payload;
  //     })
  //     .addCase(removeConversation.fulfilled, (state, action) => {
  //       state.conversations = state.conversations.filter(c => c.id !== action.payload);
  //     });
  // },
});

export const {
  clearError,
  setCurrentConversation,
  addMessageToConversation,
  updateConversationLastMessage,
  setUnreadCount,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;