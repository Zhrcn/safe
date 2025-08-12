import { store } from '@/store/index';
import { fetchAppointments } from '@/store/slices/patient/appointmentsSlice';
import { fetchDoctorAppointments } from '@/store/slices/doctor/doctorAppointmentsSlice';

export const refetchAppointments = () => {
  const state = store.getState();
  const userRole = state.auth?.user?.role;
  
  console.log('🔄 Appointment utils: Refetching appointments for role:', userRole);
  
  if (userRole === 'patient') {
    store.dispatch(fetchAppointments());
  } else if (userRole === 'doctor') {
    store.dispatch(fetchDoctorAppointments());
  }
};

export const isAppointmentOwner = (appointment, userId, userRole) => {
  if (userRole === 'patient') {
    return appointment.patient?.user?._id === userId || appointment.patient?.user === userId;
  } else if (userRole === 'doctor') {
    return appointment.doctor?.user?._id === userId || appointment.doctor?.user === userId;
  }
  return false;
};

export const formatAppointmentStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'completed': 'Completed',
    'rescheduled': 'Rescheduled',
    'reschedule_requested': 'Reschedule Requested',
    'scheduled': 'Scheduled'
  };
  
  return statusMap[status] || status;
};

export const getAppointmentStatusColor = (status) => {
  const colorMap = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
    'accepted': 'bg-green-100 text-green-800 border-green-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'rescheduled': 'bg-purple-100 text-purple-800 border-purple-200',
    'reschedule_requested': 'bg-orange-100 text-orange-800 border-orange-200',
    'scheduled': 'bg-blue-100 text-blue-800 border-blue-200'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const canModifyAppointment = (appointment, userRole) => {
  const now = new Date();
  const appointmentDate = new Date(appointment.date);
  const hoursDiff = (appointmentDate - now) / (1000 * 60 * 60);
  
  const timeConstraint = hoursDiff >= 24;
  
  const allowedStatuses = ['pending', 'confirmed', 'accepted', 'scheduled', 'rescheduled'];
  const statusConstraint = allowedStatuses.includes(appointment.status);
  
  return timeConstraint && statusConstraint;
};

export const getAppointmentActions = (appointment, userRole, canModify) => {
  const actions = [];
  
  if (userRole === 'patient') {
    if (appointment.status === 'pending' && canModify) {
      actions.push('cancel');
    }
    if (['accepted', 'scheduled', 'rescheduled'].includes(appointment.status) && canModify) {
      actions.push('reschedule', 'cancel');
    }
    if (appointment.status === 'completed') {
      actions.push('confirm');
    }
  } else if (userRole === 'doctor') {
    if (appointment.status === 'pending') {
      actions.push('accept', 'reject');
    }
    if (['accepted', 'scheduled', 'rescheduled'].includes(appointment.status)) {
      actions.push('update', 'complete', 'cancel');
    }
    if (appointment.status === 'reschedule_requested') {
      actions.push('approve_reschedule', 'reject_reschedule');
    }
  }
  
  return actions;
}; 