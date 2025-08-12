import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorAppointmentsApi } from '../../services/doctor/appointmentsApi';

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

export const approveRescheduleRequest = createAsyncThunk(
  'doctorAppointments/approveRescheduleRequest',
  async ({ appointmentId, rescheduleData }, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.handleRescheduleRequest(appointmentId, 'approve', rescheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve reschedule request');
    }
  }
);

export const rejectRescheduleRequest = createAsyncThunk(
  'doctorAppointments/rejectRescheduleRequest',
  async ({ appointmentId, doctorNotes }, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.handleRescheduleRequest(appointmentId, 'reject', { doctorNotes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject reschedule request');
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

export const createAppointment = createAsyncThunk(
  'doctorAppointments/createAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.createAppointment(appointmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const completeAppointment = createAsyncThunk(
  'doctorAppointments/completeAppointment',
  async ({ appointmentId, notes }, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.completeAppointment(appointmentId, notes);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete appointment');
    }
  }
);

export const fetchAppointmentsByPatient = createAsyncThunk(
  'doctorAppointments/fetchAppointmentsByPatient',
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await doctorAppointmentsApi.getAppointmentsByPatient(patientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient appointments');
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
      .addCase(acceptAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment accepted successfully';
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(acceptAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment rejected successfully';
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(rejectAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment updated successfully';
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
        if (state.selectedAppointment && state.selectedAppointment._id === action.payload.data._id) {
          state.selectedAppointment = action.payload.data;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(approveRescheduleRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveRescheduleRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Reschedule request approved successfully';
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(approveRescheduleRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectRescheduleRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRescheduleRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Reschedule request rejected successfully';
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
      })
      .addCase(rejectRescheduleRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment created successfully';
        if (action.payload) {
          state.appointments.unshift(action.payload);
        }
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Appointment completed successfully';
        const index = state.appointments.findIndex(apt => apt._id === action.payload.data._id);
        if (index !== -1) {
          state.appointments[index] = action.payload.data;
        }
        if (state.selectedAppointment && state.selectedAppointment._id === action.payload.data._id) {
          state.selectedAppointment = action.payload.data;
        }
      })
      .addCase(completeAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppointmentsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data;
      })
      .addCase(fetchAppointmentsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedAppointment } = doctorAppointmentsSlice.actions;
export default doctorAppointmentsSlice.reducer;