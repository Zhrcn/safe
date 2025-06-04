import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlice';

export const store = configureStore({
  reducer: {
    patient: patientReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
