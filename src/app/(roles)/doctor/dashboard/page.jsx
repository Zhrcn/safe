'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDate } from '@/lib/redux/dateSlice';
import { setSelectedPatient } from '@/lib/redux/patientSlice';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { Search, Calendar, Activity, FileText, Pill, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for patients
const patientsMock = [
  { id: 1, name: 'Sarah Johnson', age: 34, condition: 'Hypertension', status: 'Active' },
  { id: 2, name: 'John Smith', age: 45, condition: 'Diabetes Type 2', status: 'Active' },
  { id: 3, name: 'Emma Davis', age: 29, condition: 'Pregnancy', status: 'Urgent' },
  { id: 4, name: 'Robert Wilson', age: 65, condition: 'Arthritis', status: 'Active' },
  { id: 5, name: 'Maria Garcia', age: 42, condition: 'Asthma', status: 'Inactive' },
  { id: 6, name: 'David Lee', age: 38, condition: 'Migraines', status: 'Active' },
  { id: 7, name: 'Jennifer Taylor', age: 52, condition: 'Heart Disease', status: 'Urgent' },
];

// Mock appointments data
const appointmentsMock = [
  { id: 1, patientId: 1, patientName: 'Sarah Johnson', time: '9:00 AM', type: 'Annual Physical', date: '2023-04-25' },
  { id: 2, patientId: 4, patientName: 'Robert Wilson', time: '11:30 AM', type: 'Follow-up', date: '2023-04-25' },
  { id: 3, patientId: 3, patientName: 'Emma Davis', time: '2:00 PM', type: 'Prenatal Checkup', date: '2023-04-25' },
  { id: 4, patientId: 2, patientName: 'John Smith', time: '4:30 PM', type: 'Diabetes Review', date: '2023-04-25' },
];

// Patient List Table Component
function PatientTable({ patients, onSelectPatient, selectedPatientId }) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>PATIENT</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>AGE</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>CONDITION/STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              selected={selectedPatientId === patient.id}
              hover
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedPatientId === patient.id ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
              }}
            >
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>
                {patient.condition}
                <br />
                <Chip
                  label={patient.status}
                  size="small"
                  color={patient.status === 'Active' ? 'success' : patient.status === 'Urgent' ? 'error' : 'default'}
                  sx={{
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Patient Details Component
function PatientDetails({ patient }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!patient) {
    return (
      <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">Select a patient to view details</Typography>
      </Paper>
    );
  }

  // Mock patient details
  const patientDetails = {
    id: patient.id,
    name: patient.name,
    age: patient.age,
    condition: patient.condition,
    diabetes: patient.condition.includes('Diabetes'),
    diabetesType: patient.condition.includes('Diabetes') ? 'Type 2' : null,
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6',
      respiratoryRate: '16'
    },
    allergies: [
      { name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
      { name: 'Peanuts', severity: 'Moderate', reaction: 'Hives' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', purpose: 'For Hypertension' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'once daily at bedtime', purpose: 'For High Cholesterol' },
      { name: 'Metformin', dosage: '500mg', frequency: 'twice daily with meals', purpose: 'For Type 2 Diabetes' }
    ]
  };

  return (
    <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
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
          <Typography variant="h6">{patient.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {patient.age} years
            {patientDetails.diabetesType && ` • Diabetes ${patientDetails.diabetesType}`}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<FileText size={18} />}
            sx={{ mr: 1 }}
          >
            Medical History
          </Button>
          <Button
            variant="contained"
            disableElevation
          >
            Schedule
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ px: 2 }}
        >
          <Tab label="Overview" value="overview" />
          <Tab label="History" value="history" />
          <Tab label="Lab Results" value="lab" />
          <Tab label="Medications" value="medications" />
        </Tabs>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 'overview' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Activity size={18} />
                  <Typography variant="h6" sx={{ ml: 1 }}>Vital Signs</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                  <Typography variant="h6">{patientDetails.vitalSigns.bloodPressure} <Typography component="span" variant="body2" color="text.secondary">mmHg</Typography></Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                  <Typography variant="h6">{patientDetails.vitalSigns.heartRate} <Typography component="span" variant="body2" color="text.secondary">bpm</Typography></Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Temperature</Typography>
                  <Typography variant="h6">{patientDetails.vitalSigns.temperature} <Typography component="span" variant="body2" color="text.secondary">°F</Typography></Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Respiratory Rate</Typography>
                  <Typography variant="h6">{patientDetails.vitalSigns.respiratoryRate} <Typography component="span" variant="body2" color="text.secondary">bpm</Typography></Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#fff3e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff9800',
                      mr: 1
                    }}>
                      !
                    </Box>
                    <Typography variant="h6">Allergies</Typography>
                  </Box>
                </Box>
                {patientDetails.allergies.map((allergy, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{allergy.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {allergy.severity} reaction - {allergy.reaction}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Pill size={18} />
                  <Typography variant="h6" sx={{ ml: 1 }}>Current Medications</Typography>
                </Box>
                {patientDetails.medications.map((medication, index) => (
                  <Box key={index} sx={{ mb: 3, display: 'flex' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{medication.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {medication.dosage}, {medication.frequency}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {medication.purpose}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        )}
        {activeTab === 'history' && <Typography>Patient history content</Typography>}
        {activeTab === 'lab' && <Typography>Lab results content</Typography>}
        {activeTab === 'medications' && <Typography>Detailed medications content</Typography>}
      </Box>
    </Paper>
  );
}

// Appointments Calendar Component
function AppointmentsCalendar({ appointments, selectedDate }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Filter appointments for today
  const todayAppointments = appointments.filter(app => app.date === selectedDate);

  return (
    <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Appointments</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Your schedule for today</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>April 2025</Typography>
        <Box>
          <IconButton size="small">
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton size="small">
            <ChevronRight size={20} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
            <Grid item xs={12 / 7} key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{day}</Typography>
            </Grid>
          ))}

          {/* Calendar days - just showing a few days for example */}
          {[30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3].map((day, index) => (
            <Grid item xs={12 / 7} key={index} sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                backgroundColor: day === 25 ? '#2196f3' : 'transparent',
                color: day === 25 ? 'white' : (day < 1 || day > 30) ? 'rgba(0,0,0,0.3)' : 'inherit',
                border: day === today.getDate() && day >= 1 && day <= 30 ? '1px solid #2196f3' : 'none'
              }}>
                <Typography variant="body2">{day}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body1" sx={{ fontWeight: 500, mt: 3, mb: 2 }}>UPCOMING APPOINTMENTS</Typography>

        {todayAppointments.map(appointment => (
          <Box key={appointment.id} sx={{
            mb: 2,
            p: 2,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 1,
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{
                backgroundColor: '#e3f2fd',
                color: '#2196f3',
                p: 0.5,
                px: 1,
                borderRadius: 1
              }}>
                <Typography variant="caption">{appointment.time}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">AM</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{appointment.patientName}</Typography>
            <Typography variant="body2" color="text.secondary">{appointment.type}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function DoctorDashboard() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedDate = useAppSelector(state => state?.date?.selectedDate || new Date().toISOString().split('T')[0]);
  const selectedPatient = useAppSelector(state => state?.patient?.selectedPatient || null);

  // Filter patients based on search query
  const filteredPatients = patientsMock.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Initialize selected date if not already set
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      dispatch(setSelectedDate(today));
    }
  }, [selectedDate, dispatch]);

  const handleSelectPatient = (patient) => {
    dispatch(setSelectedPatient(patient));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Doctor Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search patients..."
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>

          <PatientTable
            patients={filteredPatients}
            onSelectPatient={handleSelectPatient}
            selectedPatientId={selectedPatient?.id}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <PatientDetails patient={selectedPatient} />
        </Grid>

        <Grid item xs={12} md={7}>
          <Box sx={{ height: 400 }}>
            {/* Additional content could go here */}
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <AppointmentsCalendar
            appointments={appointmentsMock}
            selectedDate={selectedDate}
          />
        </Grid>
      </Grid>
    </Box>
  );
}