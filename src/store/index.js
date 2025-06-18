import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from './services/user/userApi';
import { patientApi } from './services/patient/patientApi';
import { api } from './services/api';
import { authApi } from './services/user/authApi';
import { doctorApi } from './services/doctor/doctorApi';
import authReducer from './slices/auth/authSlice';
import patientProfileReducer from './slices/patient/profileSlice';
import patientDashboardReducer from './slices/patient/dashboardSlice';
import patientAppointmentsReducer from './slices/patient/appointmentsSlice';
import patientPrescriptionsReducer from './slices/patient/prescriptionsSlice';
import patientConsultationsReducer from './slices/patient/consultationsSlice';
import patientMedicationsReducer from './slices/patient/medicationsSlice';
import patientConversationsReducer from './slices/patient/conversationsSlice';
import patientProvidersReducer from './slices/patient/providersSlice';
import medicalRecordsReducer from './slices/patient/medicalRecordsSlice';
import doctorPatientsReducer from './slices/doctor/doctorPatientsSlice';
import doctorConsultationsReducer from './slices/doctor/doctorConsultationsSlice';
import doctorPrescriptionsReducer from './slices/doctor/doctorPrescriptionsSlice';
import doctorAppointmentsReducer from './slices/doctor/doctorAppointmentsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [patientApi.reducerPath]: patientApi.reducer,
        [api.reducerPath]: api.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [doctorApi.reducerPath]: doctorApi.reducer,
        auth: authReducer,
        patientProfile: patientProfileReducer,
        patientDashboard: patientDashboardReducer,
        patientAppointments: patientAppointmentsReducer,
        patientPrescriptions: patientPrescriptionsReducer,
        patientConsultations: patientConsultationsReducer,
        patientMedications: patientMedicationsReducer,
        patientConversations: patientConversationsReducer,
        patientProviders: patientProvidersReducer,
        medicalRecords: medicalRecordsReducer,
        doctorPatients: doctorPatientsReducer,
        doctorConsultations: doctorConsultationsReducer,
        doctorPrescriptions: doctorPrescriptionsReducer,
        doctorAppointments: doctorAppointmentsReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            patientApi.middleware,
            api.middleware,
            authApi.middleware,
            doctorApi.middleware
        ),
});

setupListeners(store.dispatch);

export default store;
