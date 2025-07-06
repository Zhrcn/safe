import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';
import { authApi } from './api/authApi';
import { medicineApi } from './services/doctor/medicineApi';
import authReducer, { clearCache } from './slices/auth/authSlice';
import doctorProfileReducer from './slices/doctor/doctorProfileSlice';
import doctorScheduleReducer from './slices/doctor/doctorScheduleSlice';
import doctorPatientsReducer from './slices/doctor/doctorPatientsSlice';
import doctorConsultationsReducer from './slices/doctor/doctorConsultationsSlice';
import doctorPrescriptionsReducer from './slices/doctor/doctorPrescriptionsSlice';
import doctorAppointmentsReducer from './slices/doctor/doctorAppointmentsSlice';
import dashboardReducer from './slices/patient/dashboardSlice';
import appointmentsReducer from './slices/patient/appointmentsSlice';
import medicationsReducer from './slices/patient/medicationsSlice';
import consultationsReducer from './slices/patient/consultationsSlice';
import prescriptionsReducer from './slices/patient/prescriptionsSlice';
import medicalRecordsReducer from './slices/patient/medical-recordsSlice';
import conversationsReducer from './slices/patient/conversationsSlice';
import onlineStatusReducer from './slices/patient/onlineStatusSlice';
import providersReducer from './slices/patient/providersSlice';
import profileReducer from './slices/patient/profileSlice';
import medicineUiReducer from './slices/doctor/medicineUiSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [medicineApi.reducerPath]: medicineApi.reducer,
    auth: authReducer,
    doctorProfile: doctorProfileReducer,
    doctorSchedule: doctorScheduleReducer,
    doctorPatients: doctorPatientsReducer,
    doctorConsultations: doctorConsultationsReducer,
    doctorPrescriptions: doctorPrescriptionsReducer,
    doctorAppointments: doctorAppointmentsReducer,
    dashboard: dashboardReducer,
    appointments: appointmentsReducer,
    medications: medicationsReducer,
    consultations: consultationsReducer,
    prescriptions: prescriptionsReducer,
    medicalRecords: medicalRecordsReducer,
    conversations: conversationsReducer,
    onlineStatus: onlineStatusReducer,
    providers: providersReducer,
    profile: profileReducer,
    medicineUi: medicineUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(api.middleware, authApi.middleware, medicineApi.middleware).concat(
      (store) => (next) => (action) => {
        if (action.type === clearCache.type) {
          // Clear all RTK Query caches
          store.dispatch(api.util.resetApiState());
          store.dispatch(authApi.util.resetApiState());
          store.dispatch(medicineApi.util.resetApiState());
        }
        return next(action);
      }
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch); 