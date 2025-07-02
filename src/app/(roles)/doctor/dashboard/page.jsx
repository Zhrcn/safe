'use client';
import { useState, useEffect, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function getCssVar(name, fallback) {
  if (typeof window !== 'undefined') {
    const style = getComputedStyle(document.documentElement);
    const value = style.getPropertyValue(name);
    return value ? value.trim() : fallback;
  }
  return fallback;
}

function getChartColors(mode) {
  if (typeof window !== 'undefined') {
    return {
      bar: getCssVar('--primary-bg-chart', getCssVar('--primary', '#2563eb')),
      barHover: getCssVar('--primary-bg-chart-hover', getCssVar('--primary', '#2563eb')),
      barBorder: getCssVar('--primary', '#2563eb'),
      doughnut: [
        getCssVar('--primary-bg-chart', getCssVar('--primary', '#2563eb')),
        getCssVar('--success-bg-chart', getCssVar('--success', '#22c55e')),
        getCssVar('--warning-bg-chart', getCssVar('--warning', '#f59e42')),
        getCssVar('--destructive-bg-chart', getCssVar('--destructive', '#ef4444')),
      ],
      doughnutBorder: [
        getCssVar('--primary', '#2563eb'),
        getCssVar('--success', '#22c55e'),
        getCssVar('--warning', '#f59e42'),
        getCssVar('--destructive', '#ef4444'),
      ],
      card: getCssVar('--card', mode === 'dark' ? '#18181b' : '#fff'),
      cardForeground: getCssVar('--card-foreground', mode === 'dark' ? '#fff' : '#18181b'),
      mutedForeground: getCssVar('--muted-foreground', mode === 'dark' ? '#a1a1aa' : '#6b7280'),
      border: getCssVar('--border', mode === 'dark' ? '#27272a' : '#e5e7eb'),
      muted: getCssVar('--muted', mode === 'dark' ? '#27272a' : '#f3f4f6'),
      primary: getCssVar('--primary', '#2563eb'),
      primaryBgVerylight: getCssVar('--primary-bg-verylight', 'hsla(222, 47%, 11%, 0.05)'),
      primaryBgLight: getCssVar('--primary-bg-light', 'hsla(222, 47%, 11%, 0.10)'),
    };
  }
  if (mode === 'dark') {
    return {
      bar: '#2563eb',
      barHover: '#2563eb',
      barBorder: '#2563eb',
      doughnut: [
        '#2563eb',
        '#22c55e',
        '#f59e42',
        '#ef4444',
      ],
      doughnutBorder: [
        '#2563eb',
        '#22c55e',
        '#f59e42',
        '#ef4444',
      ],
      card: '#18181b',
      cardForeground: '#fff',
      mutedForeground: '#a1a1aa',
      border: '#27272a',
    };
  } else {
    return {
      bar: 'hsla(222, 47%, 11%, 0.7)',
      barHover: 'hsla(222, 47%, 11%, 0.9)',
      barBorder: '#2563eb',
      doughnut: [
        'hsla(222, 47%, 11%, 0.7)',
        'hsla(142, 71%, 45%, 0.7)',
        'hsla(36, 100%, 50%, 0.7)',
        'hsla(0, 84%, 60%, 0.7)',
      ],
      doughnutBorder: [
        '#2563eb',
        '#22c55e',
        '#f59e42',
        '#ef4444',
      ],
      card: '#fff',
      cardForeground: '#18181b',
    };
  }
}

export default function DoctorDashboard() {
  const { t } = useTranslation();
  const { mode } = useTheme();

  const [chartColors, setChartColors] = useState(getChartColors(mode));

  useEffect(() => {
    setChartColors(getChartColors(mode));
  }, [mode]);

  const [chartData, setChartData] = useState({
    appointments: { labels: [], datasets: [] },
    patientDistribution: { labels: [], datasets: [] },
  });
  const [chartOptions, setChartOptions] = useState({});
  const [doughnutOptions, setDoughnutOptions] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setChartData({
      appointments: {
        labels: [
          t('doctor.dashboard.mon', 'Mon'),
          t('doctor.dashboard.tue', 'Tue'),
          t('doctor.dashboard.wed', 'Wed'),
          t('doctor.dashboard.thu', 'Thu'),
          t('doctor.dashboard.fri', 'Fri'),
          t('doctor.dashboard.sat', 'Sat'),
          t('doctor.dashboard.sun', 'Sun')
        ],
        datasets: [
          {
            label: t('doctor.dashboard.appointments', 'Appointments'),
            data: [12, 19, 15, 17, 14, 8, 5],
            backgroundColor: chartColors.bar,
            borderRadius: 10,
            borderSkipped: false,
            borderColor: chartColors.barBorder,
            borderWidth: 2,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            hoverBackgroundColor: chartColors.barHover,
          },
        ],
      },
      patientDistribution: {
        labels: [
          t('doctor.dashboard.new', 'New'),
          t('doctor.dashboard.followUp', 'Follow-up'),
          t('doctor.dashboard.emergency', 'Emergency'),
          t('doctor.dashboard.regular', 'Regular')
        ],
        datasets: [
          {
            data: [30, 25, 15, 30],
            backgroundColor: chartColors.doughnut,
            borderColor: chartColors.doughnutBorder,
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
          backgroundColor: chartColors.card,
          titleColor: chartColors.cardForeground,
          bodyColor: chartColors.cardForeground,
          borderColor: 'var(--border)',
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
            color: 'var(--border)',
            borderDash: [4, 4],
          },
          ticks: {
            color: 'var(--muted-foreground)',
            font: { size: 14, weight: 500 },
            padding: 8,
          },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: 'var(--muted-foreground)',
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
            color: 'var(--muted-foreground)',
            font: { size: 14, weight: 500 },
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: chartColors.card,
          titleColor: chartColors.cardForeground,
          bodyColor: chartColors.cardForeground,
          borderColor: 'var(--border)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
      },
    });

    setChartKey(Date.now());
  }, [mode, t, chartColors]);

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
    return <ErrorMessage message={t('doctor.dashboard.loadError', 'Failed to load dashboard data.')} />;
  }

  const quickActions = [
    {
      href: '/doctor/patients/new',
      icon: <UserPlus size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.newPatient', 'New Patient'),
      colorVar: 'var(--primary)',
      bgVar: 'var(--primary-bg)',
      iconBgVar: 'var(--primary-bg-hover, var(--primary-bg))',
    },
    {
      href: '/doctor/appointments/new',
      icon: <CalendarClock size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.schedule', 'Schedule'),
      colorVar: 'var(--success)',
      bgVar: 'var(--success-bg)',
      iconBgVar: 'var(--success-bg-hover, var(--success-bg))',
    },
    {
      href: '/doctor/prescriptions/new',
      icon: <FileText size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.prescription', 'Prescription'),
      colorVar: 'var(--warning)',
      bgVar: 'var(--warning-bg)',
      iconBgVar: 'var(--warning-bg-hover, var(--warning-bg))',
    },
    {
      href: '/doctor/messages',
      icon: <MessageSquare size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.messages', 'Messages'),
      colorVar: 'var(--destructive)',
      bgVar: 'var(--destructive-bg)',
      iconBgVar: 'var(--destructive-bg-hover, var(--destructive-bg))',
    },
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 min-h-screen">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-card-foreground drop-shadow-sm">
              {t('doctor.dashboard.title', 'Dashboard')}
            </h1>
            <p className="text-base sm:text-lg mt-1 text-muted-foreground">
              {t('doctor.dashboard.welcome', 'Welcome back')}, <span className="font-semibold text-primary">{doctorName}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
          <Card className="flex flex-col min-w-0" noPadding>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-lg sm:text-xl font-bold text-card-foreground">
                {t('doctor.dashboard.recentPatients', 'Recent Patients')}
              </CardTitle>
              <Link
                href="/doctor/patients"
                className="inline-flex items-center gap-1 text-primary hover:underline text-base font-semibold transition-colors hover:text-accent"
              >
                <span>{t('doctor.dashboard.viewAll', 'View All')}</span>
                <ChevronRight size={20} />
              </Link>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="border-b mb-4 border-muted" />
              {recentPatients.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <div className="mx-auto mb-4 opacity-40 w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center">
                    <Users width="100%" height="100%" />
                  </div>
                  <p className="text-base sm:text-lg">{t('doctor.dashboard.noRecentPatients', 'No recent patients found')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="flex flex-col sm:flex-row items-center gap-3 group hover:bg-primary/5 rounded-xl px-2 py-2 transition"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg group-hover:scale-105 transition-transform bg-primary text-card border-4 border-card">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <p className="text-base sm:text-lg font-semibold text-card-foreground">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                          {t('doctor.dashboard.lastVisit', 'Last visit')}: {' '}
                          {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : t('doctor.dashboard.notAvailable', 'N/A')}
                        </p>
                      </div>
                      <Link
                        href={`/doctor/patients/${patient._id}`}
                        className="inline-flex items-center justify-center rounded-2xl px-3 sm:px-5 py-2 text-sm sm:text-base font-semibold border-0 transition-colors shadow-md bg-primary text-card hover:bg-accent focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary mt-2 sm:mt-0"
                      >
                        {t('doctor.dashboard.view', 'View')}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col min-w-0" noPadding>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg sm:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.quickActions', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex flex-row items-center gap-3 rounded-2xl p-3 font-semibold outline-none focus:ring-2 focus:ring-offset-2 border-0 transition-all bg-white/80 hover:bg-primary/10 focus:bg-primary/20 shadow-md hover:shadow-xl"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl transition-all shadow bg-primary/10 group-hover:bg-primary/20 group-focus:bg-primary/20 text-primary">
                      {action.icon}
                    </div>
                    <span className="text-base font-bold text-card-foreground group-hover:text-primary group-focus:text-primary transition-colors">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col min-w-0" noPadding>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg sm:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.calendar', 'Calendar')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="overflow-x-auto">
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  className="calendar-bg modern-calendar min-w-[260px]"
                  tileClassName={({ date }) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    if (isSelected) return 'calendar-selected';
                    if (isToday) return 'calendar-today';
                    return null;
                  }}
                />
              </div>
              <div className="mt-4">
                <div className="font-semibold mb-1 text-sm text-card-foreground">
                  {t('doctor.dashboard.appointmentsOn', 'Appointments on')} {selectedDate.toLocaleDateString()}:
                </div>
                {appointmentsForSelectedDate.length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    {t('doctor.dashboard.noAppointments', 'No appointments')}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {appointmentsForSelectedDate.map((app) => (
                      <li
                        key={app.id}
                        className="flex flex-col sm:flex-row items-center gap-2 text-sm rounded-2xl px-2 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <span className="font-semibold text-primary">{app.time}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-card-foreground">
                          {app.patient.firstName} {app.patient.lastName}
                        </span>
                        <span className="sm:ml-auto px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
                          {t('doctor.dashboard.status.' + app.status, app.status)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 gap-x-6 mt-2">
          <Card className="flex flex-col min-w-0 col-span-1 lg:col-span-2" noPadding>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg sm:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.appointmentsOverview', 'Appointments Overview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="flex-grow min-h-[180px] h-[220px] sm:h-72">
                <Bar
                  key={mode + '-' + chartKey}
                  data={chartData.appointments}
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col min-w-0 col-span-1" noPadding>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg sm:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.patientDistribution', 'Patient Distribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="flex-grow min-h-[180px] h-[220px] sm:h-72">
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
      <style jsx global>{`
        .modern-calendar {
          border-radius: 1.25rem;
          border: none;
          box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
          font-size: 1.1rem;
          background: var(--card);
          transition: background 0.2s;
        }
        .calendar-selected {
          background: var(--primary) !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 2px 8px 0 rgba(37,99,235,0.10);
        }
        .calendar-today {
          background: var(--primary) !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
          opacity: 0.7;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: var(--primary) !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
          opacity: 0.9;
        }
        .react-calendar__navigation {
          background: transparent !important;
        }
        .react-calendar__navigation button {
          color: var(--primary) !important;
          font-weight: 600;
        }
        .react-calendar__month-view__weekdays {
          color: var(--muted-foreground) !important;
        }
      `}</style>
    </div>
  );
}