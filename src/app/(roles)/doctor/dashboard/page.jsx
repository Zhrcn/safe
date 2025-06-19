'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  CalendarClock, 
  FileText, 
  MessageSquare, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import CalendarComponent from '@/components/doctor/CalendarComponent';
// import { useGetPatientsQuery, useGetAppointmentsQuery, useGetProfileQuery } from '@/store/services/doctor/doctorApi';
// import { useAppSelector } from '@/store/hooks';
// import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { patients } from '@/mockdata/patients';
import { appointments } from '@/mockdata/appointments';
import { doctors } from '@/mockdata/doctors';
import { useTheme } from '@/components/ThemeProviderWrapper';

const getComputedCssVariable = (variableName) => {
  if (typeof window !== 'undefined') {
    let value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    // If it's an HSL value (contains %), replace spaces with commas
    if (value.includes('%')) {
      value = value.replace(/\s+/g, ', ');
    }
    console.log(`CSS Variable ${variableName}:`, value);
    return value;
  }
  return ''; 
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DoctorDashboard() {
  const { mode } = useTheme();

  // State to hold chart data, which will be updated on theme change
  const [chartData, setChartData] = useState({
    appointments: {
      labels: [],
      datasets: [],
    },
    patientDistribution: {
      labels: [],
      datasets: [],
    },
  });

  const [chartOptions, setChartOptions] = useState({});
  const [doughnutOptions, setDoughnutOptions] = useState({});

  const [quickActionColors, setQuickActionColors] = useState({
    primary: '',
    success: '',
    warning: '',
    destructive: '',
  });

  useEffect(() => {
    console.log('Theme mode changed:', mode);
    const primaryColorComponents = getComputedCssVariable('--primary');
    const successColorComponents = getComputedCssVariable('--success');
    const warningColorComponents = getComputedCssVariable('--warning');
    const errorColorComponents = getComputedCssVariable('--error');
    const borderColor = getComputedCssVariable('--border');
    const mutedForeground = getComputedCssVariable('--muted-foreground');

    console.log('Primary Color Components:', primaryColorComponents);
    console.log('Success Color Components:', successColorComponents);
    console.log('Warning Color Components:', warningColorComponents);
    console.log('Error Color Components:', errorColorComponents);

    // Colors for quick action buttons (using hsl() directly)
    const primaryColor = `hsl(${primaryColorComponents})`;
    const successColor = `hsl(${successColorComponents})`;
    const warningColor = `hsl(${warningColorComponents})`;
    const destructiveColor = `hsl(${errorColorComponents})`;

    const newAppointmentsChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Appointments',
          data: [12, 19, 15, 17, 14, 8, 5],
          backgroundColor: `hsla(${primaryColorComponents}, 0.6)`,
          borderColor: `hsl(${primaryColorComponents})`,
          borderWidth: 1,
        },
      ],
    };

    const newPatientDistributionChartData = {
      labels: ['New', 'Follow-up', 'Emergency', 'Regular'],
      datasets: [
        {
          data: [30, 25, 15, 30],
          backgroundColor: [
            `hsla(${primaryColorComponents}, 0.6)`,
            `hsla(${successColorComponents}, 0.6)`,
            `hsla(${warningColorComponents}, 0.6)`,
            `hsla(${errorColorComponents}, 0.6)`,
          ],
          borderColor: [
            `hsl(${primaryColorComponents})`,
            `hsl(${successColorComponents})`,
            `hsl(${warningColorComponents})`,
            `hsl(${errorColorComponents})`,
          ],
          borderWidth: 1,
        },
      ],
    };

    console.log('New Appointments Chart Data:', newAppointmentsChartData);
    console.log('New Patient Distribution Chart Data:', newPatientDistributionChartData);

    const newChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      grid: {
        display: true,
            color: borderColor,
      },
        ticks: {
            color: mutedForeground,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
            color: mutedForeground,
      },
    },
      },
  };

    const newDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
      position: 'bottom',
      labels: {
            color: mutedForeground,
      },
    },
  },
};

    setChartData({
      appointments: newAppointmentsChartData,
      patientDistribution: newPatientDistributionChartData,
    });
    setChartOptions(newChartOptions);
    setDoughnutOptions(newDoughnutOptions);

    setQuickActionColors({
      primary: primaryColor,
      success: successColor,
      warning: warningColor,
      destructive: destructiveColor,
    });

    console.log('Updated Chart Options:', newChartOptions);
    console.log('Updated Doughnut Options:', newDoughnutOptions);

  }, [mode]);

  // Use only mock data
  const recentPatients = patients.slice(0, 3).map(patient => ({
    _id: patient.id,
    firstName: patient.user.firstName,
    lastName: patient.user.lastName,
    lastVisit: patient.updatedAt
  }));

  const upcomingAppointments = appointments.map(app => ({
    id: app.id,
    date: app.date,
    time: app.time,
    patientName: `${app.patient.firstName || ''} ${app.patient.lastName || ''}`.trim(),
    status: app.status
  }));

  const doctorName = doctors[0].user.firstName;

  const overallLoading = false;
  const overallError = false;

  if (overallLoading) {
    return <LoadingSpinner />;
  }

  if (overallError) {
    return <ErrorMessage message="Failed to load dashboard data." />;
  }

  return (
    <div className="p-8 bg-background min-h-screen text-foreground flex justify-center">
      <div className="w-full max-w-screen-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-card-foreground">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Welcome back, {doctorName}</p>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-8">

          <div className="col-span-12 md:col-span-5 flex flex-col">
            <div className="bg-card rounded-2xl shadow-lg border border-border flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-card-foreground">Recent Patients</h2>
                  <Link 
                    href="/doctor/patients"
                    className="text-primary hover:text-secondary text-base font-medium flex items-center gap-1 transition-colors duration-200"
                  >
                    View All
                    <ChevronRight size={18} />
                  </Link>
                </div>
                <div className="border-b border-muted mb-4" />
                {recentPatients.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Users size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-base">No recent patients found</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 flex-grow">
                    {recentPatients.map((patient) => (
                      <div key={patient._id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-card-foreground font-semibold text-lg">
                          {patient.firstName?.[0]}{patient.lastName?.[0]}
                        </div>
                        <div className="flex-grow">
                          <p className="text-base font-medium text-card-foreground">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Link
                          href={`/doctor/patients/${patient._id}`}
                          className="text-primary hover:text-secondary text-sm font-medium px-4 py-2 rounded-full hover:bg-muted transition-colors duration-200"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 flex flex-col">
            <div className="bg-card rounded-2xl shadow-lg border border-border flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <Link
                    href="/doctor/patients/new"
                    className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-primary hover:bg-muted transition-colors duration-200 text-sm font-medium h-24 text-primary"
                  >
                    <UserPlus size={24} />
                    <span>New Patient</span>
                  </Link>
                  <Link
                    href="/doctor/appointments/new"
                    className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-success hover:bg-muted transition-colors duration-200 text-sm font-medium h-24 text-success"
                  >
                    <CalendarClock size={24} />
                    <span>Schedule</span>
                  </Link>
                  <Link
                    href="/doctor/prescriptions/new"
                    className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-warning hover:bg-muted transition-colors duration-200 text-sm font-medium h-24 text-warning"
                  >
                    <FileText size={24} />
                    <span>Prescription</span>
                  </Link>
                  <Link
                    href="/doctor/messages"
                    className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-error hover:bg-muted transition-colors duration-200 text-sm font-medium h-24 text-error"
                  >
                    <MessageSquare size={24} />
                    <span>Messages</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col">
            <CalendarComponent appointments={upcomingAppointments} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">

          <div className="col-span-12 md:col-span-7 flex flex-col">
            <div className="bg-card rounded-2xl shadow-lg border border-border flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">Appointments Overview</h2>
                <div className="flex-grow min-h-0">
                  <Bar key={mode} data={chartData.appointments} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 flex flex-col">
            <div className="bg-card rounded-2xl shadow-lg border border-border flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">Patient Distribution</h2>
                <div className="flex-grow min-h-0">
                  <Doughnut key={mode} data={chartData.patientDistribution} options={doughnutOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}