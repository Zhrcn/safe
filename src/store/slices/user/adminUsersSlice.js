import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser as createUserService
} from '@/services/adminService';

const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

export const fetchUsers = createAsyncThunk('adminUsers/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await getUsers();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchUserById = createAsyncThunk('adminUsers/fetchUserById', async (userId, { rejectWithValue }) => {
  try {
    return await getUserById(userId);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const editUser = createAsyncThunk('adminUsers/editUser', async ({ userId, data }, { rejectWithValue }) => {
  try {
    return await updateUser(userId, data);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deactivateUser = createAsyncThunk('adminUsers/deactivateUser', async (userId, { rejectWithValue }) => {
  try {
    return await updateUser(userId, { status: 'inactive' });
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const activateUser = createAsyncThunk('adminUsers/activateUser', async (userId, { rejectWithValue }) => {
  try {
    return await updateUser(userId, { status: 'active' });
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const blockUser = createAsyncThunk('adminUsers/blockUser', async (userId, { rejectWithValue }) => {
  try {
    return await updateUser(userId, { status: 'blocked' });
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const banUser = createAsyncThunk('adminUsers/banUser', async (userId, { rejectWithValue }) => {
  try {
    return await updateUser(userId, { status: 'banned' });
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeUser = createAsyncThunk('adminUsers/removeUser', async (userId, { rejectWithValue }) => {
  try {
    return await deleteUser(userId);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createUser = createAsyncThunk('adminUsers/createUser', async (data, { rejectWithValue }) => {
  try {
    return await createUserService(data);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearAdminUsersError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload)
          ? action.payload.map(u => ({ ...u, id: u.id || u._id }))
          : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.meta.arg);
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        const formattedUser = {
          ...user,
          id: user.id || user._id,
          name: (user.firstName || '') + (user.lastName ? ' ' + user.lastName : ''),
          status: user.status || 'active',
        };
        state.users.push(formattedUser);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminUsersError, setSelectedUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer; 