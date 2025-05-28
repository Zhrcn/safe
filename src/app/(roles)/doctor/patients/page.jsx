'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Grid, Chip, Tabs, Tab } from '@mui/material';
import { Eye, UserPlus, X, Activity, FileText, Pill, Calendar } from 'lucide-react';
import { DoctorPageContainer, DoctorCard, SearchField } from '@/components/doctor/DoctorComponents';
import { getPatients } from '@/services/doctorService';

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
        className: "bg-card text-card-foreground"
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b border-border">
        <Typography variant="h6" className="font-bold text-foreground">
          Patient Details
        </Typography>
        <Button
          onClick={onClose}
          className="min-w-0 p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </Button>
      </DialogTitle>
      <DialogContent className="p-0">
        <Box className="p-4 border-b border-border flex items-center">
          <Box className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </Box>
          <Box>
            <Typography variant="h6" className="text-foreground">{patient.name}</Typography>
            <Typography variant="body2" className="text-muted-foreground">
              {patient.age} years • {patient.gender} • {patient.condition}
            </Typography>
          </Box>
          <Chip
            label={patient.status}
            size="small"
            color={patient.status === 'Active' ? 'success' : patient.status === 'Urgent' ? 'error' : 'default'}
            className={
              patient.status === 'Active' ? 'ml-auto bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                patient.status === 'Urgent' ? 'ml-auto bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                  'ml-auto bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }
          />
        </Box>

        <Box className="border-b border-border">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="px-2"
            TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
          >
            <Tab label="Overview" value="overview" className={activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground'} />
            <Tab label="Medical History" value="history" className={activeTab === 'history' ? 'text-primary' : 'text-muted-foreground'} />
            <Tab label="Medications" value="medications" className={activeTab === 'medications' ? 'text-primary' : 'text-muted-foreground'} />
          </Tabs>
        </Box>

        <Box className="p-3">
          {activeTab === 'overview' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box className="flex items-center mb-2">
                    <Activity size={18} className="mr-2 text-blue-600 dark:text-blue-300" />
                    <Typography variant="h6" className="text-foreground">Vital Signs</Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Blood Pressure</Typography>
                    <Typography variant="h6" className="text-foreground">
                      {patient.vitalSigns.bloodPressure} <Typography component="span" variant="body2" className="text-muted-foreground">mmHg</Typography>
                    </Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Heart Rate</Typography>
                    <Typography variant="h6" className="text-foreground">
                      {patient.vitalSigns.heartRate} <Typography component="span" variant="body2" className="text-muted-foreground">bpm</Typography>
                    </Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Temperature</Typography>
                    <Typography variant="h6" className="text-foreground">
                      {patient.vitalSigns.temperature} <Typography component="span" variant="body2" className="text-muted-foreground">°F</Typography>
                    </Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Respiratory Rate</Typography>
                    <Typography variant="h6" className="text-foreground">
                      {patient.vitalSigns.respiratoryRate} <Typography component="span" variant="body2" className="text-muted-foreground">bpm</Typography>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box className="flex items-center mb-2">
                    <Calendar size={18} className="mr-2 text-blue-600 dark:text-blue-300" />
                    <Typography variant="h6" className="text-foreground">Contact Information</Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Email</Typography>
                    <Typography variant="body1" className="text-foreground">{patient.contact.email}</Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Phone</Typography>
                    <Typography variant="body1" className="text-foreground">{patient.contact.phone}</Typography>
                  </Box>
                  <Box className="mb-2">
                    <Typography variant="body2" className="text-muted-foreground">Last Appointment</Typography>
                    <Typography variant="body1" className="text-foreground">{patient.lastAppointment}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 'history' && (
            <Box>
              <Typography variant="h6" className="mb-3 text-foreground">Medical History</Typography>
              {patient.medicalHistory.map((record, index) => (
                <Box key={index} className="mb-3 p-3 border border-border rounded-md">
                  <Box className="flex justify-between items-center mb-1">
                    <Typography variant="body1" className="font-medium text-foreground">{record.description}</Typography>
                    <Typography variant="body2" className="text-muted-foreground">{record.date}</Typography>
                  </Box>
                  <Typography variant="body2" className="text-muted-foreground">{record.notes}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {activeTab === 'medications' && (
            <Box>
              <Box className="flex items-center mb-3">
                <Pill size={18} className="mr-2 text-blue-600 dark:text-blue-300" />
                <Typography variant="h6" className="text-foreground">Current Medications</Typography>
              </Box>
              {patient.medications.map((medication, index) => (
                <Box key={index} className="mb-3 p-3 border border-border rounded-md">
                  <Typography variant="body1" className="font-medium text-foreground">{medication.name} ({medication.dosage})</Typography>
                  <Typography variant="body2" className="text-muted-foreground">{medication.frequency}</Typography>
                  <Typography variant="body2" className="text-muted-foreground">{medication.purpose}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function DoctorPatientsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  const handleViewDetails = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setDetailDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
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
      title="Patient Management"
      description="View and manage your patient records."
    >
      <DoctorCard
        title="Patients List"
        actions={
          <>
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients..."
            />
            <Button
              variant="contained"
              startIcon={<UserPlus size={20} />}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            >
              Add Patient
            </Button>
          </>
        }
      >
        <TableContainer component={Paper} elevation={0} className="bg-card border border-border rounded-md">
          <Table>
            <TableHead>
              <TableRow className="bg-muted">
                <TableCell className="text-foreground font-semibold">Name</TableCell>
                <TableCell className="text-foreground font-semibold">Age</TableCell>
                <TableCell className="text-foreground font-semibold">Gender</TableCell>
                <TableCell className="text-foreground font-semibold">Condition</TableCell>
                <TableCell className="text-foreground font-semibold">Last Appointment</TableCell>
                <TableCell className="text-foreground font-semibold">Status</TableCell>
                <TableCell className="text-foreground font-semibold" align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="text-muted-foreground">
                    Loading patients data...
                  </TableCell>
                </TableRow>
              ) : filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="text-muted-foreground">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/40 transition-colors duration-200">
                    <TableCell className="text-foreground">{patient.name}</TableCell>
                    <TableCell className="text-foreground">{patient.age}</TableCell>
                    <TableCell className="text-foreground">{patient.gender}</TableCell>
                    <TableCell className="text-foreground">{patient.condition}</TableCell>
                    <TableCell className="text-foreground">{patient.lastAppointment}</TableCell>
                    <TableCell>
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
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => handleViewDetails(patient.id)}
                        className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
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
      </DoctorCard>

      {/* Patient Detail Dialog */}
      <PatientDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        patient={selectedPatient}
      />
    </DoctorPageContainer>
  );
} 