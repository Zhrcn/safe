'use client';

import usePatientData from '@/hooks/usePatientData';
import {
  Typography, Box, Grid, Button, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Divider, IconButton, Tooltip, Alert, CircularProgress, Avatar
} from '@mui/material';
import {
  Calendar, Clock, MapPin, FileText, AlertCircle, RefreshCw,
  Plus, X, Check, ChevronRight, User
} from 'lucide-react';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { PatientPageContainer, PatientCard, AppointmentStatusBadge } from '@/components/patient/PatientComponents';
import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/lib/services/api';
import { useNotification } from '@/components/ui/Notification';

export default function PatientAppointmentsPage() {
  const { showNotification } = useNotification();
  const { 
    appointments, 
    loading, 
    error,
    refresh, 
    doctors
  } = usePatientData();

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
    if (appointments?.length > 0) {
      const today = new Date();

      // For past appointments, only include completed and cancelled
      const past = appointments.filter(appointment => {
        return appointment.status === 'completed' || appointment.status === 'cancelled' ||
          (appointment.date && new Date(appointment.date + 'T' + (appointment.time || '00:00')) < today);
      }).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

      // For upcoming appointments, include pending, scheduled and any that aren't completed/cancelled
      const upcoming = appointments.filter(appointment => {
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
  }, [appointments]);

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

    if (checkExistingAppointment(selectedDoctor._id)) {
      setDialogError('You already have a pending or scheduled appointment with this doctor.');
      return;
    }

    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        reason: appointmentReason,
        timeSlot: timeSlot,
      };

      await appointmentsApi.scheduleAppointment(appointmentData);
      
      showNotification({
        message: 'Appointment request sent successfully! The doctor will review and confirm.',
        severity: 'success',
      });
      
      refresh();
      handleDialogClose();
    } catch (error) {
      console.error('Appointment scheduling error:', error);
      setDialogError(error.message || 'Failed to schedule appointment. Please try again.');
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

      await appointmentsApi.updateAppointment(selectedAppointment._id, updateData);
      
      showNotification({
        message: 'Appointment rescheduled successfully!',
        severity: 'success',
      });
      
      refresh();
      handleDialogClose();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setRescheduleDialogError('Failed to reschedule appointment. ' + (error.message || 'Please try again later.'));
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

      await appointmentsApi.cancelAppointment(selectedAppointment._id, cancelReason);
      
      showNotification({
        message: 'Appointment cancelled successfully!',
        severity: 'success',
      });
      
      refresh();
      handleDialogClose();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setCancelDialogError('Failed to cancel appointment. ' + (error.message || 'Please try again later.'));
    }
  };

  const checkExistingAppointment = (doctorId) => {
    return upcomingAppointments.some(appt => 
      appt.doctorId === doctorId && 
      (appt.status === 'pending' || appt.status === 'scheduled')
    );
  };

  const canReschedule = (appointment) => {
    if (!appointment.date || !appointment.time) return false;
    const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3 && appointment.status === 'scheduled';
  };

  const canCancel = (appointment) => {
    if (!appointment.date || !appointment.time) return false;
    const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3 && appointment.status === 'scheduled';
  };

  const renderAppointmentCard = (appointment) => {
    const doctor = doctors?.find(doc => doc._id === appointment.doctorId);
    const doctorName = doctor ? 
      (doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || `Dr. (ID: ${doctor._id.slice(-4)})`) :
      `Doctor (ID: ${appointment.doctorId?.slice(-4) || 'Unknown'})`;

    const specialty = doctor?.specialty || 'N/A';

    return (
      <PatientCard
        key={appointment._id}
        title={`Appointment with ${doctorName}`}
        subtitle={specialty}
        status={<AppointmentStatusBadge status={appointment.status} />}
        date={appointment.date ? format(parseISO(appointment.date), 'MMMM d, yyyy') : 'Date TBD'}
        time={appointment.time || 'Time TBD'}
        location={appointment.location || 'Virtual Consultation'}
        actions={
          <Box className="flex space-x-2">
            {canReschedule(appointment) && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleRescheduleOpen(appointment)}
                startIcon={<RefreshCw size={16} />}
              >
                Reschedule
              </Button>
            )}
            {canCancel(appointment) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleCancelOpen(appointment)}
                startIcon={<X size={16} />}
              >
                Cancel
              </Button>
            )}
          </Box>
        }
      />
    );
  };

  if (loading) {
    return (
      <PatientPageContainer>
        <Box className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress />
        </Box>
      </PatientPageContainer>
    );
  }

  if (error) {
    return (
      <PatientPageContainer>
        <Box className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Appointments
          </Typography>
          <Typography color="text.secondary">
            {error.message || 'Failed to load appointments. Please try again later.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={refresh}
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
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Box className="mb-4 md:mb-0">
          <Typography variant="h4" className="font-bold mb-2">My Appointments</Typography>
          <Typography color="text.secondary">View and manage your upcoming and past medical appointments.</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={() => handleNewAppointmentOpen()}
          className="bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          Schedule New Appointment
        </Button>
      </Box>

      {success && (
        <Alert severity="success" className="mb-4">{success}</Alert>
      )}

      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="appointment tabs"
          className="mb-4"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`Upcoming (${upcomingAppointments.length})`} />
          <Tab label={`Past (${pastAppointments.length})`} />
        </Tabs>

        {tabValue === 0 && (
          <Box className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(renderAppointmentCard)
            ) : (
              <Box className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Typography color="text.secondary">No upcoming appointments.</Typography>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map(renderAppointmentCard)
            ) : (
              <Box className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Typography color="text.secondary">No past appointments.</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* New Appointment Dialog */}
      <Dialog open={newAppointmentDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle className="text-xl font-bold py-4 px-6 bg-gray-100 dark:bg-gray-700">Schedule New Appointment</DialogTitle>
        <DialogContent className="p-6 space-y-4">
          {dialogError && (
            <Alert severity="error" className="mb-4">{dialogError}</Alert>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor?._id || ''}
              onChange={(e) => setSelectedDoctor(doctors.find(doc => doc._id === e.target.value))}
              label="Select Doctor"
            >
              {doctors?.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  <Box className="flex items-center">
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      <User size={16} />
                    </Avatar>
                    {doctor.name || `${doctor.firstName} ${doctor.lastName}`}
                    <Typography variant="body2" color="text.secondary" className="ml-2">
                      ({doctor.specialty})
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Reason for Appointment"
            value={appointmentReason}
            onChange={(e) => setAppointmentReason(e.target.value)}
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Preferred Time Slot</InputLabel>
            <Select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              label="Preferred Time Slot"
            >
              <MenuItem value="morning">Morning (9 AM - 12 PM)</MenuItem>
              <MenuItem value="afternoon">Afternoon (1 PM - 5 PM)</MenuItem>
              <MenuItem value="evening">Evening (6 PM - 9 PM)</MenuItem>
              <MenuItem value="any">Any (Flexible)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button onClick={handleDialogClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Cancel</Button>
          <Button 
            onClick={handleScheduleAppointment} 
            variant="contained" 
            color="primary" 
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-md"
            disabled={!selectedDoctor || !appointmentReason || !timeSlot}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent dividers>
          {rescheduleDialogError && (
            <Alert severity="error" className="mb-4">{rescheduleDialogError}</Alert>
          )}
          <Typography variant="subtitle1" className="mb-2">Current Appointment Details:</Typography>
          {selectedAppointment && (
            <Box className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
              <Typography variant="body2">Doctor: {selectedAppointment.doctorName}</Typography>
              <Typography variant="body2">Date: {format(parseISO(selectedAppointment.date), 'PPP')}</Typography>
              <Typography variant="body2">Time: {selectedAppointment.time}</Typography>
              <Typography variant="body2">Reason: {selectedAppointment.reason}</Typography>
            </Box>
          )}

          <TextField
            margin="normal"
            fullWidth
            type="date"
            label="New Date"
            InputLabelProps={{
              shrink: true,
            }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>New Preferred Time Slot</InputLabel>
            <Select
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              label="New Preferred Time Slot"
            >
              <MenuItem value="morning">Morning (9 AM - 12 PM)</MenuItem>
              <MenuItem value="afternoon">Afternoon (1 PM - 5 PM)</MenuItem>
              <MenuItem value="evening">Evening (6 PM - 9 PM)</MenuItem>
              <MenuItem value="any">Any (Flexible)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleRescheduleAppointment} 
            variant="contained" 
            color="primary"
            disabled={!newDate || !newTimeSlot}
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent dividers>
          {cancelDialogError && (
            <Alert severity="error" className="mb-4">{cancelDialogError}</Alert>
          )}
          <Typography variant="subtitle1" className="mb-2">Confirm Cancellation:</Typography>
          {selectedAppointment && (
            <Box className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
              <Typography variant="body2">Doctor: {selectedAppointment.doctorName}</Typography>
              <Typography variant="body2">Date: {format(parseISO(selectedAppointment.date), 'PPP')}</Typography>
              <Typography variant="body2">Time: {selectedAppointment.time}</Typography>
              <Typography variant="body2">Reason: {selectedAppointment.reason}</Typography>
            </Box>
          )}
          <TextField
            margin="normal"
            fullWidth
            label="Reason for Cancellation (Optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Back</Button>
          <Button 
            onClick={handleCancelAppointment} 
            variant="contained" 
            color="error"
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </PatientPageContainer>
  );
}
