import { createSlice } from '@reduxjs/toolkit';

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    selectedPatient: null,
  },
  reducers: {
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
  },
});

export const { setSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer; 