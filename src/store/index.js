import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlice';
import userReducer from './userSlice';
import { authApi } from '../lib/redux/services/authApi';
import { patientApi } from '../lib/redux/services/patientApi'; // Import patientApi

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer, // Add patientApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
    .concat(authApi.middleware)
    .concat(patientApi.middleware) // Add patientApi middleware
});
