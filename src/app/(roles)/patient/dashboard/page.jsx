'use client';

import { Typography, Card, CardContent, Box, Grid, Paper } from '@mui/material';
import { User, Heart, Calendar, Pill, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200">
      <CardContent>
        <Box className="flex items-center mb-4">
          <Box className="p-3 rounded-full bg-blue-100 dark:bg-blue-700 mr-4">
             <IconComponent size={28} className="text-blue-600 dark:text-blue-200" />
          </Box>
          <Typography variant="h6" component="div" className="font-semibold">
            {title}
          </Typography>
        </Box>
        <Box className="text-gray-700 dark:text-gray-300">
           {children}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function PatientDashboardPage() {
  const patient = mockPatientData; // In a real app, fetch authenticated patient data

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Patient Dashboard
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          Welcome to your Patient Dashboard. This is where you can see an overview of your health information, appointments, and messages.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DashboardCard title="Upcoming Appointment" icon={Calendar}>
              {patient.upcomingAppointment ? (
                <Box className="space-y-2">
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
                <Box className="space-y-2">
                  {patient.recentPrescriptions.map(prescription => (
                    <Typography key={prescription.id} variant="body1"><strong>{prescription.date}:</strong> {prescription.medication}</Typography>
                  ))
                  }
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
        </Grid>
      </Paper>
    </motion.div>
  );
} 