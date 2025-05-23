'use client';

import { Typography, Card, CardContent, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
import { Search, Eye, UserPlus } from 'lucide-react';
import { useState } from 'react';

// Mock Patients Data (replace with actual data fetching)
const mockAllPatients = [
  {
    id: 1,
    name: 'Patient A',
    age: 45,
    gender: 'Male',
    lastAppointment: '2024-06-15',
  },
  {
    id: 2,
    name: 'Patient B',
    age: 30,
    gender: 'Female',
    lastAppointment: '2024-06-15',
  },
  {
    id: 3,
    name: 'Patient C',
    age: 60,
    gender: 'Male',
    lastAppointment: '2024-06-16',
  },
  {
    id: 4,
    name: 'Patient D',
    age: 35,
    gender: 'Female',
    lastAppointment: '2024-06-10',
  },
  {
    id: 5,
    name: 'Patient E',
    age: 50,
    gender: 'Male',
    lastAppointment: '2024-06-12',
  },
];

export default function DoctorPatientsListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockAllPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (patientId) => {
    console.log(`View details for patient ${patientId}`);
    // Implement navigation to patient detail page or show modal
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
          Patients List
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300">
          This is the Doctor Patients List page. Content will be added here to display a list of patients. This page will adapt to both light and dark themes.
        </Typography>
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h5" component="h1" className="font-bold">Patients List</Typography>
              <Box className="flex items-center space-x-4">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Patients"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" startIcon={<UserPlus size={20} />} className="bg-blue-600 hover:bg-blue-700">
                  Add New Patient
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Last Appointment</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No patients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.lastAppointment}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => handleViewDetails(patient.id)}
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

          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
} 