'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { Calendar, Activity, FileText } from 'lucide-react';
import { DoctorPageContainer, DoctorCard, SearchField, ChartContainer } from '@/components/doctor/DoctorComponents';
import { getPatients, getAppointments } from '@/services/doctorService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Mock data for patient health trends
const patientHealthData = [
  { date: 'Jan', glucose: 120, bloodPressure: 130, weight: 70 },
  { date: 'Feb', glucose: 115, bloodPressure: 135, weight: 69 },
  { date: 'Mar', glucose: 118, bloodPressure: 132, weight: 69 },
  { date: 'Apr', glucose: 122, bloodPressure: 128, weight: 68 },
  { date: 'May', glucose: 116, bloodPressure: 130, weight: 68 },
  { date: 'Jun', glucose: 110, bloodPressure: 125, weight: 67 },
];

// Patient List Table Component
function PatientTable({ patients, onSelectPatient, selectedPatientId }) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400, overflow: 'auto' }} className="bg-card border border-border rounded-md">
      <Table stickyHeader>
        <TableHead>
          <TableRow className="bg-muted">
            <TableCell className="text-foreground font-semibold">PATIENT</TableCell>
            <TableCell className="text-foreground font-semibold">AGE</TableCell>
            <TableCell className="text-foreground font-semibold">CONDITION/STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              selected={selectedPatientId === patient.id}
              hover
              className={`cursor-pointer transition-colors duration-200 ${selectedPatientId === patient.id ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
            >
              <TableCell className="text-foreground">{patient.name}</TableCell>
              <TableCell className="text-foreground">{patient.age}</TableCell>
              <TableCell>
                {patient.condition}
                <br />
                <Chip
                  label={patient.status}
                  size="small"
                  color={patient.status === 'Active' ? 'success' : patient.status === 'Urgent' ? 'error' : 'default'}
                  className={
                    patient.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      patient.status === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }
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
      <Paper elevation={1} className="p-3 h-full flex items-center justify-center bg-card border border-border rounded-md">
        <Typography variant="body1" className="text-muted-foreground">Select a patient to view details</Typography>
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
    <Paper elevation={1} className="h-full flex flex-col bg-card border border-border rounded-md">
      <Box className="p-3 flex items-center border-b border-border">
        <Box className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2">
          {patient.name.split(' ').map(n => n[0]).join('')}
        </Box>
        <Box>
          <Typography variant="h6" className="text-foreground">{patient.name}</Typography>
          <Typography variant="body2" className="text-muted-foreground">
            {patient.age} years
            {patientDetails.diabetesType && ` • Diabetes ${patientDetails.diabetesType}`}
          </Typography>
        </Box>
        <Box className="ml-auto">
          <Button
            variant="outlined"
            startIcon={<FileText size={18} />}
            className="mr-1 text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            Medical History
          </Button>
          <Button
            variant="contained"
            disableElevation
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            Schedule
          </Button>
        </Box>
      </Box>

      <Box className="border-b border-border">
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className="px-2"
          TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
        >
          <Tab label="Overview" value="overview" className={activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground'} />
          <Tab label="History" value="history" className={activeTab === 'history' ? 'text-primary' : 'text-muted-foreground'} />
          <Tab label="Lab Results" value="lab" className={activeTab === 'lab' ? 'text-primary' : 'text-muted-foreground'} />
          <Tab label="Medications" value="medications" className={activeTab === 'medications' ? 'text-primary' : 'text-muted-foreground'} />
        </Tabs>
      </Box>

      <Box className="p-3 flex-grow overflow-auto">
        {activeTab === 'overview' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Box className="flex items-center mb-2">
                  <Activity size={18} className="text-blue-600 dark:text-blue-300" />
                  <Typography variant="h6" className="ml-1 text-foreground">Vital Signs</Typography>
                </Box>
                <Box className="mb-2">
                  <Typography variant="body2" className="text-muted-foreground">Blood Pressure</Typography>
                  <Typography variant="h6" className="text-foreground">{patientDetails.vitalSigns.bloodPressure} <Typography component="span" variant="body2" className="text-muted-foreground">mmHg</Typography></Typography>
                </Box>
                <Box className="mb-2">
                  <Typography variant="body2" className="text-muted-foreground">Heart Rate</Typography>
                  <Typography variant="h6" className="text-foreground">{patientDetails.vitalSigns.heartRate} <Typography component="span" variant="body2" className="text-muted-foreground">bpm</Typography></Typography>
                </Box>
                <Box className="mb-2">
                  <Typography variant="body2" className="text-muted-foreground">Temperature</Typography>
                  <Typography variant="h6" className="text-foreground">{patientDetails.vitalSigns.temperature} <Typography component="span" variant="body2" className="text-muted-foreground">°F</Typography></Typography>
                </Box>
                <Box className="mb-2">
                  <Typography variant="body2" className="text-muted-foreground">Respiratory Rate</Typography>
                  <Typography variant="h6" className="text-foreground">{patientDetails.vitalSigns.respiratoryRate} <Typography component="span" variant="body2" className="text-muted-foreground">bpm</Typography></Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box className="flex items-center mb-2">
                  <Box className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-300 mr-1">
                    !
                  </Box>
                  <Typography variant="h6" className="text-foreground">Allergies</Typography>
                </Box>
                {patientDetails.allergies.map((allergy, index) => (
                  <Box key={index} className="mb-2">
                    <Typography variant="body1" className="font-medium text-foreground">{allergy.name}</Typography>
                    <Typography variant="body2" className="text-muted-foreground">
                      {allergy.severity} reaction - {allergy.reaction}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <ChartContainer title="Health Trends">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={patientHealthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="glucose" stroke="#8884d8" name="Glucose (mg/dL)" />
                    <Line type="monotone" dataKey="bloodPressure" stroke="#82ca9d" name="Systolic BP (mmHg)" />
                    <Line type="monotone" dataKey="weight" stroke="#ffc658" name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Grid>
          </Grid>
        )}
        {activeTab === 'history' && (
          <Typography className="text-muted-foreground">Medical history information will be displayed here.</Typography>
        )}
        {activeTab === 'lab' && (
          <Typography className="text-muted-foreground">Lab results will be displayed here.</Typography>
        )}
        {activeTab === 'medications' && (
          <Box>
            <Typography variant="h6" className="mb-2 text-foreground">Current Medications</Typography>
            {patientDetails.medications.map((med, index) => (
              <Box key={index} className="mb-3 p-3 border border-border rounded-md">
                <Typography variant="body1" className="font-medium text-foreground">{med.name} ({med.dosage})</Typography>
                <Typography variant="body2" className="text-muted-foreground">{med.frequency}</Typography>
                <Typography variant="body2" className="text-muted-foreground">{med.purpose}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

// Appointments Calendar Component
function AppointmentsCalendar({ appointments }) {
  return (
    <Box>
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="text-foreground">Today's Appointments</Typography>
        <Box className="flex items-center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Calendar size={16} />}
            className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            View All
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} elevation={0} className="bg-card border border-border rounded-md">
        <Table size="small">
          <TableHead>
            <TableRow className="bg-muted">
              <TableCell className="text-foreground font-semibold">Time</TableCell>
              <TableCell className="text-foreground font-semibold">Patient</TableCell>
              <TableCell className="text-foreground font-semibold">Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-muted/40 transition-colors duration-200">
                <TableCell className="text-foreground">{appointment.time}</TableCell>
                <TableCell className="text-foreground">{appointment.patientName}</TableCell>
                <TableCell className="text-foreground">{appointment.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [patientsData, appointmentsData] = await Promise.all([
          getPatients(),
          getAppointments()
        ]);

        setPatients(patientsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  // Filter patients based on search term
  const filteredPatients = searchTerm
    ? patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : patients;

  return (
    <DoctorPageContainer
      title="Doctor Dashboard"
      description="Manage your patients, appointments, and daily tasks."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DoctorCard
            title="Patients"
            actions={
              <SearchField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
              />
            }
          >
            {loading ? (
              <Box className="flex justify-center items-center h-64">
                <Typography className="text-muted-foreground">Loading patients...</Typography>
              </Box>
            ) : (
              <PatientTable
                patients={filteredPatients}
                onSelectPatient={handleSelectPatient}
                selectedPatientId={selectedPatient?.id}
              />
            )}
          </DoctorCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <PatientDetails patient={selectedPatient} />
        </Grid>
        <Grid item xs={12}>
          <DoctorCard title="Appointments">
            {loading ? (
              <Box className="flex justify-center items-center h-24">
                <Typography className="text-muted-foreground">Loading appointments...</Typography>
              </Box>
            ) : (
              <AppointmentsCalendar appointments={appointments} />
            )}
          </DoctorCard>
        </Grid>
      </Grid>
    </DoctorPageContainer>
  );
}