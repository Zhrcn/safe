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
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Doctor Patients List
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          This page displays a list of patients.
        </Typography>
        <Card className="mb-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Patients List</Typography>
              <Box className="flex items-center space-x-4 w-full sm:w-auto">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Patients"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} className="text-gray-500 dark:text-gray-400"/>
                      </InputAdornment>
                    ),
                    className: 'text-gray-900 dark:text-white',
                  }}
                  InputLabelProps={{
                     style: { color: 'inherit' },
                  }}
                   sx={{
                      '& .MuiOutlinedInput-root': {
                          fieldset: { borderColor: '#d1d5db' },
                          '&:hover fieldset': { borderColor: '#9ca3af' },
                           '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            '& .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#4b5563',
                           },
                           '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6b7280',
                           },
                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#60a5fa',
                           },
                      },
                       '& .MuiInputBase-input::placeholder': {
                           color: '#9ca3af',
                           opacity: 1,
                           '.dark & ': {
                                color: '#6b7280',
                           },
                       },
                       '& .MuiInputLabel-outlined': {
                            color: '#6b7280',
                             '.dark & ': {
                                 color: '#9ca3af',
                           },
                       },
                   }}
                />
                <Button variant="contained" startIcon={<UserPlus size={20} />} className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold transition-colors duration-200">
                  Add New Patient
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2} className="bg-white dark:bg-gray-700 rounded-md">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100 dark:bg-gray-600">
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Name</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Age</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Gender</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Last Appointment</TableCell>
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="text-gray-700 dark:text-gray-300 py-4">
                        No patients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <TableRow 
                        key={patient.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 ${index < filteredPatients.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                      >
                        <TableCell className="text-gray-900 dark:text-gray-100 py-3 px-4">{patient.name}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100 py-3 px-4">{patient.age}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100 py-3 px-4">{patient.gender}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100 py-3 px-4">{patient.lastAppointment}</TableCell>
                        <TableCell align="right" className="py-3 px-4">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => handleViewDetails(patient.id)}
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

          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
} 