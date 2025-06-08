'use client';

import { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Button, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Divider, IconButton, Tooltip, Alert, CircularProgress
} from '@mui/material';
import {
  Calendar, Clock, MapPin, FileText, AlertCircle, RefreshCw,
  Plus, X, Check, ChevronRight
} from 'lucide-react';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { PatientPageContainer, PatientCard, AppointmentStatusBadge } from '@/components/patient/PatientComponents';
import {
  useGetAppointmentsQuery,
  useScheduleAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useGetAvailableTimeSlotsQuery
} from '@/lib/redux/services/appointmentApi';

export default function PatientAppointmentsPage() {
  const { 
    data: appointmentsData,
    isLoading: appointmentsLoading,
    error: appointmentsError,
    refetch: refreshAppointments
  } = useGetAppointmentsQuery();

  const [scheduleAppointment] = useScheduleAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const [tabValue, setTabValue] = useState(0);
  const [success, setSuccess] = useState(null);

  // New appointment dialog
  const [newAppointmentDialog, setNewAppointmentDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  // Reschedule dialog
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Cancel dialog
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Filtered appointments
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  // Dialog errors
  const [dialogError, setDialogError] = useState('');
  const [rescheduleDialogError, setRescheduleDialogError] = useState('');
  const [cancelDialogError, setCancelDialogError] = useState('');

  useEffect(() => {
    if (appointmentsData?.appointments?.length > 0) {
      const today = new Date();

      // For past appointments, only include completed and cancelled
      const past = appointmentsData.appointments.filter(appointment => {
        return appointment.status === 'completed' || appointment.status === 'cancelled' ||
          (appointment.date && new Date(appointment.date + 'T' + (appointment.time || '00:00')) < today);
      }).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

      // For upcoming appointments, include pending, scheduled and any that aren't completed/cancelled
      const upcoming = appointmentsData.appointments.filter(appointment => {
        if (appointment.status === 'pending') return true;

        return appointment.status !== 'completed' &&
          appointment.status !== 'cancelled' &&
          (!appointment.date || new Date(appointment.date + 'T' + (appointment.time || '00:00')) >= today);
      }).sort((a, b) => {
        const dateA = a.date ? new Date(a.date + 'T' + (a.time || '00:00')) : new Date(a.createdAt || 0);
        const dateB = b.date ? new Date(b.date + 'T' + (b.time || '00:00')) : new Date(b.createdAt || 0);
        return dateA - dateB;
      });

      setPastAppointments(past);
      setUpcomingAppointments(upcoming);
    }
  }, [appointmentsData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewAppointmentOpen = (doctor = null) => {
    setSelectedDoctor(doctor);
    setNewAppointmentDialog(true);
  };

  const handleRescheduleOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate('');
    setNewTime('');
    setNewTimeSlot('');
    setRescheduleDialog(true);
  };

  const handleCancelOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason('');
    setCancelDialog(true);
  };

  const handleDialogClose = () => {
    setNewAppointmentDialog(false);
    setRescheduleDialog(false);
    setCancelDialog(false);
    setSelectedDoctor(null);
    setSelectedAppointment(null);
    setAppointmentReason('');
    setNewDate('');
    setNewTime('');
    setNewTimeSlot('');
    setCancelReason('');
    setTimeSlot('');
    setDialogError('');
    setRescheduleDialogError('');
    setCancelDialogError('');
  };

  const handleScheduleAppointment = async () => {
    setDialogError('');

    if (!selectedDoctor || !appointmentReason || !timeSlot) {
      setDialogError('Please fill in all fields');
      return;
    }

    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        reason: appointmentReason,
        timeSlot: timeSlot,
      };

      await scheduleAppointment(appointmentData).unwrap();
      setSuccess('Appointment request sent successfully! The doctor will review and confirm.');
      refreshAppointments();
      handleDialogClose();
    } catch (error) {
      console.error('Appointment scheduling error:', error);
      setDialogError(error.data?.message || 'Failed to schedule appointment. Please try again.');
    }
  };

  const handleRescheduleAppointment = async () => {
    try {
      setRescheduleDialogError('');

      if (!selectedAppointment || !newDate || !newTimeSlot) {
        setRescheduleDialogError('Please fill in all required fields');
        return;
      }

      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const today = new Date();
      const daysDifference = differenceInDays(appointmentDate, today);
      if (daysDifference < 3) {
        setRescheduleDialogError('Appointments can only be rescheduled at least 3 days in advance');
        return;
      }

      const newAppointmentDate = new Date(newDate);
      const newDiffTime = newAppointmentDate.getTime() - today.getTime();
      const newDiffDays = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
      if (newDiffDays < 3) {
        setRescheduleDialogError('New appointment date must be at least 3 days in the future');
        return;
      }

      const updateData = {
        date: newDate,
        time_slot: newTimeSlot,
        status: 'Rescheduled'
      };

      await updateAppointment({
        appointmentId: selectedAppointment.id,
        updateData
      }).unwrap();

      refreshAppointments();
      setSuccess('Appointment rescheduled successfully!');
      handleDialogClose();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setRescheduleDialogError('Failed to reschedule appointment. ' + (error.data?.message || 'Please try again later.'));
    }
  };

  const handleCancelAppointment = async () => {
    try {
      setCancelDialogError('');

      if (!selectedAppointment) {
        return;
      }

      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const today = new Date();
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 3) {
        setCancelDialogError('Appointments can only be cancelled at least 3 days in advance');
        return;
      }

      await cancelAppointment({
        appointmentId: selectedAppointment.id,
        reason: cancelReason
      }).unwrap();

      refreshAppointments();
      setSuccess('Appointment cancelled successfully!');
      handleDialogClose();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setCancelDialogError('Failed to cancel appointment. ' + (error.data?.message || 'Please try again later.'));
    }
  };

  const canReschedule = (appointment) => {
    if (!appointment.date || !appointment.time) return false;
    const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3 && appointment.status === 'scheduled';
  };

  const renderAppointmentCard = (appointment) => {
    const isPast = appointment.status === 'completed' || appointment.status === 'cancelled' ||
      (appointment.date && new Date(appointment.date + 'T' + (appointment.time || '00:00')) < new Date());

    return (
      <PatientCard
        key={appointment.id}
        title={`Appointment with Dr. ${appointment.doctorName || 'Unknown'}`}
        subtitle={appointment.specialty || 'General Consultation'}
        status={<AppointmentStatusBadge status={appointment.status} />}
        date={appointment.date ? format(parseISO(appointment.date), 'MMMM d, yyyy') : 'Date TBD'}
        time={appointment.time || 'Time TBD'}
        location={appointment.location || 'Virtual Consultation'}
        actions={
          !isPast && (
            <Box className="flex space-x-2">
              {canReschedule(appointment) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleRescheduleOpen(appointment)}
                >
                  Reschedule
                </Button>
              )}
              {appointment.status === 'scheduled' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleCancelOpen(appointment)}
                >
                  Cancel
                </Button>
              )}
            </Box>
          )
        }
      />
    );
  };

  if (appointmentsLoading) {
    return (
      <PatientPageContainer>
        <Box className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress />
        </Box>
      </PatientPageContainer>
    );
  }

  if (appointmentsError) {
    return (
      <PatientPageContainer>
        <Box className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Appointments
          </Typography>
          <Typography color="text.secondary">
            {appointmentsError.data?.message || 'Failed to load appointments. Please try again later.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => refreshAppointments()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </PatientPageContainer>
    );
  }

  return (
    <PatientPageContainer>
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          My Appointments
        </Typography>
        <Typography color="text.secondary">
          Manage your upcoming and past appointments
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Box className="mb-6">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={() => handleNewAppointmentOpen()}
        >
          Schedule New Appointment
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Upcoming (${upcomingAppointments.length})`} />
          <Tab label={`Past (${pastAppointments.length})`} />
        </Tabs>
      </Box>

      <Box className="space-y-4">
        {tabValue === 0 ? (
          upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <Box className="text-center py-8">
              <Typography color="text.secondary">
                No upcoming appointments
              </Typography>
            </Box>
          )
        ) : (
          pastAppointments.length > 0 ? (
            pastAppointments.map(renderAppointmentCard)
          ) : (
            <Box className="text-center py-8">
              <Typography color="text.secondary">
                No past appointments
              </Typography>
            </Box>
          )
        )}
      </Box>

      {/* New Appointment Dialog */}
      <Dialog
        open={newAppointmentDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dialogError}
            </Alert>
          )}
          <Box className="space-y-4 mt-4">
            <FormControl fullWidth>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                value={selectedDoctor?.id || ''}
                onChange={(e) => setSelectedDoctor({ id: e.target.value })}
                label="Select Doctor"
              >
                <MenuItem value="1">Dr. John Smith (Cardiology)</MenuItem>
                <MenuItem value="2">Dr. Sarah Johnson (Pediatrics)</MenuItem>
                <MenuItem value="3">Dr. Michael Brown (Neurology)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Reason for Visit"
              multiline
              rows={3}
              value={appointmentReason}
              onChange={(e) => setAppointmentReason(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Preferred Time Slot</InputLabel>
              <Select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                label="Preferred Time Slot"
              >
                <MenuItem value="morning">Morning (9:00 AM - 12:00 PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (1:00 PM - 4:00 PM)</MenuItem>
                <MenuItem value="evening">Evening (4:00 PM - 7:00 PM)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScheduleAppointment}
            disabled={!selectedDoctor || !appointmentReason || !timeSlot}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          {rescheduleDialogError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rescheduleDialogError}
            </Alert>
          )}
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="New Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>New Time Slot</InputLabel>
              <Select
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                label="New Time Slot"
              >
                <MenuItem value="morning">Morning (9:00 AM - 12:00 PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (1:00 PM - 4:00 PM)</MenuItem>
                <MenuItem value="evening">Evening (4:00 PM - 7:00 PM)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRescheduleAppointment}
            disabled={!newDate || !newTimeSlot}
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          {cancelDialogError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cancelDialogError}
            </Alert>
          )}
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Reason for Cancellation"
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Back</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelAppointment}
            disabled={!cancelReason}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </PatientPageContainer>
  );
} 