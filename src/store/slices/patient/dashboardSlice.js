import { createSlice } from '@reduxjs/toolkit';
import { patients } from '../../../mockdata/patients';

const initialState = {
  summary: {
    data: patients[0],
    isLoading: false,
    error: null
  },
  appointments: {
    data: [],
    isLoading: false,
    error: null
  },
  medications: {
    data: [],
    isLoading: false,
    error: null
  },
  medicalFile: {
    data: null,
    isLoading: false,
    error: null
  },
  labResults: {
    data: [],
    isLoading: false,
    error: null
  },
  vitalSigns: {
    data: [],
    isLoading: false,
    error: null
  },
  chronicConditions: {
    data: [],
    isLoading: false,
    error: null
  },
  allergies: {
    data: [],
    isLoading: false,
    error: null
  },
  messages: {
    data: [],
    isLoading: false,
    error: null
  },
  consultations: {
    data: [],
    isLoading: false,
    error: null
  }
};

const dashboardSlice = createSlice({
  name: 'patientDashboard',
  initialState,
  reducers: {
    setDashboardSummary: (state, action) => {
      state.summary.data = action.payload;
      state.summary.isLoading = false;
      state.summary.error = null;
    },
    setDashboardSummaryLoading: (state) => {
      state.summary.isLoading = true;
      state.summary.error = null;
    },
    setDashboardSummaryError: (state, action) => {
      state.summary.isLoading = false;
      state.summary.error = action.payload;
    },

    setUpcomingAppointments: (state, action) => {
      state.appointments.data = action.payload;
      state.appointments.isLoading = false;
      state.appointments.error = null;
    },
    setAppointmentsLoading: (state) => {
      state.appointments.isLoading = true;
      state.appointments.error = null;
    },
    setAppointmentsError: (state, action) => {
      state.appointments.isLoading = false;
      state.appointments.error = action.payload;
    },

    setActiveMedications: (state, action) => {
      state.medications.data = action.payload;
      state.medications.isLoading = false;
      state.medications.error = null;
    },
    setMedicationsLoading: (state) => {
      state.medications.isLoading = true;
      state.medications.error = null;
    },
    setMedicationsError: (state, action) => {
      state.medications.isLoading = false;
      state.medications.error = action.payload;
    },

    setMedicalFile: (state, action) => {
      state.medicalFile.data = action.payload;
      state.medicalFile.isLoading = false;
      state.medicalFile.error = null;
    },
    setMedicalFileLoading: (state) => {
      state.medicalFile.isLoading = true;
      state.medicalFile.error = null;
    },
    setMedicalFileError: (state, action) => {
      state.medicalFile.isLoading = false;
      state.medicalFile.error = action.payload;
    },

    setRecentLabResults: (state, action) => {
      state.labResults.data = action.payload;
      state.labResults.isLoading = false;
      state.labResults.error = null;
    },
    setLabResultsLoading: (state) => {
      state.labResults.isLoading = true;
      state.labResults.error = null;
    },
    setLabResultsError: (state, action) => {
      state.labResults.isLoading = false;
      state.labResults.error = action.payload;
    },

    setVitalSigns: (state, action) => {
      state.vitalSigns.data = action.payload;
      state.vitalSigns.isLoading = false;
      state.vitalSigns.error = null;
    },
    setVitalSignsLoading: (state) => {
      state.vitalSigns.isLoading = true;
      state.vitalSigns.error = null;
    },
    setVitalSignsError: (state, action) => {
      state.vitalSigns.isLoading = false;
      state.vitalSigns.error = action.payload;
    },

    setChronicConditions: (state, action) => {
      state.chronicConditions.data = action.payload;
      state.chronicConditions.isLoading = false;
      state.chronicConditions.error = null;
    },
    setChronicConditionsLoading: (state) => {
      state.chronicConditions.isLoading = true;
      state.chronicConditions.error = null;
    },
    setChronicConditionsError: (state, action) => {
      state.chronicConditions.isLoading = false;
      state.chronicConditions.error = action.payload;
    },

    setAllergies: (state, action) => {
      state.allergies.data = action.payload;
      state.allergies.isLoading = false;
      state.allergies.error = null;
    },
    setAllergiesLoading: (state) => {
      state.allergies.isLoading = true;
      state.allergies.error = null;
    },
    setAllergiesError: (state, action) => {
      state.allergies.isLoading = false;
      state.allergies.error = action.payload;
    },

    setRecentMessages: (state, action) => {
      state.messages.data = action.payload;
      state.messages.isLoading = false;
      state.messages.error = null;
    },
    setMessagesLoading: (state) => {
      state.messages.isLoading = true;
      state.messages.error = null;
    },
    setMessagesError: (state, action) => {
      state.messages.isLoading = false;
      state.messages.error = action.payload;
    },

    setRecentConsultations: (state, action) => {
      state.consultations.data = action.payload;
      state.consultations.isLoading = false;
      state.consultations.error = null;
    },
    setConsultationsLoading: (state) => {
      state.consultations.isLoading = true;
      state.consultations.error = null;
    },
    setConsultationsError: (state, action) => {
      state.consultations.isLoading = false;
      state.consultations.error = action.payload;
    },

    resetDashboard: (state) => {
      return initialState;
    }
  }
});

// Export actions
export const {
  setDashboardSummary,
  setDashboardSummaryLoading,
  setDashboardSummaryError,
  setUpcomingAppointments,
  setAppointmentsLoading,
  setAppointmentsError,
  setActiveMedications,
  setMedicationsLoading,
  setMedicationsError,
  setMedicalFile,
  setMedicalFileLoading,
  setMedicalFileError,
  setRecentLabResults,
  setLabResultsLoading,
  setLabResultsError,
  setVitalSigns,
  setVitalSignsLoading,
  setVitalSignsError,
  setChronicConditions,
  setChronicConditionsLoading,
  setChronicConditionsError,
  setAllergies,
  setAllergiesLoading,
  setAllergiesError,
  setRecentMessages,
  setMessagesLoading,
  setMessagesError,
  setRecentConsultations,
  setConsultationsLoading,
  setConsultationsError,
  resetDashboard
} = dashboardSlice.actions;

// Export selectors
export const selectDashboardSummary = (state) => state.patientDashboard.summary;
export const selectUpcomingAppointments = (state) => state.patientDashboard.appointments;
export const selectActiveMedications = (state) => state.patientDashboard.medications;
export const selectMedicalFile = (state) => state.patientDashboard.medicalFile;
export const selectRecentLabResults = (state) => state.patientDashboard.labResults;
export const selectVitalSigns = (state) => state.patientDashboard.vitalSigns;
export const selectChronicConditions = (state) => state.patientDashboard.chronicConditions;
export const selectAllergies = (state) => state.patientDashboard.allergies;
export const selectRecentMessages = (state) => state.patientDashboard.messages;
export const selectRecentConsultations = (state) => state.patientDashboard.consultations;

// Export reducer
export default dashboardSlice.reducer; 