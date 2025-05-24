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
      <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-foreground font-bold">
          Doctor Patients List
        </Typography>
        <Typography paragraph className="text-muted-foreground mb-6">
          This page displays a list of patients.
        </Typography>
        <Card className="mb-6 shadow-lg rounded-lg border border-border bg-card">
          <CardContent>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <Typography variant="h5" component="h1" className="font-bold text-foreground">Patients List</Typography>
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
                        <Search size={20} className="text-muted-foreground" />
                      </InputAdornment>
                    ),
                    className: 'text-foreground',
                  }}
                  InputLabelProps={{
                    style: { color: 'inherit' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fieldset: { borderColor: 'var(--border)' },
                      '&:hover fieldset': { borderColor: 'var(--border)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--primary)',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'var(--muted-foreground)',
                      opacity: 1,
                    },
                    '& .MuiInputLabel-outlined': {
                      color: 'var(--muted-foreground)',
                    },
                  }}
                />
                <Button variant="contained" startIcon={<UserPlus size={20} />} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-colors duration-200">
                  Add New Patient
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2} className="bg-card text-card-foreground rounded-md">
              <Table>
                <TableHead>
                  <TableRow className="bg-muted">
                    <TableCell className="text-foreground font-semibold">Name</TableCell>
                    <TableCell className="text-foreground font-semibold">Age</TableCell>
                    <TableCell className="text-foreground font-semibold">Gender</TableCell>
                    <TableCell className="text-foreground font-semibold">Last Appointment</TableCell>
                    <TableCell align="right" className="text-foreground font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="text-muted-foreground py-4">
                        No patients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <TableRow
                        key={patient.id}
                        className={`hover:bg-muted transition-colors duration-200 ${index < filteredPatients.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <TableCell className="text-foreground py-3 px-4">{patient.name}</TableCell>
                        <TableCell className="text-foreground py-3 px-4">{patient.age}</TableCell>
                        <TableCell className="text-foreground py-3 px-4">{patient.gender}</TableCell>
                        <TableCell className="text-foreground py-3 px-4">{patient.lastAppointment}</TableCell>
                        <TableCell align="right" className="py-3 px-4">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => handleViewDetails(patient.id)}
                            className="text-primary border-primary hover:bg-primary/10 transition-colors duration-200"
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