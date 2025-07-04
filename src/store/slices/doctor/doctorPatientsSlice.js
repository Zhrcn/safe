import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    patients: [],
    selectedPatient: null,
    favorites: [],
    loading: false,
    error: null
};
const doctorPatientsSlice = createSlice({
    name: 'doctorPatients',
    initialState,
    reducers: {
        setSelectedPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
        addPatientToFavorites: (state, action) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removePatientFromFavorites: (state, action) => {
            state.favorites = state.favorites.filter(id => id !== action.payload);
        },
        clearSelectedPatient: (state) => {
            state.selectedPatient = null;
        }
    }
});
export const {
    setSelectedPatient,
    addPatientToFavorites,
    removePatientFromFavorites,
    clearSelectedPatient
} = doctorPatientsSlice.actions;
export default doctorPatientsSlice.reducer; 