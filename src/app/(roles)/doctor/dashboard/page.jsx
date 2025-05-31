'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Skeleton,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Users, 
  Calendar, 
  Clock, 
  Activity, 
  FileText,
  ChevronRight,
  MessageSquare,
  UserPlus,
  AlertCircle,
  BarChart4,
  CalendarClock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { getPatients, getAppointments, getPatientStatistics } from '@/services/doctorService';
import { PageContainer } from '@/components/common';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function DashboardStatCard({ title, value, icon: Icon, color, linkTo, loading }) {
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
          <Icon size={20} className="text-white" />
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
        {linkTo && !loading && (
          <Box className="ml-auto">
            <Button 
              component={Link} 
              href={linkTo}
              endIcon={<ChevronRight size={16} />}
              size="small"
              variant="soft"
            >
              View
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
}

function AppointmentCard({ appointment, loading }) {
  if (loading) {
    return (
      <Box className="mb-3">
        <Skeleton variant="rounded" height={100} />
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card 
      variant="outlined" 
      bordered 
      hoverable
      className="mb-3 transition-all"
    >
      <Box className="flex items-center mb-2">
        <Box className="mr-3">
          <Avatar className="bg-blue-100 text-blue-600">
            {appointment.patientName.charAt(0)}
          </Avatar>
        </Box>
        <Box className="flex-grow">
          <Typography variant="subtitle1" className="font-medium text-foreground">
            {appointment.patientName}
          </Typography>
          <Typography variant="body2" className="text-muted-foreground">
            {appointment.type}
          </Typography>
        </Box>
        <Chip 
          label={appointment.status} 
          size="small" 
          color={getStatusColor(appointment.status)}
          variant="outlined"
          className="ml-auto"
        />
      </Box>
      <Divider className="my-2" />
      <Box className="flex justify-between items-center">
        <Box className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          {appointment.date}
        </Box>
        <Box className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          {appointment.time}
        </Box>
        <Button 
          variant="soft" 
          color="primary" 
          size="xs"
        >
          Details
        </Button>
      </Box>
    </Card>
  );
}

function PatientListItem({ patient, loading }) {
  if (loading) {
    return (
      <Box className="mb-3">
        <Skeleton variant="rounded" height={80} />
      </Box>
    );
  }

  return (
    <Card 
      variant="outlined" 
      bordered 
      hoverable
      className="mb-3 transition-all"
    >
      <Box className="flex items-center">
        <Avatar className="mr-3">
          {patient.name.charAt(0)}
        </Avatar>
        <Box className="flex-grow">
          <Typography variant="subtitle1" className="font-medium">
            {patient.name}
          </Typography>
          <Box className="flex items-center text-sm text-gray-500">
            <Typography variant="body2" color="text.secondary">
              {patient.age} years • {patient.gender}
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="soft" 
          color="primary" 
          size="small"
          component={Link}
          href={`/doctor/patients/${patient.id}`}
        >
          View
        </Button>
      </Box>
    </Card>
  );
}

function AppointmentsChart({ data, loading }) {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'This Week',
        data: data?.thisWeek || [4, 6, 8, 7, 5, 3, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Last Week',
        data: data?.lastWeek || [3, 5, 7, 6, 4, 2, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderRadius: 4,
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
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card 
      title="Appointments Overview" 
      subtitle="Weekly comparison"
      icon={<BarChart4 className="h-5 w-5 text-blue-500" />}
      variant="elevated"
    >
      {loading ? (
        <Box className="h-[300px] flex items-center justify-center">
          <CircularProgress size={45} />
        </Box>
      ) : (
        <Box className="h-[300px] pt-4">
          <Bar data={chartData} options={options} />
        </Box>
      )}
    </Card>
  );
}

function PatientDistributionChart({ data, loading }) {
  const chartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: data?.genderDistribution || [55, 45],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    cutout: '60%',
  };

  return (
    <Card 
      title="Patient Distribution" 
      subtitle="By gender"
      icon={<Users className="h-5 w-5 text-purple-500" />}
      variant="elevated"
    >
      {loading ? (
        <Box className="h-[240px] flex items-center justify-center">
          <CircularProgress size={45} />
        </Box>
      ) : (
        <Box className="h-[240px] flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
        </Box>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientStats, setPatientStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Chart data
  const [chartData, setChartData] = useState({
    appointmentsData: {
      thisWeek: [4, 6, 8, 7, 5, 3, 0],
      lastWeek: [3, 5, 7, 6, 4, 2, 0],
    },
    genderDistribution: [55, 45],
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [patientsData, appointmentsData, statsData] = await Promise.all([
          getPatients(),
          getAppointments(),
          getPatientStatistics()
        ]);
        
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setPatientStats(statsData);
        
        // In a real app, this would come from the API
        setChartData({
          appointmentsData: {
            thisWeek: [4, 6, 8, 7, 5, 3, 0],
            lastWeek: [3, 5, 7, 6, 4, 2, 0],
          },
          genderDistribution: [55, 45],
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const recentPatients = patients.slice(0, 5);
  
  const upcomingAppointments = appointments
    .filter(a => a.status !== 'Rejected')
    .slice(0, 4);
  
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;

  // Get today's date in YYYY-MM-DD format safely
  const getTodayDateString = () => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch (err) {
      console.error('Date formatting error:', err);
      return '';
    }
  };
  
  const todayDateString = getTodayDateString();
  
  // Count today's appointments safely
  const todayAppointmentsCount = appointments.filter(a => {
    try {
      return a.date === todayDateString;
    } catch (err) {
      console.error('Error comparing appointment date:', err);
      return false;
    }
  }).length;
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome back! Here's an overview of your practice."
    >
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <DashboardStatCard 
            title="Total Patients" 
            value={patientStats?.totalPatients || 0} 
            icon={Users}
            color="bg-blue-500"
            linkTo="/doctor/patients"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardStatCard 
            title="Today's Appointments" 
            value={todayAppointmentsCount}
            icon={Calendar}
            color="bg-purple-500"
            linkTo="/doctor/appointments"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardStatCard 
            title="Pending Requests" 
            value={pendingAppointments} 
            icon={Clock}
            color="bg-amber-500"
            linkTo="/doctor/appointments"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardStatCard 
            title="Urgent Cases" 
            value={patientStats?.urgentCases || 0} 
            icon={AlertCircle}
            color="bg-red-500"
            loading={loading}
          />
        </Grid>
      </Grid>
      
      {/* Charts & Lists */}
      <Grid container spacing={3}>
        {/* Left Column - Charts */}
        <Grid item xs={12} md={8}>
          <AppointmentsChart data={chartData.appointmentsData} loading={loading} />
          
          <Box className="mt-6">
            <Card
              title="Today's Schedule"
              subtitle="Your appointments for today"
              icon={<CalendarClock className="h-5 w-5 text-emerald-500" />}
              actions={
                <Button 
                  variant="soft" 
                  color="primary" 
                  size="small"
                  href="/doctor/appointments"
                  endIcon={<ChevronRight size={16} />}
                >
                  View All
                </Button>
              }
              variant="elevated"
            >
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <AppointmentCard key={index} loading={true} />
                ))
              ) : upcomingAppointments.length === 0 ? (
                <Box className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <Typography color="text.secondary">No appointments scheduled for today</Typography>
                </Box>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </Card>
          </Box>
        </Grid>
        
        {/* Right Column - Patients */}
        <Grid item xs={12} md={4}>
          <PatientDistributionChart data={chartData} loading={loading} />
          
          <Box className="mt-6">
            <Card
              title="Recent Patients"
              subtitle="Your latest patient interactions"
              icon={<UserPlus className="h-5 w-5 text-blue-500" />}
              actions={
                <Button 
                  variant="soft" 
                  color="primary" 
                  size="small"
                  href="/doctor/patients"
                  endIcon={<ChevronRight size={16} />}
                >
                  View All
                </Button>
              }
              variant="elevated"
            >
              <Box className="mb-3">
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab 
                    label="Recent" 
                    icon={<Clock size={16} />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="Critical" 
                    icon={<AlertCircle size={16} />} 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
              
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <PatientListItem key={index} loading={true} />
                ))
              ) : recentPatients.length === 0 ? (
                <Box className="text-center py-6">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <Typography color="text.secondary">No patients found</Typography>
                </Box>
              ) : (
                tabValue === 0 ? (
                  recentPatients.map((patient) => (
                    <PatientListItem key={patient.id} patient={patient} />
                  ))
                ) : (
                  patients.filter(p => p.isCritical).slice(0, 5).map((patient) => (
                    <PatientListItem key={patient.id} patient={patient} />
                  ))
                )
              )}
            </Card>
          </Box>
          
          <Box className="mt-6">
            <Card
              title="Quick Actions"
              variant="elevated"
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="soft"
                    color="primary"
                    fullWidth
                    startIcon={<UserPlus size={18} />}
                    href="/doctor/patients/new"
                  >
                    New Patient
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="soft"
                    color="secondary"
                    fullWidth
                    startIcon={<CalendarClock size={18} />}
                    href="/doctor/appointments/new"
                  >
                    Schedule
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="soft"
                    color="success"
                    fullWidth
                    startIcon={<FileText size={18} />}
                    href="/doctor/prescriptions/new"
                  >
                    Prescription
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="soft"
                    color="info"
                    fullWidth
                    startIcon={<MessageSquare size={18} />}
                    href="/doctor/messaging"
                  >
                    Messages
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}