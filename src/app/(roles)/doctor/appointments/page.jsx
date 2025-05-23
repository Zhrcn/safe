'use client';

import { Typography, Card, CardContent, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CalendarPlus, Eye } from 'lucide-react';

// Mock Appointments Data
const mockAppointments = [
  {
    id: 1,
    patientName: 'Patient A',
    date: '2024-06-15',
    time: '10:00 AM',
    reason: 'Follow-up',
  },
  {
    id: 2,
    patientName: 'Patient B',
    date: '2024-06-15',
    time: '11:00 AM',
    reason: 'New Consultation',
  },
  {
    id: 3,
    patientName: 'Patient C',
    date: '2024-06-16',
    time: '02:00 PM',
    reason: 'Check-up',
  },
];

export default function DoctorAppointmentsPage() {
  // In a real app, you would fetch and filter appointments
  const appointmentsToday = mockAppointments.filter(app => app.date === new Date().toISOString().split('T')[0]);

  const handleViewDetails = (appointmentId) => {
    console.log(`View details for appointment ${appointmentId}`);
    // Implement navigation to appointment/patient detail page
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
          Appointments
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300">
          This is the Doctor Appointments page. Content will be added here to manage appointments. This page will adapt to both light and dark themes.
        </Typography>
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h5" component="h1" className="font-bold">Appointments</Typography>
              <Button variant="contained" startIcon={<CalendarPlus size={20} />} className="bg-blue-600 hover:bg-blue-700">
                Schedule New Appointment
              </Button>
            </Box>

            <Typography variant="h6" className="mb-4">Appointments Today</Typography>

            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointmentsToday.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No appointments scheduled for today.
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointmentsToday.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => handleViewDetails(appointment.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* You could add sections for upcoming appointments, past appointments, etc. */}

          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
} 