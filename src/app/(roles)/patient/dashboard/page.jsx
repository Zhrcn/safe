'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Activity, Calendar, Pill, Clock, Heart, Droplets, Weight, Thermometer } from 'lucide-react';
import { PatientPageContainer, PatientCard, StatCard, ChartContainer, AppointmentStatusBadge, MedicationStatusBadge } from '@/components/patient/PatientComponents';
import { getPatientProfile, getAppointments, getPrescriptions, getHealthMetrics } from '@/services/patientService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [profileData, appointmentsData, prescriptionsData, metricsData] = await Promise.all([
          getPatientProfile(),
          getAppointments(),
          getPrescriptions(),
          getHealthMetrics()
        ]);

        setProfile(profileData);
        setAppointments(appointmentsData);
        setPrescriptions(prescriptionsData);
        setHealthMetrics(metricsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Get the most recent metrics
  const getLatestMetric = (metricType) => {
    if (!healthMetrics || !healthMetrics[metricType] || healthMetrics[metricType].length === 0) {
      return null;
    }
    return healthMetrics[metricType][healthMetrics[metricType].length - 1];
  };

  // Calculate trend direction
  const calculateTrend = (metricType, valueKey = 'value') => {
    if (!healthMetrics || !healthMetrics[metricType] || healthMetrics[metricType].length < 2) {
      return 'neutral';
    }

    const data = healthMetrics[metricType];
    const current = data[data.length - 1][valueKey];
    const previous = data[data.length - 2][valueKey];

    if (current < previous) return 'down';
    if (current > previous) return 'up';
    return 'neutral';
  };

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(
    appointment => new Date(appointment.date) >= new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filter active prescriptions
  const activePrescriptions = prescriptions.filter(
    prescription => prescription.status === 'Active'
  );

  return (
    <PatientPageContainer
      title="Patient Dashboard"
      description="Monitor your health, appointments, and prescriptions."
    >
      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <Typography className="text-muted-foreground">Loading dashboard data...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Health Metrics Cards */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Blood Pressure"
              value={getLatestMetric('bloodPressure') ?
                `${getLatestMetric('bloodPressure').systolic}/${getLatestMetric('bloodPressure').diastolic}` :
                'N/A'}
              trend={calculateTrend('bloodPressure', 'systolic')}
              icon={<Droplets />}
              description="Last measured today"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Heart Rate"
              value={getLatestMetric('heartRate') ? `${getLatestMetric('heartRate').value} bpm` : 'N/A'}
              trend={calculateTrend('heartRate')}
              icon={<Heart />}
              description="Last measured today"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Weight"
              value={getLatestMetric('weight') ? `${getLatestMetric('weight').value} kg` : 'N/A'}
              trend={calculateTrend('weight')}
              icon={<Weight />}
              description="Last measured today"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Blood Glucose"
              value={getLatestMetric('bloodGlucose') ? `${getLatestMetric('bloodGlucose').value} mg/dL` : 'N/A'}
              trend={calculateTrend('bloodGlucose')}
              icon={<Thermometer />}
              description="Last measured today"
            />
          </Grid>

          {/* Health Trends Chart */}
          <Grid item xs={12}>
            <ChartContainer title="Health Trends">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={healthMetrics?.bloodPressure.map((bp, index) => ({
                    date: bp.date,
                    systolic: bp.systolic,
                    diastolic: bp.diastolic,
                    heartRate: healthMetrics.heartRate[index]?.value,
                    weight: healthMetrics.weight[index]?.value,
                    glucose: healthMetrics.bloodGlucose[index]?.value
                  }))}
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
                  <Line type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic BP (mmHg)" />
                  <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" name="Diastolic BP (mmHg)" />
                  <Line type="monotone" dataKey="heartRate" stroke="#ff7300" name="Heart Rate (bpm)" />
                  <Line type="monotone" dataKey="glucose" stroke="#0088fe" name="Blood Glucose (mg/dL)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Upcoming Appointments */}
          <Grid item xs={12} md={6}>
            <PatientCard
              title="Upcoming Appointments"
              actions={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Calendar size={16} />}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  Schedule New
                </Button>
              }
            >
              {upcomingAppointments.length === 0 ? (
                <Box className="text-center py-6">
                  <Calendar size={40} className="mx-auto text-muted-foreground mb-2" />
                  <Typography variant="body1" className="text-muted-foreground">
                    No upcoming appointments
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    Schedule a new appointment to see your doctor
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} className="bg-transparent">
                  <Table>
                    <TableHead>
                      <TableRow className="bg-muted/50">
                        <TableCell className="text-foreground font-medium">Doctor</TableCell>
                        <TableCell className="text-foreground font-medium">Date & Time</TableCell>
                        <TableCell className="text-foreground font-medium">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingAppointments.slice(0, 5).map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-muted/30">
                          <TableCell>
                            <Typography variant="body2" className="font-medium text-foreground">
                              {appointment.doctorName}
                            </Typography>
                            <Typography variant="caption" className="text-muted-foreground">
                              {appointment.doctorSpecialty}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" className="text-foreground">
                              {appointment.date}
                            </Typography>
                            <Typography variant="caption" className="text-muted-foreground">
                              {appointment.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <AppointmentStatusBadge status={appointment.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {upcomingAppointments.length > 0 && (
                <Box className="mt-3 text-right">
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<Clock size={16} />}
                    className="text-primary hover:bg-primary/10"
                  >
                    View All Appointments
                  </Button>
                </Box>
              )}
            </PatientCard>
          </Grid>

          {/* Active Medications */}
          <Grid item xs={12} md={6}>
            <PatientCard
              title="Current Medications"
              actions={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Pill size={16} />}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  Request Refill
                </Button>
              }
            >
              {activePrescriptions.length === 0 ? (
                <Box className="text-center py-6">
                  <Pill size={40} className="mx-auto text-muted-foreground mb-2" />
                  <Typography variant="body1" className="text-muted-foreground">
                    No active medications
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    Your prescribed medications will appear here
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} className="bg-transparent">
                  <Table>
                    <TableHead>
                      <TableRow className="bg-muted/50">
                        <TableCell className="text-foreground font-medium">Medication</TableCell>
                        <TableCell className="text-foreground font-medium">Dosage</TableCell>
                        <TableCell className="text-foreground font-medium">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activePrescriptions.slice(0, 5).map((prescription) => (
                        <TableRow key={prescription.id} className="hover:bg-muted/30">
                          <TableCell>
                            <Typography variant="body2" className="font-medium text-foreground">
                              {prescription.medication}
                            </Typography>
                            <Typography variant="caption" className="text-muted-foreground">
                              {prescription.frequency}
                            </Typography>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {prescription.dosage}
                          </TableCell>
                          <TableCell>
                            <MedicationStatusBadge status={prescription.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {activePrescriptions.length > 0 && (
                <Box className="mt-3 text-right">
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<Activity size={16} />}
                    className="text-primary hover:bg-primary/10"
                  >
                    View All Medications
                  </Button>
                </Box>
              )}
            </PatientCard>
          </Grid>
        </Grid>
      )}
    </PatientPageContainer>
  );
} 