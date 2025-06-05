import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlice';
import userReducer from '../lib/slices/userSlice';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
