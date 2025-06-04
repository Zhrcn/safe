'use client';

import React, { useEffect } from 'react';
import {
  Box, Grid, CircularProgress, Button, Avatar, Typography, Chip, Skeleton
} from '@mui/material';
import {
  CalendarClock, Calendar, Pill, UserPlus, FileText, ArrowUpRight,
  Activity, Heart, Weight, Droplets, Clock, MapPin
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientData } from '@/store/patientSlice';
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

ChartJS.register(
  CategoryScale, 
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const dispatch = useDispatch();
  const {
    data: patientData,
    loading,
    error
  } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPatientData());
  }, [dispatch]);

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const dashboardData = {
    healthStats: [
      { 
        name: 'Blood Pressure', 
        value: patientData?.healthMetrics?.bloodPressure || '--/--' 
      },
      { 
        name: 'Heart Rate', 
        value: patientData?.healthMetrics?.heartRate ? `${patientData.healthMetrics.heartRate} bpm` : '--' 
      },
      { 
        name: 'Weight', 
        value: patientData?.healthMetrics?.weight ? `${patientData.healthMetrics.weight} kg` : '--' 
      },
      { 
        name: 'Blood Glucose', 
        value: patientData?.healthMetrics?.bloodGlucose ? `${patientData.healthMetrics.bloodGlucose} mg/dL` : '--' 
      }
    ],
    upcomingAppointments: patientData?.appointments?.slice(0, 3) || [],
    medications: patientData?.prescriptions?.slice(0, 3) || []
  };

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