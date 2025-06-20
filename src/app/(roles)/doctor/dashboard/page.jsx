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
import dynamic from 'next/dynamic';
const Calendar = dynamic(() => import('react-calendar'), { ssr: false });
import 'react-calendar/dist/Calendar.css';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { patients } from '@/mockdata/patients';
import { appointments } from '@/mockdata/appointments';
import { doctors } from '@/mockdata/doctors';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const getComputedCssVariable = (variableName) => {
  if (typeof window !== 'undefined') {
    let value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    // If it's an HSL value (contains %), replace spaces with commas
    if (value.includes('%')) {
      value = value.replace(/\s+/g, ', ');
    }
    // console.log(`CSS Variable ${variableName}:`, value);
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

  // State for calendar (simulate with just a date picker)
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // console.log('Theme mode changed:', mode);
    const primaryColorComponents = getComputedCssVariable('--primary');
    const successColorComponents = getComputedCssVariable('--success');
    const warningColorComponents = getComputedCssVariable('--warning');
    const errorColorComponents = getComputedCssVariable('--error');
    const borderColor = getComputedCssVariable('--border');
    const mutedForeground = getComputedCssVariable('--muted-foreground');

    // Colors for quick action Buttons (using hsl() directly)
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

  // Helper: get appointment dates for calendar
  const appointmentDates = appointments.map(app => {
    // Try to parse as Date
    const d = new Date(app.date);
    if (!isNaN(d)) return d.toDateString();
    return null;
  }).filter(Boolean);

  // Helper: highlight days with appointments (not used since no calendar)
  // function tileClassName({ date, view }) {
  //   if (view === 'month') {
  //     if (appointmentDates.includes(date.toDateString())) {
  //       return 'bg-primary/20 rounded-full text-primary font-semibold';
  //     }
  //   }
  //   return null;
  // }

  // Helper: show appointments for selected date
  const appointmentsForSelectedDate = appointments.filter(app => {
    const d = new Date(app.date);
    return d.toDateString() === selectedDate.toDateString();
  });

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
            <Card className="flex-grow rounded-xl shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between mb-2 p-4 pb-2">
                <div>
                  <CardTitle className="text-xl">Recent Patients</CardTitle>
                </div>
                <Button asChild variant="link" size="sm" className="px-0 py-0 h-auto">
                  <Link href="/doctor/patients" className="flex items-center gap-1">
                    View All <ChevronRight size={18} />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
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
                        <Button asChild variant="outline" size="sm" className="rounded-full px-4 py-2">
                          <Link href={`/doctor/patients/${patient._id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-3 flex flex-col">
            <Card className="flex-grow rounded-xl shadow-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl mb-2">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <Button asChild variant="outline" className="flex flex-col items-center justify-center gap-2 rounded-xl h-24 border-primary text-primary">
                    <Link href="/doctor/patients/new">
                      <UserPlus size={24} />
                      <span>New Patient</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex flex-col items-center justify-center gap-2 rounded-xl h-24 border-success text-success">
                    <Link href="/doctor/appointments/new">
                      <CalendarClock size={24} />
                      <span>Schedule</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex flex-col items-center justify-center gap-2 rounded-xl h-24 border-warning text-warning">
                    <Link href="/doctor/prescriptions/new">
                      <FileText size={24} />
                      <span>Prescription</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex flex-col items-center justify-center gap-2 rounded-xl h-24 border-error text-error">
                    <Link href="/doctor/messages">
                      <MessageSquare size={24} />
                      <span>Messages</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col">
            <Card className="flex-grow rounded-xl shadow-lg p-0">
              <CardContent className="p-0">
                <div className="p-4">
                  <label className="block mb-2 font-medium text-card-foreground" htmlFor="dashboard-calendar">
                    Calendar
                  </label>
                  <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="calendar-bg"
                    tileClassName={({ date, view }) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                      if (isSelected) return 'calendar-selected';
                      if (isToday) return 'calendar-today';
                      return null;
                    }}
                  />
                  <div className="mt-4">
                    <div className="font-semibold mb-2 text-card-foreground">
                      Appointments on {selectedDate.toLocaleDateString()}:
                    </div>
                    {appointmentsForSelectedDate.length === 0 ? (
                      <div className="text-muted-foreground text-sm">No appointments</div>
                    ) : (
                      <ul className="space-y-2">
                        {appointmentsForSelectedDate.map(app => (
                          <li key={app.id} className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{app.time}</span>
                            <span className="text-muted-foreground">-</span>
                            <span>{app.patient.firstName} {app.patient.lastName}</span>
                            <span className="ml-auto px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{app.status}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7 flex flex-col">
            <Card className="flex-grow rounded-xl shadow-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl mb-2">Appointments Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex-grow min-h-0">
                  <Bar key={mode} data={chartData.appointments} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-5 flex flex-col">
            <Card className="flex-grow rounded-xl shadow-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl mb-2">Patient Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex-grow min-h-0">
                  <Doughnut key={mode} data={chartData.patientDistribution} options={doughnutOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}