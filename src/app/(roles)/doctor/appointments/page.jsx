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
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Doctor Appointments
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          This page displays the doctor's appointments.
        </Typography>
        <Card className="mb-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Appointments</Typography>
              <Button variant="contained" startIcon={<CalendarPlus size={20} />} className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold transition-colors duration-200">
                Schedule New Appointment
              </Button>
            </Box>

            <Typography variant="h6" className="mb-4 text-gray-800 dark:text-gray-200">Appointments Today</Typography>

            <TableContainer component={Paper} elevation={2} className="bg-white dark:bg-gray-700 rounded-md">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100 dark:bg-gray-600">
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Patient Name</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Time</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Reason</TableCell>
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointmentsToday.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" className="text-gray-700 dark:text-gray-300">
                        No appointments scheduled for today.
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointmentsToday.map((appointment) => (
                      <TableRow key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <TableCell className="text-gray-900 dark:text-gray-100">{appointment.patientName}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{appointment.time}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{appointment.reason}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => handleViewDetails(appointment.id)}
                            className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
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