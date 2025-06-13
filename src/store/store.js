import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/user/authApi';
import { userApi } from './services/user/userApi';
import { patientApi } from './services/patient/patientApi';
import { doctorApi } from './services/doctor/doctorApi';
import { scheduleApi } from './services/doctor/scheduleApi';
import { patientsApi } from './services/doctor/patientsApi';
import { consultationsApi as doctorConsultationsApi } from './services/doctor/consultationsApi';
import { prescriptionsApi as doctorPrescriptionsApi } from './services/doctor/prescriptionsApi';
import authReducer from './slices/user/authSlice';
import userReducer from './slices/user/userSlice';
import doctorProfileReducer from './slices/doctor/doctorProfileSlice';
import doctorScheduleReducer from './slices/doctor/doctorScheduleSlice';
import doctorPatientsReducer from './slices/doctor/doctorPatientsSlice';
import doctorConsultationsReducer from './slices/doctor/doctorConsultationsSlice';
import doctorPrescriptionsReducer from './slices/doctor/doctorPrescriptionsSlice';
import dashboardReducer from './slices/patient/dashboardSlice';
import { dashboardApi } from './services/patient/dashboardApi';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

// Create a root API that will be used as the base for all other APIs
const rootApi = createApi({
  reducerPath: 'rootApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [doctorConsultationsApi.reducerPath]: doctorConsultationsApi.reducer,
    [doctorPrescriptionsApi.reducerPath]: doctorPrescriptionsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    auth: authReducer,
    user: userReducer,
    doctorProfile: doctorProfileReducer,
    doctorSchedule: doctorScheduleReducer,
    doctorPatients: doctorPatientsReducer,
    doctorConsultations: doctorConsultationsReducer,
    doctorPrescriptions: doctorPrescriptionsReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(
      rootApi.middleware,
      authApi.middleware,
      userApi.middleware,
      patientApi.middleware,
      doctorApi.middleware,
      scheduleApi.middleware,
      patientsApi.middleware,
      doctorConsultationsApi.middleware,
      doctorPrescriptionsApi.middleware,
      dashboardApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export default store; 