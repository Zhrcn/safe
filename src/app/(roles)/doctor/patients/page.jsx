'use client';

import { Typography, Card, CardContent, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip, Tabs, Tab } from '@mui/material';
import { Search, Eye, UserPlus, X, Activity, FileText, Pill, Calendar } from 'lucide-react';
import { useState } from 'react';

// Mock Patients Data (replace with actual data fetching)
const mockAllPatients = [
  {
    id: 1,
    name: 'Patient A',
    age: 45,
    gender: 'Male',
    lastAppointment: '2024-06-15',
    condition: 'Hypertension',
    status: 'Active',
    contact: {
      email: 'patientA@example.com',
      phone: '+963 11 123 4567'
    },
    medicalHistory: [
      { date: '2023-12-10', description: 'Annual checkup', notes: 'Blood pressure slightly elevated' },
      { date: '2024-01-15', description: 'Follow-up appointment', notes: 'Started on medication' },
      { date: '2024-03-20', description: 'Blood work', notes: 'Results normal' },
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', purpose: 'For Hypertension' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'once daily', purpose: 'Preventative' }
    ],
    vitalSigns: {
      bloodPressure: '130/85',
      heartRate: '72',
      temperature: '98.6',
      respiratoryRate: '16'
    }
  },
  {
    id: 2,
    name: 'Patient B',
    age: 30,
    gender: 'Female',
    lastAppointment: '2024-06-15',
    condition: 'Diabetes Type 2',
    status: 'Active',
    contact: {
      email: 'patientB@example.com',
      phone: '+963 11 234 5678'
    },
    medicalHistory: [
      { date: '2023-11-05', description: 'Initial diagnosis', notes: 'Diabetes Type 2 confirmed' },
      { date: '2024-02-10', description: 'Follow-up appointment', notes: 'Glucose levels improving with diet' },
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'twice daily with meals', purpose: 'For Type 2 Diabetes' }
    ],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '68',
      temperature: '98.4',
      respiratoryRate: '14'
    }
  },
  {
    id: 3,
    name: 'Patient C',
    age: 60,
    gender: 'Male',
    lastAppointment: '2024-06-16',
    condition: 'Arthritis',
    status: 'Urgent',
    contact: {
      email: 'patientC@example.com',
      phone: '+963 11 345 6789'
    },
    medicalHistory: [
      { date: '2023-09-15', description: 'Joint pain evaluation', notes: 'Diagnosed with osteoarthritis' },
      { date: '2024-04-22', description: 'Pain management follow-up', notes: 'Increased pain, new medication prescribed' },
    ],
    medications: [
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'three times daily with food', purpose: 'For pain and inflammation' },
      { name: 'Glucosamine', dosage: '1500mg', frequency: 'once daily', purpose: 'Joint support' }
    ],
    vitalSigns: {
      bloodPressure: '140/90',
      heartRate: '76',
      temperature: '98.8',
      respiratoryRate: '18'
    }
  },
  {
    id: 4,
    name: 'Patient D',
    age: 35,
    gender: 'Female',
    lastAppointment: '2024-06-10',
    condition: 'Asthma',
    status: 'Active',
    contact: {
      email: 'patientD@example.com',
      phone: '+963 11 456 7890'
    },
    medicalHistory: [
      { date: '2023-08-20', description: 'Respiratory assessment', notes: 'Mild asthma diagnosed' },
      { date: '2024-05-15', description: 'Asthma review', notes: 'Well controlled with current medication' },
    ],
    medications: [
      { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed for symptoms', purpose: 'Rescue inhaler' },
      { name: 'Fluticasone', dosage: '110mcg', frequency: 'twice daily', purpose: 'Maintenance inhaler' }
    ],
    vitalSigns: {
      bloodPressure: '118/75',
      heartRate: '80',
      temperature: '98.2',
      respiratoryRate: '16'
    }
  },
  {
    id: 5,
    name: 'Patient E',
    age: 50,
    gender: 'Male',
    lastAppointment: '2024-06-12',
    condition: 'High Cholesterol',
    status: 'Inactive',
    contact: {
      email: 'patientE@example.com',
      phone: '+963 11 567 8901'
    },
    medicalHistory: [
      { date: '2023-10-10', description: 'Lipid panel', notes: 'Elevated LDL cholesterol' },
      { date: '2024-01-05', description: 'Follow-up appointment', notes: 'Started on statin medication' },
    ],
    medications: [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'once daily at bedtime', purpose: 'For High Cholesterol' }
    ],
    vitalSigns: {
      bloodPressure: '135/85',
      heartRate: '70',
      temperature: '98.6',
      respiratoryRate: '15'
    }
  },
];

