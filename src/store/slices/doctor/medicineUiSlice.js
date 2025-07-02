import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newRequestDialogOpen: false,
};

const medicineUiSlice = createSlice({
  name: 'medicineUi',
  initialState,
  reducers: {
    openNewRequestDialog: (state) => { state.newRequestDialogOpen = true; },
    closeNewRequestDialog: (state) => { state.newRequestDialogOpen = false; },
  },
});

export const { openNewRequestDialog, closeNewRequestDialog } = medicineUiSlice.actions;
export default medicineUiSlice.reducer; 