import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import dateReducer from './slices/dateSlice';
import patientReducer from './slices/patientSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    date: dateReducer,
    patient: patientReducer,
  },
}); 