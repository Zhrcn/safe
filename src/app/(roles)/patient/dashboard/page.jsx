'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Grid, CircularProgress, Button, Avatar, Typography, Chip, Skeleton
} from '@mui/material';
import {
  CalendarClock, Calendar, Pill, UserPlus, FileText, ArrowUpRight,
  Activity, Heart, Weight, Droplets, Clock, MapPin
} from 'lucide-react';
import { getPatientDashboardData } from '@/services/patientService';
import { PageContainer } from '@/components/common';
import Card from '@/components/ui/Card';
import CustomButton from '@/components/ui/Button';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Stat Card Component
function EnhancedStatCard({ title, value, icon, color, loading }) {
  return (
    <Card
      variant="elevated"
      className="h-full"
      hoverable
    >
      <Box className="flex items-center">
        <Box
          className={`rounded-full p-3 mr-4 ${color}`}
        >
          {icon}
        </Box>
        <Box>
          {loading ? (
            <>
              <Skeleton width={100} height={24} />
              <Skeleton width={60} height={36} />
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" className="font-medium">
                {title}
              </Typography>
              <Typography variant="h4" className="font-bold">
                {value}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}

// Appointment Card Component
function AppointmentCard({ appointment, loading }) {
  if (loading) {
    return (
      <Box className="p-4 border border-border rounded-lg shadow-sm hover:shadow-md transition-all">
        <Box className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <Box className="flex-1">
            <Skeleton width={150} height={24} />
            <Skeleton width={100} height={20} />
            <Skeleton width={120} height={20} />
          </Box>
          <Skeleton width={80} height={36} />
        </Box>
      </Box>
    );
  }

  return (
    <Card
      variant="outlined"
      bordered
      hoverable
      className="transition-all"
    >
      <Box className="flex items-center gap-4">
        <Avatar className="bg-blue-100 text-blue-600">
          {appointment.doctorName.charAt(0)}
        </Avatar>
        <Box className="flex-1">
          <Typography variant="subtitle1" className="font-medium">
            {appointment.doctorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.specialty}
          </Typography>
          <Box className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{appointment.date} at {appointment.time}</span>
          </Box>
          <Box className="flex items-center mt-1 text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{appointment.location}</span>
          </Box>
        </Box>
        <CustomButton
          variant="soft"
          color="primary"
          size="small"
        >
          Details
        </CustomButton>
      </Box>
    </Card>
  );
}

// Medication Card Component
function MedicationCard({ medication, loading }) {
  if (loading) {
    return (
      <Box className="p-4 border border-border rounded-lg shadow-sm">
        <Box className="flex justify-between items-start">
          <Box>
            <Skeleton width={150} height={24} />
            <Skeleton width={100} height={20} />
          </Box>
          <Skeleton width={80} height={30} />
        </Box>
        <Skeleton width={180} height={20} className="mt-2" />
      </Box>
    );
  }

  return (
    <Card variant="outlined" bordered hoverable>
      <Box className="flex justify-between items-start">
        <Box>
          <Typography variant="subtitle1" className="font-medium">
            {medication.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {medication.dosage}
          </Typography>
        </Box>
        <Chip
          label={medication.frequency}
          color="primary"
          size="small"
          variant="outlined"
        />
      </Box>
      <Box className="mt-2 flex items-center">
        <Clock size={14} className="mr-1 text-gray-500" />
        <Typography variant="body2" color="text.secondary">
          Prescribed by Dr. {medication.prescribedBy}
        </Typography>
      </Box>
    </Card>
  );
}

// Health Stat Card Component
function HealthStatCard({ stat, icon, color, loading }) {
  if (loading) {
    return (
      <Box className="text-center p-4 border border-border rounded-lg">
        <Skeleton width={60} height={60} variant="circular" className="mx-auto" />
        <Skeleton width={80} height={24} className="mx-auto mt-2" />
        <Skeleton width={120} height={20} className="mx-auto mt-1" />
      </Box>
    );
  }

  return (
    <Card variant="outlined" bordered className="text-center">
      <Box
        className={`rounded-full p-3 mx-auto mb-3 inline-flex ${color}`}
      >
        {icon}
      </Box>
      <Typography variant="h5" className="font-bold">
        {stat.value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {stat.name}
      </Typography>
      <Typography variant="caption" color="text.secondary" className="mt-1 block">
        Last updated: {stat.date}
      </Typography>
    </Card>
  );
}

// Blood Pressure Chart Component
function BloodPressureChart({ data, loading }) {
  const chartData = {
    labels: data?.bloodPressure?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Systolic',
        data: data?.bloodPressure?.map(item => item.systolic) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Diastolic',
        data: data?.bloodPressure?.map(item => item.diastolic) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 60,
        max: 160,
      },
    },
  };

  return (
    <Card title="Blood Pressure History" variant="elevated">
      {loading ? (
        <Box className="h-[300px] flex items-center justify-center">
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Box className="h-[300px] pt-4">
          <Line data={chartData} options={options} />
        </Box>
      )}
    </Card>
  );
}

export default function PatientDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await getPatientDashboardData();
        setDashboardData(data);

        // In a real app, you'd fetch this from an API
        // For now, we'll use mock data
        setHealthMetrics({
          bloodPressure: [
            { date: '2024-01-15', systolic: 145, diastolic: 95 },
            { date: '2024-02-15', systolic: 140, diastolic: 90 },
            { date: '2024-03-15', systolic: 135, diastolic: 88 },
            { date: '2024-04-15', systolic: 130, diastolic: 85 },
            { date: '2024-05-15', systolic: 128, diastolic: 84 },
            { date: '2024-06-15', systolic: 125, diastolic: 82 }
          ],
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');

        // Set fallback data if API fails
        setDashboardData({
          stats: {
            upcomingAppointments: 0,
            activeMedications: 0,
            lastCheckup: 'N/A',
            activeProviders: 0
          },
          upcomingAppointments: [],
          medications: [],
          healthStats: [
            { name: 'Blood Pressure', value: 'N/A', date: 'N/A' },
            { name: 'Heart Rate', value: 'N/A', date: 'N/A' },
            { name: 'Weight', value: 'N/A', date: 'N/A' },
            { name: 'Blood Glucose', value: 'N/A', date: 'N/A' }
          ],
          bloodPressure: []
        });

        setHealthMetrics({
          bloodPressure: [
            { date: '2024-01-15', systolic: 120, diastolic: 80 },
            { date: '2024-02-15', systolic: 122, diastolic: 82 },
            { date: '2024-03-15', systolic: 118, diastolic: 78 },
            { date: '2024-04-15', systolic: 121, diastolic: 79 },
            { date: '2024-05-15', systolic: 119, diastolic: 80 },
            { date: '2024-06-15', systolic: 120, diastolic: 81 }
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Loading skeletons
  if (loading && !dashboardData) {
    return (
      <PageContainer
        title="Dashboard"
        description="Welcome back to your health dashboard"
      >
        <Grid container spacing={3} className="mb-6">
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={400} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        </Grid>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Box className="text-center">
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <CustomButton
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </CustomButton>
        </Box>
      </Box>
    );
  }

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome back to your health dashboard"
    >
      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Upcoming Appointments"
            value={dashboardData?.stats.upcomingAppointments}
            icon={<Calendar className="h-5 w-5 text-white" />}
            color="bg-blue-500"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Active Medications"
            value={dashboardData?.stats.activeMedications}
            icon={<Pill className="h-5 w-5 text-white" />}
            color="bg-indigo-500"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Last Checkup"
            value={dashboardData?.stats.lastCheckup}
            icon={<FileText className="h-5 w-5 text-white" />}
            color="bg-emerald-500"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title="Active Providers"
            value={dashboardData?.stats.activeProviders}
            icon={<UserPlus className="h-5 w-5 text-white" />}
            color="bg-purple-500"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card
            title="Upcoming Appointments"
            subtitle="Your scheduled appointments"
            icon={<CalendarClock className="h-5 w-5 text-blue-500" />}
            actions={
              <CustomButton
                variant="soft"
                color="primary"
                size="small"
                href="/patient/appointments"
                endIcon={<ArrowUpRight size={16} />}
              >
                View All
              </CustomButton>
            }
            variant="elevated"
          >
            <Box className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <AppointmentCard key={index} loading={true} />
                ))
              ) : dashboardData.upcomingAppointments.length === 0 ? (
                <Box className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <Typography color="text.secondary">No upcoming appointments</Typography>
                  <CustomButton
                    variant="soft"
                    color="primary"
                    size="small"
                    className="mt-2"
                  >
                    Schedule New
                  </CustomButton>
                </Box>
              ) : (
                dashboardData.upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </Box>
          </Card>
        </Grid>

        {/* Current Medications */}
        <Grid item xs={12} md={6}>
          <Card
            title="Current Medications"
            subtitle="Your active prescriptions"
            icon={<Pill className="h-5 w-5 text-indigo-500" />}
            actions={
              <CustomButton
                variant="soft"
                color="secondary"
                size="small"
                href="/patient/medications"
                endIcon={<ArrowUpRight size={16} />}
              >
                View All
              </CustomButton>
            }
            variant="elevated"
          >
            <Box className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <MedicationCard key={index} loading={true} />
                ))
              ) : dashboardData.medications.length === 0 ? (
                <Box className="text-center py-6 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <Typography color="text.secondary">No active medications</Typography>
                </Box>
              ) : (
                dashboardData.medications.map((medication) => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))
              )}
            </Box>
          </Card>
        </Grid>

        {/* Health Stats */}
        <Grid item xs={12} md={8}>
          <BloodPressureChart data={healthMetrics} loading={loading} />
        </Grid>

        {/* Health Stats Summary */}
        <Grid item xs={12} md={4}>
          <Card
            title="Health Metrics"
            subtitle="Your latest measurements"
            icon={<Activity className="h-5 w-5 text-emerald-500" />}
            variant="elevated"
          >
            <Grid container spacing={2}>
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <Grid item xs={6} key={index}>
                    <HealthStatCard loading={true} />
                  </Grid>
                ))
              ) : (
                dashboardData.healthStats.map((stat, index) => {
                  let icon, color;

                  switch (stat.name) {
                    case 'Blood Pressure':
                      icon = <Activity className="h-5 w-5 text-white" />;
                      color = 'bg-red-500';
                      break;
                    case 'Heart Rate':
                      icon = <Heart className="h-5 w-5 text-white" />;
                      color = 'bg-pink-500';
                      break;
                    case 'Weight':
                      icon = <Weight className="h-5 w-5 text-white" />;
                      color = 'bg-blue-500';
                      break;
                    case 'Blood Glucose':
                      icon = <Droplets className="h-5 w-5 text-white" />;
                      color = 'bg-amber-500';
                      break;
                    default:
                      icon = <Activity className="h-5 w-5 text-white" />;
                      color = 'bg-gray-500';
                  }

                  return (
                    <Grid item xs={6} key={index}>
                      <HealthStatCard
                        stat={stat}
                        icon={icon}
                        color={color}
                      />
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
} 