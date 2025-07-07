import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDoctors, addProvider, updateProvider, deleteProvider } from '@/store/services/patient/providerApi';

export const fetchProviders = createAsyncThunk(
    'providers/fetchProviders',
    async (_, { rejectWithValue }) => {
        try {
            return await getDoctors();
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createProvider = createAsyncThunk(
    'providers/createProvider',
    async (providerData, { rejectWithValue }) => {
        try {
            return await addProvider(providerData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editProvider = createAsyncThunk(
    'providers/editProvider',
    async ({ id, providerData }, { rejectWithValue }) => {
        try {
            return await updateProvider(id, providerData);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeProvider = createAsyncThunk(
    'providers/removeProvider',
    async (id, { rejectWithValue }) => {
        try {
            await deleteProvider(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const providersSlice = createSlice({
    name: 'providers',
    initialState: {
        providers: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProviders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProviders.fulfilled, (state, action) => {
                state.loading = false;
                state.providers = action.payload;
            })
            .addCase(fetchProviders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProvider.fulfilled, (state, action) => {
                state.providers.push(action.payload);
            })
            .addCase(editProvider.fulfilled, (state, action) => {
                const idx = state.providers.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.providers[idx] = action.payload;
            })
            .addCase(removeProvider.fulfilled, (state, action) => {
                state.providers = state.providers.filter(p => p.id !== action.payload);
            });
    },
});

export const { clearError } = providersSlice.actions;
export default providersSlice.reducer; 