import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/lib/redux/userSlice'; // Corrected import path
import dateReducer from '@/lib/redux/dateSlice'; // Corrected import path
import patientReducer from '@/lib/redux/patientSlice'; // Corrected import path
import themeReducer from '@/lib/redux/slices/themeSlice'; // Corrected import path

export const store = configureStore({
  reducer: {
    user: userReducer,
    date: dateReducer,
    patient: patientReducer,
    theme: themeReducer, // Add the theme reducer
  },
}); 