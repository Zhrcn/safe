'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Users, 
  Calendar, 
  Clock, 
  Activity, 
  FileText,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { getPatients, getAppointments, getPatientStatistics } from '@/services/doctorService';
import PatientCard from '@/components/doctor/PatientCard';

// Dashboard Stat Card component
function DashboardStatCard({ title, value, icon: Icon, color, linkTo }) {
  return (
    <Card className="border border-border bg-card transition-all duration-200 hover:shadow-md">
      <CardContent>
        <Box className="flex items-center">
          <Box className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${color}`}>
            <Icon size={24} className="text-white" />
          </Box>
          <Box>
            <Typography variant="h6" className="font-bold text-foreground">
              {value}
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              {title}
            </Typography>
          </Box>
          {linkTo && (
            <Box className="ml-auto">
              <Button 
                component={Link} 
                href={linkTo}
                endIcon={<ChevronRight size={16} />}
                size="small"
                className="text-primary hover:bg-primary/10"
              >
                View
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// Appointment card component
function AppointmentCard({ appointment }) {
  return (
    <Card className="border border-border bg-card mb-3 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <Box className="flex items-center mb-2">
          <Box className="mr-3">
            <Clock size={20} className="text-primary" />
          </Box>
          <Box className="flex-grow">
            <Typography variant="body1" className="font-medium text-foreground">
              {appointment.time}
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              {appointment.date}
            </Typography>
          </Box>
          <Chip 
            label={appointment.status} 
            size="small" 
            color={
              appointment.status === 'Confirmed' ? 'success' : 
              appointment.status === 'Pending' ? 'warning' : 'default'
            }
            className="ml-auto"
          />
        </Box>
        <Box className="mt-2">
          <Typography variant="body1" className="text-foreground">
            {appointment.patientName}
          </Typography>
          <Typography variant="body2" className="text-muted-foreground">
            {appointment.type}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientStats, setPatientStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Load data in parallel
        const [patientsData, appointmentsData, statsData] = await Promise.all([
          getPatients(),
          getAppointments(),
          getPatientStatistics()
        ]);
        
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setPatientStats(statsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Get recent patients (last 3)
  const recentPatients = patients.slice(0, 3);
  
  // Get upcoming appointments (next 4)
  const upcomingAppointments = appointments
    .filter(a => a.status !== 'Rejected')
    .slice(0, 4);
  
  // Count pending appointments
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;

  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Doctor Dashboard
        </Typography>
        <Typography variant="body1" className="text-muted-foreground">
          Welcome back! Here's an overview of your practice.
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={2} className="mb-4 md:mb-6">
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <DashboardStatCard 
                title="Total Patients" 
                value={patientStats?.totalPatients || 0} 
                icon={Users}
                color="bg-blue-500"
                linkTo="/doctor/patients"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <DashboardStatCard 
                title="Today's Appointments" 
                value={appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} 
                icon={Calendar}
                color="bg-purple-500"
                linkTo="/doctor/appointments"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <DashboardStatCard 
                title="Pending Requests" 
                value={pendingAppointments} 
                icon={Clock}
                color="bg-amber-500"
                linkTo="/doctor/appointments"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <DashboardStatCard 
                title="Urgent Cases" 
                value={patientStats?.urgentCases || 0} 
                icon={Activity}
                color="bg-red-500"
                linkTo="/doctor/patients"
              />
            </Grid>
          </Grid>
          
          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Left Column - Recent Patients */}
            <Grid item xs={12} lg={8}>
              <Paper className="p-4 md:p-6 bg-card border border-border rounded-lg mb-4 md:mb-6">
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <Typography variant="h6" className="font-bold text-foreground mb-2 sm:mb-0">
                    Recent Patients
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/doctor/patients"
                    endIcon={<ChevronRight size={16} />}
                    className="text-primary hover:bg-primary/10"
                  >
                    View All
                  </Button>
                </Box>
                <Divider className="mb-4" />
                
                {recentPatients.length === 0 ? (
                  <Typography className="text-muted-foreground py-4 text-center">
                    No patients found
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {recentPatients.map(patient => (
                      <Grid item xs={12} sm={6} md={4} key={patient.id}>
                        <PatientCard patient={patient} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
              
              <Paper className="p-4 md:p-6 bg-card border border-border rounded-lg">
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <Typography variant="h6" className="font-bold text-foreground mb-2 sm:mb-0">
                    Patient Overview
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/doctor/analytics"
                    endIcon={<ChevronRight size={16} />}
                    className="text-primary hover:bg-primary/10"
                  >
                    View Analytics
                  </Button>
                </Box>
                <Divider className="mb-4" />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className="border border-border bg-card">
                      <CardContent>
                        <Box className="flex flex-col items-center text-center">
                          <Typography variant="h5" className="font-bold text-foreground mb-1">
                            {patientStats?.activePatients || 0}
                          </Typography>
                          <Typography variant="body2" className="text-muted-foreground">
                            Active Patients
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className="border border-border bg-card">
                      <CardContent>
                        <Box className="flex flex-col items-center text-center">
                          <Typography variant="h5" className="font-bold text-foreground mb-1">
                            {patientStats?.byCondition?.[0]?.condition || 'N/A'}
                          </Typography>
                          <Typography variant="body2" className="text-muted-foreground">
                            Most Common Condition
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className="border border-border bg-card">
                      <CardContent>
                        <Box className="flex flex-col items-center text-center">
                          <Typography variant="h5" className="font-bold text-foreground mb-1">
                            {patientStats ? (patientStats.totalPatients / patientStats.activePatients).toFixed(1) : 'N/A'}
                          </Typography>
                          <Typography variant="body2" className="text-muted-foreground">
                            Avg. Conditions per Patient
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Right Column - Appointments and Quick Actions */}
            <Grid item xs={12} lg={4}>
              <Paper className="p-4 md:p-6 bg-card border border-border rounded-lg mb-4 md:mb-6">
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <Typography variant="h6" className="font-bold text-foreground mb-2 sm:mb-0">
                    Upcoming Appointments
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/doctor/appointments"
                    endIcon={<ChevronRight size={16} />}
                    className="text-primary hover:bg-primary/10"
                  >
                    View All
                  </Button>
                </Box>
                <Divider className="mb-4" />
                
                {upcomingAppointments.length === 0 ? (
                  <Typography className="text-muted-foreground py-4 text-center">
                    No upcoming appointments
                  </Typography>
                ) : (
                  upcomingAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                )}
              </Paper>
              
              <Paper className="p-4 md:p-6 bg-card border border-border rounded-lg">
                <Typography variant="h6" className="font-bold text-foreground mb-4">
                  Quick Actions
                </Typography>
                <Divider className="mb-4" />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      href="/doctor/patients"
                      variant="outlined"
                      fullWidth
                      startIcon={<Users size={18} />}
                      className="p-2 md:p-3 h-auto border-border text-foreground hover:bg-muted/50"
                    >
                      <Box className="text-center w-full">
                        <Typography variant="body2" className="font-medium">
                          Add Patient
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      href="/doctor/appointments"
                      variant="outlined"
                      fullWidth
                      startIcon={<Calendar size={18} />}
                      className="p-2 md:p-3 h-auto border-border text-foreground hover:bg-muted/50"
                    >
                      <Box className="text-center w-full">
                        <Typography variant="body2" className="font-medium">
                          Schedule
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      href="/doctor/messaging"
                      variant="outlined"
                      fullWidth
                      startIcon={<MessageSquare size={18} />}
                      className="p-2 md:p-3 h-auto border-border text-foreground hover:bg-muted/50"
                    >
                      <Box className="text-center w-full">
                        <Typography variant="body2" className="font-medium">
                          Messages
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      href="/doctor/medicine"
                      variant="outlined"
                      fullWidth
                      startIcon={<FileText size={18} />}
                      className="p-2 md:p-3 h-auto border-border text-foreground hover:bg-muted/50"
                    >
                      <Box className="text-center w-full">
                        <Typography variant="body2" className="font-medium">
                          Medicines
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}