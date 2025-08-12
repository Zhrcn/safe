import { configureStore } from '@reduxjs/toolkit';
import appointmentsReducer from '../features/appointments/appointmentsSlice';
import medicalRecordsReducer from '../features/medicalRecords/medicalRecordsSlice';
import medicationsReducer from '../features/medications/medicationsSlice';
import messagingReducer from '../features/messaging/messagingSlice';
import prescriptionsReducer from '../features/prescriptions/prescriptionsSlice';
import profileReducer from '../features/profile/profileSlice';
import providersReducer from '../features/providers/providersSlice';
import consultationsReducer from '../features/consultations/consultationsSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    medicalRecords: medicalRecordsReducer,
    medications: medicationsReducer,
    messaging: messagingReducer,
    prescriptions: prescriptionsReducer,
    profile: profileReducer,
    providers: providersReducer,
    consultations: consultationsReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
  },
});


import { useDispatch } from 'react-redux';
export const useAppDispatch = useDispatch; 