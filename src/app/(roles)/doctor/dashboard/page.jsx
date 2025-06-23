'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  CalendarClock,
  FileText,
  MessageSquare,
  Users,
  ChevronRight,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const THEME_COLORS = {
  light: {
    primary: '#2563eb',
    card: '#fff',
    cardForeground: '#18181b',
    mutedForeground: '#6b7280',
    border: '#e5e7eb',
    muted: '#f3f4f6',
    success: '#22c55e',
    warning: '#f59e42',
    destructive: '#ef4444',
    primaryBg: 'hsla(222, 47%, 11%, 0.08)',
    primaryBgChart: 'hsla(222, 47%, 11%, 0.7)',
    primaryBgChartHover: 'hsla(222, 47%, 11%, 0.9)',
    successBg: 'hsla(142, 71%, 45%, 0.08)',
    successBgChart: 'hsla(142, 71%, 45%, 0.7)',
    warningBg: 'hsla(36, 100%, 50%, 0.08)',
    warningBgChart: 'hsla(36, 100%, 50%, 0.7)',
    destructiveBg: 'hsla(0, 84%, 60%, 0.08)',
    destructiveBgChart: 'hsla(0, 84%, 60%, 0.7)',
    shadowLg: '0 4px 24px 0 rgba(0,0,0,0.10)',
    shadowXl: '0 8px 32px 0 rgba(0,0,0,0.16)',
  },
  dark: {
    primary: '#2563eb',
    card: '#18181b',
    cardForeground: '#fff',
    mutedForeground: '#a1a1aa',
    border: '#27272a',
    muted: '#27272a',
    success: '#22c55e',
    warning: '#f59e42',
    destructive: '#ef4444',
    primaryBg: 'hsla(222, 47%, 11%, 0.12)',
    primaryBgChart: 'hsla(222, 47%, 11%, 0.7)',
    primaryBgChartHover: 'hsla(222, 47%, 11%, 0.9)',
    successBg: 'hsla(142, 71%, 45%, 0.12)',
    successBgChart: 'hsla(142, 71%, 45%, 0.7)',
    warningBg: 'hsla(36, 100%, 50%, 0.12)',
    warningBgChart: 'hsla(36, 100%, 50%, 0.7)',
    destructiveBg: 'hsla(0, 84%, 60%, 0.12)',
    destructiveBgChart: 'hsla(0, 84%, 60%, 0.7)',
    shadowLg: '0 4px 24px 0 rgba(0,0,0,0.30)',
    shadowXl: '0 8px 32px 0 rgba(0,0,0,0.40)',
  },
};

