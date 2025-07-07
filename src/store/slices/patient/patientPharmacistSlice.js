import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/store/services/axiosInstance';

// Async thunk for fetching pharmacies
export const fetchPharmacies = createAsyncThunk(
    'patientPharmacist/fetchPharmacies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/pharmacists');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch pharmacies');
        }
    }
);

// Async thunk for fetching a single pharmacy
export const fetchPharmacyById = createAsyncThunk(
    'patientPharmacist/fetchPharmacyById',
    async (pharmacyId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/pharmacists/${pharmacyId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch pharmacy');
        }
    }
);

// Async thunk for sending message to pharmacy
export const sendMessageToPharmacy = createAsyncThunk(
    'patientPharmacist/sendMessageToPharmacy',
    async ({ pharmacyId, message }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/pharmacists/${pharmacyId}/message`, {
                message
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

const initialState = {
    pharmacies: [],
    selectedPharmacy: null,
    loading: false,
    loadingSingle: false,
    loadingMessage: false,
    error: null,
    messageError: null,
    filters: {
        search: '',
        specialty: 'all',
        location: 'all',
        sortBy: 'rating',
        sortOrder: 'desc'
    }
};

const patientPharmacistSlice = createSlice({
    name: 'patientPharmacist',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.messageError = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setSelectedPharmacy: (state, action) => {
            state.selectedPharmacy = action.payload;
        },
        clearSelectedPharmacy: (state) => {
            state.selectedPharmacy = null;
        },
        addPharmacyToFavorites: (state, action) => {
            const pharmacyId = action.payload;
            const pharmacy = state.pharmacies.find(p => p._id === pharmacyId);
            if (pharmacy) {
                pharmacy.isFavorite = true;
            }
        },
        removePharmacyFromFavorites: (state, action) => {
            const pharmacyId = action.payload;
            const pharmacy = state.pharmacies.find(p => p._id === pharmacyId);
            if (pharmacy) {
                pharmacy.isFavorite = false;
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch pharmacies
        builder
            .addCase(fetchPharmacies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPharmacies.fulfilled, (state, action) => {
                state.loading = false;
                state.pharmacies = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(fetchPharmacies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch single pharmacy
        builder
            .addCase(fetchPharmacyById.pending, (state) => {
                state.loadingSingle = true;
                state.error = null;
            })
            .addCase(fetchPharmacyById.fulfilled, (state, action) => {
                state.loadingSingle = false;
                state.selectedPharmacy = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(fetchPharmacyById.rejected, (state, action) => {
                state.loadingSingle = false;
                state.error = action.payload;
            });

        // Send message to pharmacy
        builder
            .addCase(sendMessageToPharmacy.pending, (state) => {
                state.loadingMessage = true;
                state.messageError = null;
            })
            .addCase(sendMessageToPharmacy.fulfilled, (state) => {
                state.loadingMessage = false;
                state.messageError = null;
            })
            .addCase(sendMessageToPharmacy.rejected, (state, action) => {
                state.loadingMessage = false;
                state.messageError = action.payload;
            });
    }
});

export const {
    clearError,
    setFilters,
    clearFilters,
    setSelectedPharmacy,
    clearSelectedPharmacy,
    addPharmacyToFavorites,
    removePharmacyFromFavorites
} = patientPharmacistSlice.actions;

// Selectors
export const selectPharmacies = (state) => state.patientPharmacist.pharmacies;
export const selectSelectedPharmacy = (state) => state.patientPharmacist.selectedPharmacy;
export const selectPharmaciesLoading = (state) => state.patientPharmacist.loading;
export const selectPharmacyLoading = (state) => state.patientPharmacist.loadingSingle;
export const selectMessageLoading = (state) => state.patientPharmacist.loadingMessage;
export const selectPharmaciesError = (state) => state.patientPharmacist.error;
export const selectMessageError = (state) => state.patientPharmacist.messageError;
export const selectPharmaciesFilters = (state) => state.patientPharmacist.filters;

// Filtered pharmacies selector
export const selectFilteredPharmacies = (state) => {
    const { pharmacies } = state.patientPharmacist;
    const { search, specialty, location, sortBy, sortOrder } = state.patientPharmacist.filters;

    let filtered = [...pharmacies];

    // Search filter
    if (search) {
        filtered = filtered.filter(pharmacy =>
            pharmacy.name?.toLowerCase().includes(search.toLowerCase()) ||
            pharmacy.pharmacyName?.toLowerCase().includes(search.toLowerCase()) ||
            pharmacy.address?.toLowerCase().includes(search.toLowerCase()) ||
            pharmacy.specialties?.some(s => s.toLowerCase().includes(search.toLowerCase()))
        );
    }

    // Specialty filter
    if (specialty !== 'all') {
        filtered = filtered.filter(pharmacy =>
            pharmacy.specialties?.includes(specialty)
        );
    }

    // Location filter
    if (location !== 'all') {
        filtered = filtered.filter(pharmacy =>
            pharmacy.address?.includes(location)
        );
    }

    // Sort
    filtered.sort((a, b) => {
        let compareA, compareB;
        
        switch (sortBy) {
            case 'name':
                compareA = (a.name || '').toLowerCase();
                compareB = (b.name || '').toLowerCase();
                break;
            case 'rating':
                compareA = a.rating || 0;
                compareB = b.rating || 0;
                break;
            case 'distance':
                compareA = a.distance || 0;
                compareB = b.distance || 0;
                break;
            default:
                return 0;
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
};

export default patientPharmacistSlice.reducer; 