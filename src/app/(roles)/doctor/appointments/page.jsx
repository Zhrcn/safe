'use client';

import { Typography, Card, CardContent, Box, Button, List, ListItem, ListItemText, Paper, Grid } from '@mui/material';
import { CalendarPlus, Eye, Clock, User, FileText } from 'lucide-react';

// Mock Appointments Data (replace with actual data fetching)
const mockAppointments = [
  { id: 1, patientName: 'Patient A', date: '2024-06-21', time: '10:00 AM', reason: 'Follow-up', status: 'upcoming' },
  { id: 2, patientName: 'Patient B', date: '2024-06-21', time: '11:00 AM', reason: 'New Consultation', status: 'today' },
  { id: 3, patientName: 'Patient C', date: '2024-06-20', time: '02:00 PM', reason: 'Check-up', status: 'past' },
  { id: 4, patientName: 'Patient D', date: '2024-06-21', time: '01:00 PM', reason: 'Vaccination', status: 'today' },
  { id: 5, patientName: 'Patient E', date: '2024-06-22', time: '09:00 AM', reason: 'Annual Physical', status: 'upcoming' },
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

export default function DoctorAppointmentsPage() {
  // In a real app, you would fetch appointments based on selected date/filters
  const today = new Date().toISOString().split('T')[0];

  const appointmentsToday = mockAppointments.filter(app => app.date === today && app.status === 'today');
  const upcomingAppointments = mockAppointments.filter(app => app.date > today && app.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort upcoming
  const pastAppointments = mockAppointments.filter(app => app.date < today || app.status === 'past').sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort past descending

  const handleViewDetails = (appointmentId) => {
    console.log(`View details for appointment ${appointmentId}`);
    // Implement navigation to appointment/patient detail page or show modal
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
              <Button variant="contained" startIcon={<CalendarPlus size={20} />} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-colors duration-200">
                Schedule New Appointment
              </Button>
            </Box>

            {/* Today's Appointments */}
            <Typography variant="h6" className="mb-4 text-foreground border-b border-border pb-2">Today's Appointments</Typography>
            <Grid container spacing={3} className="mb-6">
              {appointmentsToday.length === 0 ? (
                <Grid item xs={12}>
                  <Typography className="text-muted-foreground">No appointments scheduled for today.</Typography>
                </Grid>
              ) : (
                appointmentsToday.map((appointment) => (
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
    </Box>
  );
} 