'use client';

import React, { useEffect } from 'react';
import {
  Box, Grid, CircularProgress, Button, Avatar, Typography, Chip, Skeleton,
  CardHeader, CardContent
} from '@mui/material';
import { 
  User, Calendar, MapPin, Activity, Heart, Droplets, Weight, Pill, Clock, Edit3, PlusCircle, Search, Filter, ChevronDown, ChevronUp, AlertCircle, 
  CalendarClock, ArrowUpRight, FileText
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientData, setFetchedPatientData, fetchVitalSignsByMedicalFileId } from '@/store/patientSlice';
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
  let displayLocation = 'Virtual Consultation'; // Default location
  let displayDate = 'Date TBD';
  let displayTime = 'Time TBD';

  if (doctorsList && appointment.doctorId) {
    const doctorProfile = doctorsList.find(
      (dp) => dp.user && (dp.user._id === appointment.doctorId || dp.user === appointment.doctorId)
    );
    if (doctorProfile && doctorProfile.user) {
      displayDoctorName = doctorProfile.user.name || 
                          `${doctorProfile.user.firstName || ''} ${doctorProfile.user.lastName || ''}`.trim();
      if (!displayDoctorName || displayDoctorName === 'Unknown Doctor') { // Ensure a fallback if name parts are empty
           displayDoctorName = `Dr. ${doctorProfile.user.lastName || `(ID: ${doctorProfile.user._id ? doctorProfile.user._id.toString().slice(-4) : 'N/A'})`}`;
      }
      displaySpecialty = doctorProfile.specialty || 'N/A';
    } else if (appointment.doctorId) {
      // Fallback if doctor not found in populated list, but we have an ID
      displayDoctorName = `Doctor (ID: ${appointment.doctorId.toString().slice(-4)})`;
    }
  }
  
  // Allow direct properties on appointment to override, if they exist (e.g. API might provide them directly later)
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
      displayDate = String(appointment.date); // Show raw date if formatting fails
    }
  }
  displayTime = appointment.time || 'Time TBD';
  
  const avatarColor = blue[500]; // Use imported blue color

  return (
    <Card variant="outlined" bordered>
      <Box className="flex p-4 items-center">
        <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40 }} className="mr-3">
          <User size={20} /> {/* User icon from lucide-react */}
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
          onClick={() => console.log('Clicked appointment details:', appointment)} // Example action
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
  const { data: patientData, loading: patientLoading, error: patientError,
    vitalSigns, vitalSignsLoading, vitalSignsError 
  } = useSelector((state) => state.patient);
  const { currentUser } = useSelector((state) => state.user); // Get currentUser

  useEffect(() => {
    if (currentUser && currentUser.id) { // Check for currentUser.id
      // Assumed: patient-specific data from login is in 'currentUser.patientDetails'
      // Assumed: patient ID for API call is 'currentUser.id'
      if (currentUser.roleDetails && !patientData) {
        console.log('PatientDashboard: Populating from currentUser.roleDetails (and ID exists)');
        dispatch(setFetchedPatientData(currentUser.roleDetails));
      } else if (!patientData) { // If not in currentUser or patientData is still null, fetch from API
        console.log('PatientDashboard: Fetching data via getPatientData API for user ID:', currentUser.id);
        dispatch(getPatientData(currentUser.id)); // Pass patientId
      }
    } else {
      if (currentUser && !currentUser.id) {
        console.log('PatientDashboard: currentUser exists but currentUser.id is missing. Waiting for ID.');
      } else {
        console.log('PatientDashboard: No currentUser, cannot fetch patient data yet.');
      }
      // Optionally, handle case where currentUser is not yet available (e.g., show loading or redirect)
    }
  }, [dispatch, currentUser, patientData]);

  useEffect(() => {
    if (patientData && patientData.medicalFile && !vitalSigns.length && !vitalSignsLoading) {
      // patientData.medicalFile should be the ID of the medical file
      dispatch(fetchVitalSignsByMedicalFileId(patientData.medicalFile));
    }
  }, [dispatch, patientData, vitalSigns, vitalSignsLoading]);

  console.log('PatientDashboardPage RENDER - loading:', patientLoading, 'error:', patientError, 'patientData:', patientData);
  if (patientLoading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (patientError) return <div className="p-4 text-red-500">Error: {patientError}</div>;

  if (!patientData) {
    return (
      <PageContainer title="Dashboard" description="Welcome back to your health dashboard">
        <Grid container spacing={3} className="mb-6">
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={`skel-stat-${index}`}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}><Skeleton variant="rounded" height={400} /></Grid>
          <Grid item xs={12} md={6}><Skeleton variant="rounded" height={400} /></Grid>
          <Grid item xs={12}><Skeleton variant="rounded" height={300} /></Grid>
        </Grid>
      </PageContainer>
    );
  }

  // Derive healthStats from the latest vital signs entry
  const latestVitalSign = vitalSigns && vitalSigns.length > 0 ? vitalSigns[vitalSigns.length - 1] : null;

  const healthStats = latestVitalSign ? [
    { title: 'Heart Rate', value: latestVitalSign.heartRate ? `${latestVitalSign.heartRate} bpm` : 'N/A', icon: <Activity size={24} />, color: 'bg-red-100 text-red-600' },
    { title: 'Blood Pressure', value: latestVitalSign.bloodPressure || 'N/A', icon: <Heart size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Temperature', value: latestVitalSign.temperature ? `${latestVitalSign.temperature}°C` : 'N/A', icon: <Droplets size={24} />, color: 'bg-green-100 text-green-600' }, // Changed Blood Sugar to Temperature
    { title: 'Weight', value: latestVitalSign.weight ? `${latestVitalSign.weight} kg` : 'N/A', icon: <Weight size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    // You can add height here if needed, or other stats from latestVitalSign
  ] : Array(4).fill({}); 

  const upcomingAppointments = patientData?.appointments?.slice(0, 3) || [];
  const medications = patientData?.prescriptions?.slice(0, 3) || [];
  const bloodPressureData = patientData?.healthMetrics?.bloodPressureHistory || [];

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome back to your health dashboard"
    >
      <Grid container spacing={3} className="mb-6">
        {healthStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <EnhancedStatCard 
              loading={patientLoading || vitalSignsLoading || !latestVitalSign} // Show loading if patient/vitals are loading OR if no latestVitalSign yet
              title={stat.title}
              value={stat.value}
              icon={stat.icon} // stat.icon is already a JSX element e.g. <Activity size={24} />
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Upcoming Appointments" />
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt, index) => (
                  <AppointmentCard key={appt._id || index} appointment={appt} loading={patientLoading} doctorsList={patientData?.doctorsList || []} />
                ))
              ) : (
                <Typography>No upcoming appointments.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Current Medications" />
            <CardContent>
              {medications.length > 0 ? (
                medications.map((med, index) => (
                  <MedicationCard key={med._id || index} medication={med} loading={!patientData} />
                ))
              ) : (
                <Typography>No current medications.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {patientData?.healthMetrics?.bloodPressureHistory && bloodPressureData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Blood Pressure Trend" />
              <CardContent>
                <BloodPressureChart data={bloodPressureData} loading={!patientData} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  );
}