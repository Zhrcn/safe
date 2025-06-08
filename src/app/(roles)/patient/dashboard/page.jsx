'use client';

import React, { useEffect } from 'react';
import {
  Box, Grid, CircularProgress, Button, Avatar, Typography, Chip, Skeleton,
  CardHeader, CardContent, Container, Paper
} from '@mui/material';
import { 
  User, Calendar, MapPin, Activity, Heart, Droplets, Weight, Pill, Clock, Edit3, PlusCircle, Search, Filter, ChevronDown, ChevronUp, AlertCircle, 
  CalendarClock, ArrowUpRight, FileText
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
import { blue } from '@mui/material/colors';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
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
      className="h-full transition-all duration-200 ease-in-out shadow-md hover:shadow-xl hover:translate-y-[-4px]"
    >
      <Box className="flex items-center p-4">
        <Box
          className={`rounded-full p-3 mr-4 ${color}`}
          sx={{
            backgroundColor: (theme) => `${color}15`,
            color: color,
          }}
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

function AppointmentCard({ appointment, loading, doctorsList }) {
  if (loading) {
    return (
      <Card variant="outlined" bordered className="p-4">
        <Box className="flex items-start">
          <Skeleton variant="circular" width={40} height={40} className="mr-3" />
          <Box className="flex-1">
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={16} className="mt-1" />
            <Skeleton width="80%" height={16} className="mt-2" />
            <Skeleton width="70%" height={16} className="mt-1" />
          </Box>
        </Box>
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card variant="outlined" bordered className="p-4">
        <Typography color="error">Appointment data is missing.</Typography>
      </Card>
    );
  }

  let displayDoctorName = 'Unknown Doctor';
  let displaySpecialty = 'N/A';
  let displayLocation = 'Virtual Consultation';
  let displayDate = 'Date TBD';
  let displayTime = 'Time TBD';

  if (doctorsList && appointment.doctorId) {
    const doctorProfile = doctorsList.find(
      (dp) => dp.user && (dp.user._id === appointment.doctorId || dp.user === appointment.doctorId)
    );
    if (doctorProfile && doctorProfile.user) {
      displayDoctorName = doctorProfile.user.name || 
                          `${doctorProfile.user.firstName || ''} ${doctorProfile.user.lastName || ''}`.trim();
      if (!displayDoctorName || displayDoctorName === 'Unknown Doctor') {
        displayDoctorName = `Dr. ${doctorProfile.user.lastName || `(ID: ${doctorProfile.user._id ? doctorProfile.user._id.toString().slice(-4) : 'N/A'})`}`;
      }
      displaySpecialty = doctorProfile.specialty || 'N/A';
    } else if (appointment.doctorId) {
      displayDoctorName = `Doctor (ID: ${appointment.doctorId.toString().slice(-4)})`;
    }
  }
  
  if (appointment.doctorName) displayDoctorName = appointment.doctorName;
  if (appointment.specialty) displaySpecialty = appointment.specialty;
  if (appointment.location) displayLocation = appointment.location;

  if (appointment.date) {
    try {
      displayDate = new Date(appointment.date).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { 
      console.warn("Invalid date format for appointment:", appointment.date, e);
      displayDate = String(appointment.date);
    }
  }
  displayTime = appointment.time || 'Time TBD';
  
  const avatarColor = blue[500];

  return (
    <Card 
      variant="outlined" 
      bordered
      className="transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-md"
    >
      <Box className="flex p-4 items-center">
        <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40 }} className="mr-3">
          <User size={20} />
        </Avatar>
        <Box className="flex-1">
          <Typography variant="subtitle1" className="font-medium">
            {displayDoctorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {displaySpecialty}
          </Typography>
          <Box className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{displayDate} at {displayTime}</span>
          </Box>
          <Box className="flex items-center mt-1 text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{displayLocation}</span>
          </Box>
          {appointment.status && (
            <Chip 
              label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} 
              size="small" 
              color={appointment.status === 'completed' ? 'success' : appointment.status === 'scheduled' ? 'primary' : 'default'}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <CustomButton
          variant="soft"
          color="primary"
          size="small"
          onClick={() => console.log('Clicked appointment details:', appointment)}
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
    <Card 
      variant="outlined" 
      bordered 
      className="transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-md"
    >
      <Box className="flex justify-between items-start p-4">
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
      <Box className="mt-2 flex items-center px-4 pb-4">
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
    <Card 
      variant="outlined" 
      bordered 
      className="text-center transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-md"
    >
      <Box
        className={`rounded-full p-3 mx-auto mb-3 inline-flex ${color}`}
        sx={{
          backgroundColor: (theme) => `${color}15`,
          color: color,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" className="font-bold">
        {stat.value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {stat.name}
      </Typography>
    </Card>
  );
}

function BloodPressureChart({ data, loading }) {
  if (loading) {
    return (
      <Card variant="outlined" bordered className="p-4">
        <Skeleton variant="rectangular" height={300} />
      </Card>
    );
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Systolic',
        data: data?.systolic || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Diastolic',
        data: data?.diastolic || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Pressure History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <Card 
      variant="outlined" 
      bordered
      className="transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-md"
    >
      <Box className="p-4">
        <Line key={JSON.stringify(chartData)} data={chartData} options={options} />
      </Box>
    </Card>
  );
}

export default function PatientDashboardPage() {
  const dispatch = useDispatch();
  const { data: patientData, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPatientData());
  }, [dispatch]);

  console.log('PatientDashboardPage RENDER - loading:', loading, 'error:', error, 'patientData:', patientData);

  if (loading) {
    return (
      <PageContainer>
        <Box className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Box className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Dashboard
          </Typography>
          <Typography color="text.secondary">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(getPatientData())}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold mb-2">
            Welcome back, {patientData?.firstName || 'Patient'}!
          </Typography>
          <Typography color="text.secondary">
            Here's an overview of your health status and upcoming appointments.
          </Typography>
        </Box>

        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Quick Stats */}
          <div className="w-full sm:w-1/2 md:w-1/4 px-3 mb-6">
            <EnhancedStatCard
              title="Upcoming Appointments"
              value={patientData?.upcomingAppointments?.length || 0}
              icon={<CalendarClock size={24} />}
              color="#3b82f6"
              loading={loading}
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 px-3 mb-6">
            <EnhancedStatCard
              title="Active Medications"
              value={patientData?.activeMedications?.length || 0}
              icon={<Pill size={24} />}
              color="#10b981"
              loading={loading}
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 px-3 mb-6">
            <EnhancedStatCard
              title="Recent Tests"
              value={patientData?.recentTests?.length || 0}
              icon={<Activity size={24} />}
              color="#8b5cf6"
              loading={loading}
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 px-3 mb-6">
            <EnhancedStatCard
              title="Health Score"
              value={patientData?.healthScore || 'N/A'}
              icon={<Heart size={24} />}
              color="#ef4444"
              loading={loading}
            />
          </div>

          {/* Health Stats */}
          <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
            <HealthStatCard
              stat={{ name: 'Heart Rate', value: patientData?.vitalSigns?.heartRate || 'N/A' }}
              icon={<Heart size={24} />}
              color="#ef4444"
              loading={loading}
            />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
            <HealthStatCard
              stat={{ name: 'Blood Pressure', value: patientData?.vitalSigns?.bloodPressure || 'N/A' }}
              icon={<Droplets size={24} />}
              color="#3b82f6"
              loading={loading}
            />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
            <HealthStatCard
              stat={{ name: 'Weight', value: patientData?.vitalSigns?.weight || 'N/A' }}
              icon={<Weight size={24} />}
              color="#10b981"
              loading={loading}
            />
          </div>

          {/* Blood Pressure Chart */}
          <div className="w-full lg:w-2/3 px-3 mb-6">
            <BloodPressureChart
              data={patientData?.vitalSigns?.bloodPressureHistory}
              loading={loading}
            />
          </div>

          {/* Upcoming Appointments */}
          <div className="w-full lg:w-1/3 px-3 mb-6">
            <Card variant="outlined" bordered>
              <CardHeader
                title="Upcoming Appointments"
                action={
                  <CustomButton
                    variant="soft"
                    color="primary"
                    size="small"
                    startIcon={<PlusCircle size={16} />}
                  >
                    New
                  </CustomButton>
                }
              />
              <CardContent>
                <Box className="space-y-4">
                  {loading ? (
                    Array(3).fill(0).map((_, index) => (
                      <AppointmentCard
                        key={index}
                        loading={true}
                      />
                    ))
                  ) : patientData?.upcomingAppointments?.length > 0 ? (
                    patientData.upcomingAppointments.map((appointment, index) => (
                      <AppointmentCard
                        key={index}
                        appointment={appointment}
                        doctorsList={patientData.doctorsList}
                      />
                    ))
                  ) : (
                    <Box className="text-center py-4">
                      <Typography color="text.secondary">
                        No upcoming appointments
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </div>

          {/* Active Medications */}
          <div className="w-full px-3 mb-6">
            <Card variant="outlined" bordered>
              <CardHeader
                title="Active Medications"
                action={
                  <Box className="flex items-center space-x-2">
                    <CustomButton
                      variant="soft"
                      color="primary"
                      size="small"
                      startIcon={<Search size={16} />}
                    >
                      Search
                    </CustomButton>
                    <CustomButton
                      variant="soft"
                      color="primary"
                      size="small"
                      startIcon={<Filter size={16} />}
                    >
                      Filter
                    </CustomButton>
                  </Box>
                }
              />
              <CardContent>
                <div className="flex flex-wrap -mx-3">
                  {loading ? (
                    Array(4).fill(0).map((_, index) => (
                      <div className="w-full sm:w-1/2 md:w-1/4 px-3 mb-6" key={index}>
                        <MedicationCard loading={true} />
                      </div>
                    ))
                  ) : patientData?.activeMedications?.length > 0 ? (
                    patientData.activeMedications.map((medication, index) => (
                      <div className="w-full sm:w-1/2 md:w-1/4 px-3 mb-6" key={index}>
                        <MedicationCard medication={medication} />
                      </div>
                    ))
                  ) : (
                    <div className="w-full px-3">
                      <Box className="text-center py-4">
                        <Typography color="text.secondary">
                          No active medications
                        </Typography>
                      </Box>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </PageContainer>
  );
}