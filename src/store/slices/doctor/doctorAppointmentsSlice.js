import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorAppointmentsApi } from '../../services/doctor/appointmentsApi';

// Async thunks
export const fetchDoctorAppointments = createAsyncThunk(
  'doctorAppointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.getDoctorAppointments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const acceptAppointment = createAsyncThunk(
  'doctorAppointments/acceptAppointment',
  async ({ appointmentId, appointmentData }, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.acceptAppointment(appointmentId, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept appointment');
    }
  }
);

export const rejectAppointment = createAsyncThunk(
  'doctorAppointments/rejectAppointment',
  async ({ appointmentId, doctorNotes }, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.rejectAppointment(appointmentId, doctorNotes);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'doctorAppointments/updateAppointment',
  async ({ appointmentId, appointmentData }, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.updateAppointment(appointmentId, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const getAppointmentDetails = createAsyncThunk(
  'doctorAppointments/getAppointmentDetails',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.getAppointmentDetails(appointmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get appointment details');
    }
  }
);

const initialState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  success: null
};

const doctorAppointmentsSlice = createSlice({
  name: 'doctorAppointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept appointment
      .addCase(acceptAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment accepted successfully';
        // Update the appointment in the list
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(acceptAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reject appointment
      .addCase(rejectAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment rejected successfully';
        // Update the appointment in the list
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(rejectAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment updated successfully';
        // Update the appointment in the list
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
        // Update selected appointment if it's the same one
        if (state.selectedAppointment && state.selectedAppointment._id === action.payload.data._id) {
          state.selectedAppointment = action.payload.data;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get appointment details
      .addCase(getAppointmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAppointment = action.payload.data;
      })
      .addCase(getAppointmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedAppointment } = doctorAppointmentsSlice.actions;
export default doctorAppointmentsSlice.reducer; 