'use client';

import { Typography, Card, CardContent, Box, Grid } from '@mui/material';
import { User, Heart, Calendar, Pill, FileText } from 'lucide-react';

// Mock Patient Data (replace with actual authenticated patient data fetching)
const mockPatientData = {
  name: 'Patient A',
  age: 45,
  gender: 'Male',
  upcomingAppointment: {
    date: '2024-06-20',
    time: '10:00 AM',
    doctor: 'Dr. Ahmad Al-Ali',
  },
  recentPrescriptions: [
    { id: 1, medication: 'Amoxicillin', date: '2024-06-15' },
    { id: 2, medication: 'Lisinopril', date: '2024-06-10' },
  ],
  medicalHistorySummary: 'Diagnosed with Hypertension in 2020. No known allergies.',
};

// Placeholder Card Component for Dashboard sections
function DashboardCard({
  title,
  icon: IconComponent,
  children
}) {
  return (
    <Card className="h-full shadow-lg">
      <CardContent>
        <Box className="flex items-center mb-4">
          <IconComponent size={24} className="mr-3 text-blue-600" />
          <Typography variant="h6" component="div" className="font-semibold">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default function PatientDashboard() {
  const patient = mockPatientData; // In a real app, fetch authenticated patient data

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <Box className="flex items-center mb-4">
             <User size={40} className="mr-3 text-primary" />
             <Typography variant="h5" component="h1" className="font-bold">Welcome, {patient.name}!</Typography>
          </Box>
           <Typography variant="body1" color="text.secondary">View your health information and manage appointments.</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard title="Upcoming Appointment" icon={Calendar}>
            {patient.upcomingAppointment ? (
              <Box>
                <Typography variant="body1"><strong>Date:</strong> {patient.upcomingAppointment.date}</Typography>
                <Typography variant="body1"><strong>Time:</strong> {patient.upcomingAppointment.time}</Typography>
                <Typography variant="body1"><strong>Doctor:</strong> {patient.upcomingAppointment.doctor}</Typography>
              </Box>
            ) : (
              <Typography variant="body1">No upcoming appointments.</Typography>
            )}
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="Recent Prescriptions" icon={Pill}>
            {patient.recentPrescriptions.length > 0 ? (
              <Box>
                {patient.recentPrescriptions.map(prescription => (
                  <Typography key={prescription.id} variant="body1"><strong>{prescription.date}:</strong> {prescription.medication}</Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body1">No recent prescriptions on record.</Typography>
            )}
          </DashboardCard>
        </Grid>

        <Grid item xs={12}>
           <DashboardCard title="Medical History Summary" icon={FileText}>
             <Typography variant="body1">{patient.medicalHistorySummary}</Typography>
           </DashboardCard>
        </Grid>

        {/* Add more patient dashboard sections like vital signs, test results, etc. */}

      </Grid>
    </div>
  );
} 