// Patient Detail Dialog Component
function PatientDetailDialog({ open, onClose, patient }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!patient) return null;

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
          Patient Details
        </Typography>
        <Button
          onClick={onClose}
          className="min-w-0 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X size={20} />
        </Button>
      </DialogTitle>
      <DialogContent className="p-0">
        <Box className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2196f3',
            mr: 2
          }}>
            {patient.name.split(' ').map(n => n[0]).join('')}
          </Box>
          <Box>
            <Typography variant="h6" className="text-gray-900 dark:text-white">{patient.name}</Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
              {patient.age} years • {patient.gender} • {patient.condition}
            </Typography>
          </Box>
          <Chip
            label={patient.status}
            size="small"
            color={patient.status === 'Active' ? 'success' : patient.status === 'Urgent' ? 'error' : 'default'}
            sx={{
              ml: 'auto',
              borderRadius: '4px',
              backgroundColor: patient.status === 'Active' ? 'rgba(46, 204, 113, 0.1)' :
                patient.status === 'Urgent' ? 'rgba(231, 76, 60, 0.1)' :
                  'rgba(189, 195, 199, 0.1)',
              color: patient.status === 'Active' ? '#2ecc71' :
                patient.status === 'Urgent' ? '#e74c3c' :
                  '#7f8c8d',
              '& .MuiChip-label': {
                padding: '0 8px',
              }
            }}
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ px: 2 }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Medical History" value="history" />
            <Tab label="Medications" value="medications" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 'overview' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Activity size={18} className="mr-2 text-blue-500" />
                    <Typography variant="h6" className="text-gray-900 dark:text-white">Vital Signs</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Blood Pressure</Typography>
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {patient.vitalSigns.bloodPressure} <Typography component="span" variant="body2" className="text-gray-600 dark:text-gray-400">mmHg</Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Heart Rate</Typography>
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {patient.vitalSigns.heartRate} <Typography component="span" variant="body2" className="text-gray-600 dark:text-gray-400">bpm</Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Temperature</Typography>
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {patient.vitalSigns.temperature} <Typography component="span" variant="body2" className="text-gray-600 dark:text-gray-400">°F</Typography>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Calendar size={18} className="mr-2 text-blue-500" />
                    <Typography variant="h6" className="text-gray-900 dark:text-white">Last Appointment</Typography>
                  </Box>
                  <Typography variant="body1" className="text-gray-900 dark:text-white mb-2">
                    {patient.lastAppointment}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
                    <FileText size={18} className="mr-2 text-blue-500" />
                    <Typography variant="h6" className="text-gray-900 dark:text-white">Contact Information</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Email</Typography>
                    <Typography variant="body1" className="text-gray-900 dark:text-white">{patient.contact.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">Phone</Typography>
                    <Typography variant="body1" className="text-gray-900 dark:text-white">{patient.contact.phone}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 'history' && (
            <Box>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-3">Medical History</Typography>
              {patient.medicalHistory.map((record, index) => (
                <Box key={index} className="mb-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <Box className="flex justify-between">
                    <Typography variant="subtitle1" className="font-medium text-gray-900 dark:text-white">
                      {record.description}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                      {record.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mt-1">
                    {record.notes}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {activeTab === 'medications' && (
            <Box>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-3">Current Medications</Typography>
              {patient.medications.map((med, index) => (
                <Box key={index} className="mb-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <Box className="flex items-center">
                    <Pill size={16} className="mr-2 text-blue-500" />
                    <Typography variant="subtitle1" className="font-medium text-gray-900 dark:text-white">
                      {med.name} - {med.dosage}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mt-1">
                    {med.frequency}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                    Purpose: {med.purpose}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
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
          Schedule Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function DoctorPatientsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredPatients = mockAllPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (patientId) => {
    const patient = mockAllPatients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
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
                    <TableCell className="text-foreground font-semibold">Condition</TableCell>
                    <TableCell className="text-foreground font-semibold">Last Appointment</TableCell>
                    <TableCell align="right" className="text-foreground font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="text-muted-foreground py-4">
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
                        <TableCell className="text-foreground py-3 px-4">
                          {patient.condition}
                          <br />
                          <Chip
                            label={patient.status}
                            size="small"
                            color={patient.status === 'Active' ? 'success' : patient.status === 'Urgent' ? 'error' : 'default'}
                            sx={{
                              mt: 0.5,
                              borderRadius: '4px',
                              backgroundColor: patient.status === 'Active' ? 'rgba(46, 204, 113, 0.1)' :
                                patient.status === 'Urgent' ? 'rgba(231, 76, 60, 0.1)' :
                                  'rgba(189, 195, 199, 0.1)',
                              color: patient.status === 'Active' ? '#2ecc71' :
                                patient.status === 'Urgent' ? '#e74c3c' :
                                  '#7f8c8d',
                              '& .MuiChip-label': {
                                padding: '0 8px',
                              }
                            }}
                          />
                        </TableCell>
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

      <PatientDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        patient={selectedPatient}
      />
    </Box>
  );
} 