export default function DoctorDashboard() {
  const { mode } = useTheme();
  const theme = THEME_COLORS[mode === 'dark' ? 'dark' : 'light'];

  // Chart data and options
  const [chartData, setChartData] = useState({
    appointments: { labels: [], datasets: [] },
    patientDistribution: { labels: [], datasets: [] },
  });
  const [chartOptions, setChartOptions] = useState({});
  const [doughnutOptions, setDoughnutOptions] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartKey, setChartKey] = useState(0);

  // Set up chart data and options using theme colors
  useEffect(() => {
    setChartData({
      appointments: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Appointments',
            data: [12, 19, 15, 17, 14, 8, 5],
            backgroundColor: theme.primaryBgChart,
            borderRadius: 10,
            borderSkipped: false,
            borderColor: theme.primary,
            borderWidth: 2,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            hoverBackgroundColor: theme.primaryBgChartHover,
          },
        ],
      },
      patientDistribution: {
        labels: ['New', 'Follow-up', 'Emergency', 'Regular'],
        datasets: [
          {
            data: [30, 25, 15, 30],
            backgroundColor: [
              theme.primaryBgChart,
              theme.successBgChart,
              theme.warningBgChart,
              theme.destructiveBgChart,
            ],
            borderColor: [
              theme.primary,
              theme.success,
              theme.warning,
              theme.destructive,
            ],
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.card,
          titleColor: theme.cardForeground,
          bodyColor: theme.cardForeground,
          borderColor: theme.border,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: theme.border,
            borderDash: [4, 4],
          },
          ticks: {
            color: theme.mutedForeground,
            font: { size: 14, weight: 500 },
            padding: 8,
          },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: theme.mutedForeground,
            font: { size: 14, weight: 500 },
            padding: 8,
          },
        },
      },
    });

    setDoughnutOptions({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: theme.mutedForeground,
            font: { size: 14, weight: 500 },
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: theme.card,
          titleColor: theme.cardForeground,
          bodyColor: theme.cardForeground,
          borderColor: theme.border,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
      },
    });

    setChartKey(Date.now());
  }, [mode, theme]);

  // Data
  const recentPatients = patients.slice(0, 3).map((patient) => ({
    _id: patient.id,
    firstName: patient.user.firstName,
    lastName: patient.user.lastName,
    lastVisit: patient.updatedAt,
  }));

  const doctorName = doctors[0].user.firstName;

  const overallLoading = false;
  const overallError = false;

  const appointmentsForSelectedDate = appointments.filter((app) => {
    const d = new Date(app.date);
    return d.toDateString() === selectedDate.toDateString();
  });

  if (overallLoading) {
    return <LoadingSpinner />;
  }

  if (overallError) {
    return <ErrorMessage message="Failed to load dashboard data." />;
  }

  // Quick Actions
  const quickActions = [
    {
      href: '/doctor/patients/new',
      icon: <UserPlus size={28} strokeWidth={2.2} />,
      label: 'New Patient',
      colorVar: theme.primary,
      bgVar: theme.primaryBg,
      iconBgVar: theme.primaryBg.replace('0.08', '0.15'),
    },
    {
      href: '/doctor/appointments/new',
      icon: <CalendarClock size={28} strokeWidth={2.2} />,
      label: 'Schedule',
      colorVar: theme.success,
      bgVar: theme.successBg,
      iconBgVar: theme.successBg.replace('0.08', '0.15').replace('0.12', '0.15'),
    },
    {
      href: '/doctor/prescriptions/new',
      icon: <FileText size={28} strokeWidth={2.2} />,
      label: 'Prescription',
      colorVar: theme.warning,
      bgVar: theme.warningBg,
      iconBgVar: theme.warningBg.replace('0.08', '0.15').replace('0.12', '0.15'),
    },
    {
      href: '/doctor/messages',
      icon: <MessageSquare size={28} strokeWidth={2.2} />,
      label: 'Messages',
      colorVar: theme.destructive,
      bgVar: theme.destructiveBg,
      iconBgVar: theme.destructiveBg.replace('0.08', '0.15').replace('0.12', '0.15'),
    },
  ];

  return (
    <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex justify-center">
      <div className="w-full max-w-screen-xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: theme.cardForeground }}>
              Dashboard
            </h1>
            <p className="text-lg mt-1" style={{ color: theme.mutedForeground }}>
              Welcome back, <span className="font-semibold" style={{ color: theme.primary }}>{doctorName}</span>
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-10">
          {/* Recent Patients */}
          <div className="col-span-12 md:col-span-5 flex flex-col">
            <Card className="flex-grow rounded-2xl shadow-lg border-0 bg-card transition-all">
              <CardHeader className="flex flex-row items-center justify-between mb-2 p-6 pb-2">
                <CardTitle className="text-2xl font-bold" style={{ color: theme.cardForeground }}>
                  Recent Patients
                </CardTitle>
                <Link
                  href="/doctor/patients"
                  className="inline-flex items-center gap-1 text-primary hover:underline text-base font-semibold"
                  style={{ color: theme.primary }}
                >
                  <span>View All</span>
                  <ChevronRight size={20} />
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-b mb-4" style={{ borderColor: theme.muted }} />
                {recentPatients.length === 0 ? (
                  <div className="py-10 text-center" style={{ color: theme.mutedForeground }}>
                    <Users size={72} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg">No recent patients found</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 flex-grow">
                    {recentPatients.map((patient) => (
                      <div
                        key={patient._id}
                        className="flex items-center gap-5 group transition"
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform"
                          style={{
                            background: theme.primary,
                            color: theme.card,
                          }}
                        >
                          {patient.firstName?.[0]}
                          {patient.lastName?.[0]}
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-semibold" style={{ color: theme.cardForeground }}>
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm mt-1" style={{ color: theme.mutedForeground }}>
                            Last visit:{' '}
                            {patient.lastVisit
                              ? new Date(patient.lastVisit).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                        <Link
                          href={`/doctor/patients/${patient._id}`}
                          className="inline-flex items-center justify-center rounded-lg px-5 py-2 text-base font-semibold border-0 transition-colors shadow-md"
                          style={{
                            background: theme.primary,
                            color: theme.card,
                          }}
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="col-span-12 md:col-span-4 flex flex-col">
            <Card className="flex-grow rounded-2xl shadow-lg border-0 bg-card transition-all">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-2xl font-bold mb-2" style={{ color: theme.cardForeground }}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 md:gap-5 flex-grow">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex flex-col items-center justify-center gap-3 rounded-2xl h-32 font-semibold outline-none focus:ring-2 focus:ring-offset-2 border-0 transition-all"
                      style={{
                        color: action.colorVar,
                        background: action.bgVar,
                        boxShadow: theme.shadowLg,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.18s, background 0.18s, transform 0.18s',
                      }}
                      tabIndex={0}
                      onMouseEnter={e => {
                        // Use a slightly more opaque background on hover
                        e.currentTarget.style.background = action.colorVar.startsWith('#')
                          ? action.bgVar
                          : action.colorVar.replace(')', ', 0.12)').replace('hsl(', 'hsla(');
                        e.currentTarget.style.boxShadow = theme.shadowXl;
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = action.bgVar;
                        e.currentTarget.style.boxShadow = theme.shadowLg;
                        e.currentTarget.style.transform = 'none';
                      }}
                      onFocus={e => {
                        e.currentTarget.style.background = action.colorVar.startsWith('#')
                          ? action.bgVar
                          : action.colorVar.replace(')', ', 0.12)').replace('hsl(', 'hsla(');
                        e.currentTarget.style.boxShadow = theme.shadowXl;
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.background = action.bgVar;
                        e.currentTarget.style.boxShadow = theme.shadowLg;
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-xl mb-1 transition-all shadow"
                        style={{
                          background: action.iconBgVar,
                          color: action.colorVar,
                        }}
                      >
                        {action.icon}
                      </div>
                      <span className="text-lg font-bold" style={{ color: theme.cardForeground }}>{action.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar & Appointments */}
          <div className="col-span-12 md:col-span-3 flex flex-col">
            <Card className="flex-grow rounded-2xl shadow-lg border-0 bg-card p-0 transition-all">
              <CardContent className="p-0">
                <div className="p-6">
                  <label
                    className="block mb-3 font-semibold text-lg"
                    htmlFor="dashboard-calendar"
                    style={{ color: theme.cardForeground }}
                  >
                    Calendar
                  </label>
                  <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="calendar-bg modern-calendar"
                    tileClassName={({ date }) => {
                      const isToday =
                        date.toDateString() === new Date().toDateString();
                      const isSelected =
                        selectedDate &&
                        date.toDateString() === selectedDate.toDateString();
                      if (isSelected) return 'calendar-selected';
                      if (isToday) return 'calendar-today';
                      return null;
                    }}
                  />
                  <div className="mt-6">
                    <div className="font-semibold mb-2 text-base" style={{ color: theme.cardForeground }}>
                      Appointments on {selectedDate.toLocaleDateString()}:
                    </div>
                    {appointmentsForSelectedDate.length === 0 ? (
                      <div className="text-sm" style={{ color: theme.mutedForeground }}>
                        No appointments
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {appointmentsForSelectedDate.map((app) => (
                          <li
                            key={app.id}
                            className="flex items-center gap-3 text-base rounded-lg px-3 py-2"
                            style={{
                              background: theme.primaryBg.replace('0.08', '0.05').replace('0.12', '0.05'),
                            }}
                          >
                            <span className="font-semibold" style={{ color: theme.primary }}>{app.time}</span>
                            <span style={{ color: theme.mutedForeground }}>-</span>
                            <span style={{ color: theme.cardForeground }}>
                              {app.patient.firstName} {app.patient.lastName}
                            </span>
                            <span
                              className="ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                              style={{
                                background: theme.primaryBg.replace('0.08', '0.10').replace('0.12', '0.10'),
                                color: theme.primary,
                              }}
                            >
                              {app.status}
                            </span>
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

        {/* Charts */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Appointments Overview */}
          <div className="col-span-12 md:col-span-7 flex flex-col">
            <Card className="flex-grow rounded-2xl shadow-lg border-0 bg-card transition-all">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-2xl font-bold mb-2" style={{ color: theme.cardForeground }}>
                  Appointments Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex-grow min-h-0 h-72">
                  <Bar
                    key={mode + '-' + chartKey}
                    data={chartData.appointments}
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Distribution */}
          <div className="col-span-12 md:col-span-5 flex flex-col">
            <Card className="flex-grow rounded-2xl shadow-lg border-0 bg-card transition-all">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-2xl font-bold mb-2" style={{ color: theme.cardForeground }}>
                  Patient Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex-grow min-h-0 h-72">
                  <Doughnut
                    key={mode + '-' + chartKey}
                    data={chartData.patientDistribution}
                    options={doughnutOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .modern-calendar {
          border-radius: 1.25rem;
          border: none;
          box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
          font-size: 1.1rem;
          background: ${theme.card};
          transition: background 0.2s;
        }
        .calendar-selected {
          background: ${theme.primary} !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 2px 8px 0 rgba(37,99,235,0.10);
        }
        .calendar-today {
          background: ${theme.primary} !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
          opacity: 0.7;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: ${theme.primary} !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
          opacity: 0.9;
        }
        .react-calendar__navigation {
          background: transparent !important;
        }
        .react-calendar__navigation button {
          color: ${theme.primary} !important;
          font-weight: 600;
        }
        .react-calendar__month-view__weekdays {
          color: ${theme.mutedForeground} !important;
        }
      `}</style>
      {/* CSS vars for chart colors */}
      <style jsx global>{`
        :root {
          --primary-bg: ${THEME_COLORS.light.primaryBg};
          --primary-bg-chart: ${THEME_COLORS.light.primaryBgChart};
          --primary-bg-chart-hover: ${THEME_COLORS.light.primaryBgChartHover};
          --success-bg: ${THEME_COLORS.light.successBg};
          --success-bg-chart: ${THEME_COLORS.light.successBgChart};
          --warning-bg: ${THEME_COLORS.light.warningBg};
          --warning-bg-chart: ${THEME_COLORS.light.warningBgChart};
          --destructive-bg: ${THEME_COLORS.light.destructiveBg};
          --destructive-bg-chart: ${THEME_COLORS.light.destructiveBgChart};
          --shadow-lg: ${THEME_COLORS.light.shadowLg};
          --shadow-xl: ${THEME_COLORS.light.shadowXl};
        }
        html.dark {
          --primary-bg: ${THEME_COLORS.dark.primaryBg};
          --primary-bg-chart: ${THEME_COLORS.dark.primaryBgChart};
          --primary-bg-chart-hover: ${THEME_COLORS.dark.primaryBgChartHover};
          --success-bg: ${THEME_COLORS.dark.successBg};
          --success-bg-chart: ${THEME_COLORS.dark.successBgChart};
          --warning-bg: ${THEME_COLORS.dark.warningBg};
          --warning-bg-chart: ${THEME_COLORS.dark.warningBgChart};
          --destructive-bg: ${THEME_COLORS.dark.destructiveBg};
          --destructive-bg-chart: ${THEME_COLORS.dark.destructiveBgChart};
          --shadow-lg: ${THEME_COLORS.dark.shadowLg};
          --shadow-xl: ${THEME_COLORS.dark.shadowXl};
        }
      `}</style>
    </div>
  );
}