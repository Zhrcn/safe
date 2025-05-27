'use client';

import { Typography, Card, CardContent, Box, Button, List, ListItem, ListItemText, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, IconButton } from '@mui/material';
import { CalendarPlus, Eye, Clock, User, FileText, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

// Mock Appointments Data (replace with actual data fetching)
const mockAppointments = [
  { id: 1, patientName: 'Patient A', date: '2024-06-21', time: '10:00 AM', reason: 'Follow-up', status: 'upcoming', notes: 'Review medication effectiveness' },
  { id: 2, patientName: 'Patient B', date: '2024-06-21', time: '11:00 AM', reason: 'New Consultation', status: 'today', notes: 'Initial assessment for chronic headaches' },
  { id: 3, patientName: 'Patient C', date: '2024-06-20', time: '02:00 PM', reason: 'Check-up', status: 'past', notes: 'Routine annual check-up, all vitals normal' },
  { id: 4, patientName: 'Patient D', date: '2024-06-21', time: '01:00 PM', reason: 'Vaccination', status: 'today', notes: 'Scheduled for flu vaccine' },
  { id: 5, patientName: 'Patient E', date: '2024-06-22', time: '09:00 AM', reason: 'Annual Physical', status: 'upcoming', notes: 'Complete physical examination' },
];

// Mock Patients Data for appointment scheduling
const mockPatients = [
  { id: 1, name: 'Patient A' },
  { id: 2, name: 'Patient B' },
  { id: 3, name: 'Patient C' },
  { id: 4, name: 'Patient D' },
  { id: 5, name: 'Patient E' },
  { id: 6, name: 'Patient F' },
];

// Helper component for displaying appointment cards
function AppointmentCard({ appointment, onViewDetails }) {
  return (
    <Card className="shadow-lg rounded-lg border border-border bg-card text-card-foreground transition-colors duration-200 hover:shadow-xl">
      <CardContent>
        <Box className="flex items-center mb-3">
          <User size={24} className="mr-3 text-primary" />
          <Typography variant="h6" component="div" className="font-semibold text-foreground">{appointment.patientName}</Typography>
        </Box>
        <Box className="space-y-2 text-muted-foreground">
          <Typography variant="body2" className="flex items-center"><Clock size={16} className="mr-2 text-muted-foreground" />{appointment.time} on {appointment.date}</Typography>
          <Typography variant="body2" className="flex items-center"><FileText size={16} className="mr-2 text-muted-foreground" />Reason: {appointment.reason}</Typography>
        </Box>
        <Box className="mt-4 flex justify-end">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Eye size={16} />}
            onClick={() => onViewDetails(appointment.id)}
            className="text-primary border-primary hover:bg-primary/10 transition-colors duration-200"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Appointment Detail Dialog Component
function AppointmentDetailDialog({ open, onClose, appointment }) {
  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
          Appointment Details
        </Typography>
        <IconButton
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className="flex items-center mb-4">
              <User size={24} className="mr-3 text-blue-500" />
              <Typography variant="h6" className="text-gray-900 dark:text-white">{appointment.patientName}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Date</Typography>
            <Typography variant="body1" className="text-gray-900 dark:text-white flex items-center">
              <Calendar size={16} className="mr-2 text-blue-500" />
              {appointment.date}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Time</Typography>
            <Typography variant="body1" className="text-gray-900 dark:text-white flex items-center">
              <Clock size={16} className="mr-2 text-blue-500" />
              {appointment.time}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Reason</Typography>
            <Typography variant="body1" className="text-gray-900 dark:text-white">{appointment.reason}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Notes</Typography>
            <Paper elevation={0} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <Typography variant="body1" className="text-gray-900 dark:text-white">
                {appointment.notes}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="border-t border-gray-200 dark:border-gray-700 p-3">
        <Button
          onClick={onClose}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Close
        </Button>
        <Button
          variant="contained"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Edit Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Schedule New Appointment Dialog
function ScheduleAppointmentDialog({ open, onClose, onSchedule }) {
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    date: null,
    time: '',
    reason: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setAppointmentData(prev => ({ ...prev, date: newDate }));
  };

  const handleSubmit = () => {
    // Format the date to string
    const formattedDate = appointmentData.date ?
      format(appointmentData.date, 'yyyy-MM-dd') : '';

    // Create appointment object
    const newAppointment = {
      id: Date.now(), // Generate a unique ID
      patientName: mockPatients.find(p => p.id === parseInt(appointmentData.patientId))?.name || '',
      date: formattedDate,
      time: appointmentData.time,
      reason: appointmentData.reason,
      status: new Date(formattedDate) > new Date() ? 'upcoming' : 'today',
      notes: appointmentData.notes
    };

    onSchedule(newAppointment);

    // Reset form
    setAppointmentData({
      patientId: '',
      date: null,
      time: '',
      reason: '',
      notes: ''
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
          Schedule New Appointment
        </Typography>
        <IconButton
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="patient-select-label">Patient</InputLabel>
              <Select
                labelId="patient-select-label"
                id="patient-select"
                name="patientId"
                value={appointmentData.patientId}
                onChange={handleChange}
                label="Patient"
              >
                {mockPatients.map(patient => (
                  <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Appointment Date"
              value={appointmentData.date}
              onChange={handleDateChange}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time"
              name="time"
              value={appointmentData.time}
              onChange={handleChange}
              placeholder="e.g. 10:00 AM"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={appointmentData.reason}
              onChange={handleChange}
              placeholder="Reason for appointment"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={appointmentData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Additional notes"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="border-t border-gray-200 dark:border-gray-700 p-3">
        <Button
          onClick={onClose}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!appointmentData.patientId || !appointmentData.date || !appointmentData.time || !appointmentData.reason}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          Schedule Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Calendar Navigation Component
function CalendarNavigation({ currentDate, onPrevDay, onNextDay, onToday }) {
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box className="flex items-center justify-between mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
      <Button
        startIcon={<ChevronLeft size={16} />}
        onClick={onPrevDay}
        className="text-gray-700 dark:text-gray-300"
      >
        Previous Day
      </Button>

      <Box className="flex flex-col items-center">
        <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
          {formatDate(currentDate)}
        </Typography>
        <Button
          size="small"
          onClick={onToday}
          className="text-blue-600 dark:text-blue-400"
        >
          Today
        </Button>
      </Box>

      <Button
        endIcon={<ChevronRight size={16} />}
        onClick={onNextDay}
        className="text-gray-700 dark:text-gray-300"
      >
        Next Day
      </Button>
    </Box>
  );
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format

  // Filter appointments based on status and current date
  const todaysAppointments = appointments.filter(app => app.date === currentDate && app.status === 'today');
  const upcomingAppointments = appointments.filter(app => app.date > currentDate && app.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort upcoming
  const pastAppointments = appointments.filter(app => app.date < currentDate || app.status === 'past').sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort past descending

  const handleViewDetails = (appointmentId) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    setSelectedAppointment(appointment);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  const handleOpenScheduleDialog = () => {
    setScheduleDialogOpen(true);
  };

  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false);
  };

  const handleScheduleAppointment = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
  };

  // Calendar navigation handlers
  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-foreground font-bold">
          Doctor Appointments
        </Typography>
        <Typography paragraph className="text-muted-foreground mb-6">
          This page displays your appointments.
        </Typography>

        <Card className="mb-6 shadow-lg rounded-lg border border-border bg-card">
          <CardContent>
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h5" component="h1" className="font-bold text-foreground">Appointments Overview</Typography>
              <Button
                variant="contained"
                startIcon={<CalendarPlus size={20} />}
                onClick={handleOpenScheduleDialog}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-colors duration-200"
              >
                Schedule New Appointment
              </Button>
            </Box>

            <CalendarNavigation
              currentDate={currentDate}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onToday={handleToday}
            />

            {/* Today's Appointments */}
            <Typography variant="h6" className="mb-4 text-foreground border-b border-border pb-2">Today's Appointments</Typography>
            <Grid container spacing={3} className="mb-6">
              {todaysAppointments.length === 0 ? (
                <Grid item xs={12}>
                  <Typography className="text-muted-foreground">No appointments scheduled for today.</Typography>
                </Grid>
              ) : (
                todaysAppointments.map((appointment) => (
                  <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                    <AppointmentCard appointment={appointment} onViewDetails={handleViewDetails} />
                  </Grid>
                ))
              )}
            </Grid>

            {/* Upcoming Appointments */}
            <Typography variant="h6" className="mb-4 text-foreground border-b border-border pb-2">Upcoming Appointments</Typography>
            <Grid container spacing={3} className="mb-6">
              {upcomingAppointments.length === 0 ? (
                <Grid item xs={12}>
                  <Typography className="text-muted-foreground">No upcoming appointments.</Typography>
                </Grid>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                    <AppointmentCard appointment={appointment} onViewDetails={handleViewDetails} />
                  </Grid>
                ))
              )}
            </Grid>

            {/* Past Appointments */}
            <Typography variant="h6" className="mb-4 text-foreground border-b border-border pb-2">Past Appointments</Typography>
            <Grid container spacing={3}>
              {pastAppointments.length === 0 ? (
                <Grid item xs={12}>
                  <Typography className="text-muted-foreground">No past appointments found.</Typography>
                </Grid>
              ) : (
                pastAppointments.map((appointment) => (
                  <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                    <AppointmentCard appointment={appointment} onViewDetails={handleViewDetails} />
                  </Grid>
                ))
              )}
            </Grid>

          </CardContent>
        </Card>
      </Paper>

      {/* Appointment Detail Dialog */}
      <AppointmentDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        appointment={selectedAppointment}
      />

      {/* Schedule Appointment Dialog */}
      <ScheduleAppointmentDialog
        open={scheduleDialogOpen}
        onClose={handleCloseScheduleDialog}
        onSchedule={handleScheduleAppointment}
      />
    </Box>
  );
} 