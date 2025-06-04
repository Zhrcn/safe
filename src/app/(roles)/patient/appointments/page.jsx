'use client';

import usePatientData from '@/hooks/usePatientData';
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

export default function PatientAppointmentsPage() {
  const { 
    appointments, 
    loading, 
    error,
    refresh 
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

  // New appointment dialog error
  const [dialogError, setDialogError] = useState('');
  const [rescheduleDialogError, setRescheduleDialogError] = useState('');
  const [cancelDialogError, setCancelDialogError] = useState('');

  useEffect(() => {
    if (appointments.length > 0) {
      const today = new Date();

      // For past appointments, only include completed and cancelled
      const past = appointments.filter(appointment => {
        return appointment.status === 'completed' || appointment.status === 'cancelled' ||
          (appointment.date && new Date(appointment.date + 'T' + (appointment.time || '00:00')) < today);
      }).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

      // For upcoming appointments, include pending, scheduled and any that aren't completed/cancelled
      const upcoming = appointments.filter(appointment => {
        // Include all pending appointments regardless of date
        if (appointment.status === 'pending') return true;

        // For scheduled appointments, check the date
        return appointment.status !== 'completed' &&
          appointment.status !== 'cancelled' &&
          (!appointment.date || new Date(appointment.date + 'T' + (appointment.time || '00:00')) >= today);
      }).sort((a, b) => {
        // Sort by date if available, otherwise by creation date
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
    // Clear any previous dialog errors
    setDialogError('');

    if (!selectedDoctor || !appointmentReason || !timeSlot) {
      setDialogError('Please fill in all fields');
      return;
    }

    // Check for existing appointments with this doctor
    if (checkExistingAppointment(selectedDoctor.id)) {
      setDialogError('You already have a pending or scheduled appointment with this doctor.');
      return;
    }

    try {
      console.log('Selected doctor:', selectedDoctor);

      const appointmentData = {
        doctorId: selectedDoctor.id, // Using camelCase and ensuring it's a string
        reason: appointmentReason,
        timeSlot: timeSlot,
      };

      console.log('Sending appointment data:', appointmentData);
      // await scheduleAppointment(appointmentData);
      setSuccess('Appointment request sent successfully! The doctor will review and confirm.');
      setError('');
      refresh();
      handleDialogClose();
    } catch (error) {
      console.error('Appointment scheduling error:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));

      // Handle specific error cases
      if (error.message && error.message.includes('Appointment exists')) {
        setDialogError('You already have a pending or scheduled appointment with this doctor.');
      } else {
        setDialogError(error.message || 'Failed to schedule appointment. Please try again.');
      }
    }
  };

  const handleRescheduleAppointment = async () => {
    try {
      // Clear any previous errors
      setRescheduleDialogError('');

      if (!selectedAppointment || !newDate || !newTimeSlot) {
        setRescheduleDialogError('Please fill in all required fields');
        return;
      }

      // Check if the appointment is at least 3 days away
      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const today = new Date();
      const daysDifference = differenceInDays(appointmentDate, today);
      if (daysDifference < 3) {
        setRescheduleDialogError('Appointments can only be rescheduled at least 3 days in advance');
        return;
      }

      // Check if the new date is at least 3 days in the future
      const newAppointmentDate = new Date(newDate);
      const newDiffTime = newAppointmentDate.getTime() - today.getTime();
      const newDiffDays = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
      if (newDiffDays < 3) {
        setRescheduleDialogError('New appointment date must be at least 3 days in the future');
        return;
      }

      // Prepare update data with time Slot instead of time
      const updateData = {
        date: newDate,
        time_slot: newTimeSlot,
        status: 'Rescheduled'
      };

      setError(null);
      // await updateAppointment(selectedAppointment.id, updateData);

      // Refresh appointments list to get the latest data from the database
      refresh();

      setSuccess('Appointment rescheduled successfully!');
      handleDialogClose();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setRescheduleDialogError('Failed to reschedule appointment. ' + (error.message || 'Please try again later.'));
    }
  };

  const handleCancelAppointment = async () => {
    try {
      // Clear any previous errors
      setCancelDialogError('');

      if (!selectedAppointment) {
        return;
      }

      // Check if appointment is at least 3 days in the future
      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const today = new Date();
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 3) {
        setCancelDialogError('Appointments can only be cancelled at least 3 days in advance');
        return;
      }

      setError(null);
      // Pass the cancellation reason to the backend
      // await cancelAppointment(selectedAppointment.id, cancelReason);

      // Refresh appointments list to get the latest data from the database
      refresh();

      setSuccess('Appointment cancelled successfully!');
      handleDialogClose();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setCancelDialogError('Failed to cancel appointment: ' + (error.message || 'Please try again later.'));
    }
  };

  const canReschedule = (appointment) => {
    // Can't reschedule pending appointments
    if (appointment.status === 'pending') return false;

    // Can't reschedule completed or cancelled appointments
    if (appointment.status === 'completed' || appointment.status === 'cancelled') return false;

    // If there's no date set, can't reschedule
    if (!appointment.date) return false;

    // Check if appointment is at least 3 days away
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    const daysDifference = differenceInDays(appointmentDate, today);

    return daysDifference >= 3;
  };

  const renderAppointmentCard = (appointment) => {
    // Handle pending appointments that don't have a date yet
    const isPending = appointment.status === 'pending';
    const hasDate = !!appointment.date;

    // Format date if available, otherwise show pending status
    let dateDisplay = 'Awaiting doctor confirmation';
    let timeDisplay = 'To be scheduled';
    let locationDisplay = 'To be determined';

    if (hasDate) {
      const appointmentDate = new Date(appointment.date);
      dateDisplay = format(appointmentDate, 'MMMM d, yyyy');
      timeDisplay = appointment.time || 'To be scheduled';
      locationDisplay = appointment.location || 'To be determined';
    }

    // Get doctor name and specialty
    const doctorName = appointment.doctorId?.name || appointment.doctorName || 'Doctor';
    const doctorSpecialty = appointment.doctorId?.doctorProfile?.specialization ||
      appointment.doctorSpecialty || 'Specialist';

    return (
      <PatientCard
        key={appointment._id || appointment.id}
        className="mb-4"
        title={`Appointment with ${doctorName}`}
        subtitle={doctorSpecialty}
        actions={<AppointmentStatusBadge status={appointment.status} />}
      >
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={12} sm={6}>
            <Box className="flex items-center mb-2">
              <Calendar size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">{dateDisplay}</Typography>
            </Box>
            <Box className="flex items-center mb-2">
              <Clock size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">{timeDisplay}</Typography>
            </Box>
            <Box className="flex items-center">
              <MapPin size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">{locationDisplay}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="flex items-start mb-2">
              <FileText size={16} className="mr-2 mt-1 text-muted-foreground" />
              <Typography variant="body2">
                {isPending ? 'Reason: ' + (appointment.reason || 'General checkup') : (appointment.notes || 'No notes')}
              </Typography>
            </Box>
            {isPending && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Waiting for doctor to confirm this appointment
              </Typography>
            )}
          </Grid>
          {!isPending && canReschedule(appointment) && (
            <Grid item xs={12}>
              <Divider className="my-2" />
              <Box className="flex justify-end space-x-2">
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<X size={16} />}
                  onClick={() => handleCancelOpen(appointment)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshCw size={16} />}
                  onClick={() => handleRescheduleOpen(appointment)}
                >
                  Reschedule
                </Button>
              </Box>
            </Grid>
          )}
          {isPending && (
            <Grid item xs={12}>
              <Divider className="my-2" />
              <Box className="flex justify-end space-x-2">
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<X size={16} />}
                  onClick={() => handleCancelOpen(appointment)}
                >
                  Cancel Request
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </PatientCard>
    );
  };

  if (loading) {
    return (
      <PatientPageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      </PatientPageContainer>
    );
  }

  if (error) {
    return (
      <PatientPageContainer>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={refresh} startIcon={<RefreshCw />}>
            Retry
          </Button>
        </Box>
      </PatientPageContainer>
    );
  }

  return (
    <PatientPageContainer
      title="Appointments"
      description="View and manage your medical appointments"
    >
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box className="flex justify-between items-center mb-6">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="bg-background"
        >
          <Tab label="Upcoming" />
          <Tab label="Past" />
        </Tabs>

        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          className="bg-primary text-primary-foreground"
          onClick={() => handleNewAppointmentOpen()}
        >
          New Appointment
        </Button>
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center py-12">
          <Typography variant="body1">Loading appointments...</Typography>
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && (
            <>
              {upcomingAppointments.length === 0 ? (
                <Box className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <Typography variant="h6" className="mb-2">No Upcoming Appointments</Typography>
                  <Typography variant="body2" className="text-muted-foreground mb-4">
                    You don't have any upcoming appointments scheduled.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleNewAppointmentOpen()}
                    className="mx-auto"
                  >
                    Schedule an Appointment
                  </Button>
                </Box>
              ) : (
                upcomingAppointments.map(appointment => renderAppointmentCard(appointment))
              )}
            </>
          )}

          {tabValue === 1 && (
            <>
              {pastAppointments.length === 0 ? (
                <Box className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <Typography variant="h6" className="mb-2">No Past Appointments</Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    You don't have any past appointment records.
                  </Typography>
                </Box>
              ) : (
                pastAppointments.map(appointment => renderAppointmentCard(appointment))
              )}
            </>
          )}
        </Box>
      )}

      {/* New Appointment Dialog */}
      <Dialog
        open={newAppointmentDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-primary text-primary-foreground">
          Schedule New Appointment
        </DialogTitle>
        <DialogContent className="mt-4">
          {dialogError && (
            <Alert severity="error" className="mb-4" onClose={() => setDialogError('')}>
              {dialogError}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="time-slot-label">Time Slot</InputLabel>
                <Select
                  labelId="time-slot-label"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  label="Time Slot"
                >
                  <MenuItem value="morning">Morning (9:00 AM - 12:00 PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (1:00 PM - 5:00 PM)</MenuItem>
                  <MenuItem value="evening">Evening (6:00 PM - 9:00 PM)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Appointment"
                multiline
                rows={4}
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="bg-muted/30 p-3">
          <Button
            onClick={handleDialogClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleScheduleAppointment}
            disabled={!appointmentReason || !timeSlot}
            className="bg-primary text-primary-foreground"
          >
            Schedule Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog
        open={rescheduleDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-primary text-primary-foreground">
          Reschedule Appointment
        </DialogTitle>
        <DialogContent className="mt-4">
          {rescheduleDialogError && (
            <Alert severity="error" className="mb-4" onClose={() => setRescheduleDialogError('')}>
              {rescheduleDialogError}
            </Alert>
          )}

          {selectedAppointment && (
            <>
              <Box className="mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  Current Appointment
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.doctorName} - {selectedAppointment.doctorSpecialty}
                </Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {format(new Date(selectedAppointment.date), 'MMMM d, yyyy')} at {selectedAppointment.time}
                </Typography>
              </Box>

              <Alert severity="info" className="mb-4">
                Appointments can only be rescheduled at least 3 days in advance.
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: format(addDays(new Date(), 3), 'yyyy-MM-dd') }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="new-time-slot-label">New Time</InputLabel>
                    <Select
                      labelId="new-time-slot-label"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      label="New Time"
                    >
                      <MenuItem value="morning">Morning (9:00 AM)</MenuItem>
                      <MenuItem value="afternoon">Afternoon (1:00 PM)</MenuItem>
                      <MenuItem value="evening">Evening (6:00 PM)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-muted/30 p-3">
          <Button
            onClick={handleDialogClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRescheduleAppointment}
            disabled={!newDate || !newTimeSlot}
            className="bg-primary text-primary-foreground"
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-primary text-primary-foreground">
          Cancel Appointment
        </DialogTitle>
        <DialogContent className="mt-4">
          {cancelDialogError && (
            <Alert severity="error" className="mb-4" onClose={() => setCancelDialogError('')}>
              {cancelDialogError}
            </Alert>
          )}

          {selectedAppointment && (
            <>
              <Alert severity="warning" className="mb-4">
                Are you sure you want to cancel this appointment? Appointments can only be cancelled at least 3 days in advance.
              </Alert>

              <Box className="mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  Appointment Details
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.doctorName} - {selectedAppointment.doctorSpecialty}
                </Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {format(new Date(selectedAppointment.date), 'MMMM d, yyyy')} at {selectedAppointment.time}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Reason for Cancellation"
                multiline
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-muted/30 p-3">
          <Button
            onClick={handleDialogClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelAppointment}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </PatientPageContainer>
  );
}
