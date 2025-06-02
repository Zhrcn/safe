'use client';

import React, { useState, useEffect } from 'react';
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
import { getAppointments, scheduleAppointment, cancelAppointment, updateAppointment, getDoctors } from '@/services/patientService';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [doctors, setDoctors] = useState([]);
  
  // New appointment dialog
  const [newAppointmentDialog, setNewAppointmentDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
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

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);
  
  const loadDoctors = async () => {
    try {
      setDoctorsLoading(true);
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
      // Don't show error to user, just log it
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    if (appointments.length > 0) {
      const today = new Date();
      
      const past = appointments.filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate < today || appointment.status === 'Completed' || appointment.status === 'Cancelled';
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      const upcoming = appointments.filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate >= today && appointment.status !== 'Completed' && appointment.status !== 'Cancelled';
      }).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setPastAppointments(past);
      setUpcomingAppointments(upcoming);
    }
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewAppointmentOpen = (doctor = null) => {
    setSelectedDoctor(doctor);
    setNewAppointmentDialog(true);
    // If doctors list is empty, load it
    if (doctors.length === 0) {
      loadDoctors();
    }
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
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentReason('');
    setTimeSlot('');
    setNewDate('');
    setNewTime('');
    setNewTimeSlot('');
    setCancelReason('');
  };

  const handleScheduleAppointment = async () => {
    try {
      if (!selectedDoctor || !timeSlot || !appointmentReason) {
        setError('Please fill in all required fields');
        return;
      }

      // Simplified appointment data with just doctor, time slot and reason
      const appointmentData = {
        doctorId: selectedDoctor.id,
        timeSlot: timeSlot,
        reason: appointmentReason
      };

      setError(null);
      const newAppointment = await scheduleAppointment(appointmentData);
      
      // Refresh appointments list to get the latest data
      await loadAppointments();
      
      setSuccess('Appointment scheduled successfully!');
      handleDialogClose();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setError(error.message || 'Failed to schedule appointment. Please try again later.');
    }
  };

  const handleRescheduleAppointment = async () => {
    try {
      if (!selectedAppointment || !newDate || !newTimeSlot) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Check if the appointment is at least 3 days away
      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const today = new Date();
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 3) {
        setError('Appointments can only be rescheduled at least 3 days in advance');
        return;
      }
      
      // Check if the new date is at least 3 days in the future
      const newAppointmentDate = new Date(newDate);
      const newDiffTime = newAppointmentDate.getTime() - today.getTime();
      const newDiffDays = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
      
      if (newDiffDays < 3) {
        setError('New appointment date must be at least 3 days in the future');
        return;
      }

      // Prepare update data with timeSlot instead of time
      const updateData = {
        date: newDate,
        timeSlot: newTimeSlot,
        status: 'Rescheduled'
      };
      
      setError(null);
      await updateAppointment(selectedAppointment.id, updateData);
      
      // Refresh appointments list to get the latest data from the database
      await loadAppointments();
      
      setSuccess('Appointment rescheduled successfully!');
      handleDialogClose();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setError('Failed to reschedule appointment. ' + (error.message || 'Please try again later.'));
    }
  };

  const handleCancelAppointment = async () => {
    try {
      if (!selectedAppointment) {
        return;
      }
      
      // Check if appointment is at least 3 days in the future
      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const today = new Date();
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 3) {
        setError('Appointments can only be cancelled at least 3 days in advance');
        return;
      }
      
      setError(null);
      // Pass the cancellation reason to the backend
      await cancelAppointment(selectedAppointment.id, cancelReason);
      
      // Refresh appointments list to get the latest data from the database
      await loadAppointments();
      
      setSuccess('Appointment cancelled successfully!');
      handleDialogClose();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Failed to cancel appointment: ' + (error.message || 'Please try again later.'));
    }
  };

  const canReschedule = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    const daysDifference = differenceInDays(appointmentDate, today);
    return daysDifference >= 3 && appointment.status !== 'Cancelled' && appointment.status !== 'Completed';
  };

  const renderAppointmentCard = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const formattedDate = format(appointmentDate, 'MMMM d, yyyy');
    
    return (
      <PatientCard 
        key={appointment.id}
        className="mb-4"
        title={`Appointment with ${appointment.doctorName}`}
        subtitle={appointment.doctorSpecialty}
        actions={<AppointmentStatusBadge status={appointment.status} />}
      >
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={12} sm={6}>
            <Box className="flex items-center mb-2">
              <Calendar size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">{formattedDate}</Typography>
            </Box>
            <Box className="flex items-center mb-2">
              <Clock size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">{appointment.time}</Typography>
            </Box>
            <Box className="flex items-center">
              <MapPin size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">{appointment.location}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="flex items-start mb-2">
              <FileText size={16} className="mr-2 mt-1 text-muted-foreground" />
              <Typography variant="body2">{appointment.notes}</Typography>
            </Box>
          </Grid>
          {canReschedule(appointment) && (
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
        </Grid>
      </PatientCard>
    );
  };

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
          {!selectedDoctor && (doctorsLoading || doctors.length === 0) ? (
            <Box className="text-center py-4">
              <CircularProgress size={24} className="mb-2" />
              <Typography variant="body1">Loading available doctors...</Typography>
            </Box>
          ) : !selectedDoctor ? (
            <>
              <Typography variant="body1" className="mb-4">
                Please select a doctor for your appointment:
              </Typography>
              <FormControl fullWidth className="mb-4">
                <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
                <Select
                  labelId="doctor-select-label"
                  value={selectedDoctor ? selectedDoctor.id : ''}
                  onChange={(e) => {
                    const doctor = doctors.find(d => d.id === e.target.value);
                    setSelectedDoctor(doctor);
                  }}
                  label="Select Doctor"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <Box className="mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  Doctor Information
                </Typography>
                <Typography variant="body1">
                  {selectedDoctor.name} - {selectedDoctor.specialty}
                </Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {selectedDoctor.hospital}
                </Typography>
              </Box>
              
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
                      <MenuItem value="morning">Morning (9:00 AM)</MenuItem>
                      <MenuItem value="afternoon">Afternoon (1:00 PM)</MenuItem>
                      <MenuItem value="evening">Evening (6:00 PM)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Visit"
                    multiline
                    rows={4}
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                  />
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
          {selectedDoctor ? (
            <Button 
              variant="contained"
              onClick={handleScheduleAppointment}
              disabled={!timeSlot || !appointmentReason}
              className="bg-primary text-primary-foreground"
            >
              Schedule Appointment
            </Button>
          ) : doctors.length > 0 ? (
            <Button 
              variant="contained"
              onClick={() => {
                // This button is now disabled until a doctor is selected from the dropdown
                if (selectedDoctor) {
                  handleScheduleAppointment();
                }
              }}
              disabled={true} // Disabled until a doctor is selected
              className="bg-primary text-primary-foreground"
            >
              Select a Doctor First
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={() => {
                handleDialogClose();
                window.location.href = '/patient/providers';
              }}
              className="bg-primary text-primary-foreground"
            >
              Go to Providers
            </Button>
          )}
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
