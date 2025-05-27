import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { userApi } from './services/userApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dateReducer from './dateSlice';
import patientReducer from './patientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    date: dateReducer,
    patient: patientReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});

setupListeners(store.dispatch); 