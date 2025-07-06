import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOnlineStatus, onUserPresence } from '@/store/services/patient/conversationApi';

// Debounce function to prevent rapid status changes
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Async thunk to get online status for multiple users
export const fetchOnlineStatus = createAsyncThunk(
  'onlineStatus/fetchOnlineStatus',
  async (userIds, { rejectWithValue }) => {
    try {
      const onlineStatus = await getOnlineStatus(userIds);
      return onlineStatus;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  onlineUsers: {}, // userId -> boolean
  loading: false,
  error: null
};

const onlineStatusSlice = createSlice({
  name: 'onlineStatus',
  initialState,
  reducers: {
    setUserOnline: (state, action) => {
      const { userId } = action.payload;
      state.onlineUsers[userId] = true;
    },
    setUserOffline: (state, action) => {
      const { userId } = action.payload;
      state.onlineUsers[userId] = false;
    },
    updateOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      // Only update if the status is actually different to prevent flickering
      if (state.onlineUsers[userId] !== isOnline) {
        state.onlineUsers[userId] = isOnline;
      }
    },
    clearOnlineStatus: (state) => {
      state.onlineUsers = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnlineStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnlineStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.onlineUsers = { ...state.onlineUsers, ...action.payload };
      })
      .addCase(fetchOnlineStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setUserOnline, 
  setUserOffline, 
  updateOnlineStatus, 
  clearOnlineStatus 
} = onlineStatusSlice.actions;

// Selectors
export const selectOnlineUsers = (state) => state.onlineStatus.onlineUsers;
export const selectIsUserOnline = (state, userId) => state.onlineStatus.onlineUsers[userId] || false;
export const selectOnlineStatusLoading = (state) => state.onlineStatus.loading;
export const selectOnlineStatusError = (state) => state.onlineStatus.error;

export default onlineStatusSlice.reducer; 