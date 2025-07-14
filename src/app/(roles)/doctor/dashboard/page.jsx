'use client';
import { useState, useEffect, useRef, memo } from 'react';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPatients } from '@/store/slices/doctor/doctorPatientsSlice';
import { 
  fetchDashboardAnalytics, 
  fetchAppointmentsAnalytics, 
  fetchPatientDistribution,
  fetchRecentAppointments,
  fetchAppointmentsByDate
} from '@/store/slices/doctor/dashboardAnalyticsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import AddPatientForm from '@/components/doctor/AddPatientForm';
import NewRequestDialog from '@/components/doctor/NewRequestDialog';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/store/slices/patient/conversationsSlice';
import { patients as mockPatients } from '@/mockdata/patients';
import { format } from 'date-fns';

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

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 1/3) {
    r = x; g = c; b = 0;
  } else if (1/3 <= h && h < 1/2) {
    r = 0; g = c; b = x;
  } else if (1/2 <= h && h < 2/3) {
    r = 0; g = x; b = c;
  } else if (2/3 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h <= 1) {
    r = c; g = 0; b = x;
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function parseHslToHex(hslString) {
  if (!hslString || hslString === '') return '#3b82f6';
  
  const match = hslString.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (match) {
    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]);
    const l = parseFloat(match[3]);
    return hslToHex(h, s, l);
  }
  return '#3b82f6';
}

function getChartColors(mode) {
  if (typeof window !== 'undefined') {
    const primary = parseHslToHex(getCssVar('--primary', '221.2 83.2% 53.3%'));
    const secondary = parseHslToHex(getCssVar('--secondary', '210 40% 96%'));
    const accent = parseHslToHex(getCssVar('--accent', '210 40% 96%'));
    const success = parseHslToHex(getCssVar('--success', '142.1 76.2% 36.3%'));
    const warning = parseHslToHex(getCssVar('--warning', '38 92% 50%'));
    const error = parseHslToHex(getCssVar('--error', '0 84.2% 60.2%'));
    const info = parseHslToHex(getCssVar('--info', '199 89% 48%'));
    const muted = parseHslToHex(getCssVar('--muted', '210 40% 96%'));
    const border = parseHslToHex(getCssVar('--border', '214.3 31.8% 91.4%'));
    const card = parseHslToHex(getCssVar('--card', '0 0% 100%'));
    const cardForeground = parseHslToHex(getCssVar('--card-foreground', '222.2 84% 4.9%'));
    
    const chartColors = [
      primary,
      success,
      warning,
      error,
      info,
      '#8b5cf6', 
      '#ec4899', 
      '#f97316'  
    ];
    
    return {
      bar: primary,
      barHover: primary + 'dd',
      barBorder: primary,
      doughnut: chartColors,
      doughnutBorder: chartColors,
      card: card,
      cardForeground: cardForeground,
      mutedForeground: muted,
      border: border,
      muted: muted,
      primary: primary,
      primaryBgVerylight: getCssVar('--primary-bg-verylight', 'hsla(222, 47%, 11%, 0.05)'),
      primaryBgLight: getCssVar('--primary-bg-light', 'hsla(222, 47%, 11%, 0.10)'),
    };
  }
  
  const fallbackColors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#8b5cf6',
    '#ec4899',
    '#f97316'
  ];
  
  if (mode === 'dark') {
    return {
      bar: '#3b82f6',
      barHover: '#3b82f6dd',
      barBorder: '#3b82f6',
      doughnut: fallbackColors,
      doughnutBorder: fallbackColors,
      card: '#18181b',
      cardForeground: '#fff',
      mutedForeground: '#a1a1aa',
      border: '#27272a',
    };
  } else {
    return {
      bar: '#3b82f6',
      barHover: '#3b82f6dd',
      barBorder: '#3b82f6',
      doughnut: fallbackColors,
      doughnutBorder: fallbackColors,
      card: '#fff',
      cardForeground: '#18181b',
    };
  }
}

const CalendarAppointmentsCard = memo(function CalendarAppointmentsCard({
  selectedDate,
  onDateChange,
  appointmentsForSelectedDate,
  loading,
  t,
  handleDateChange,
}) {
  const appointments = Array.isArray(appointmentsForSelectedDate)
    ? appointmentsForSelectedDate
    : appointmentsForSelectedDate
      ? [appointmentsForSelectedDate]
      : [];

  const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

  function getStatusTranslationKey(status) {
    if (typeof status === 'undefined' || status === null || status === '') {
      return 'doctor.dashboard.status.undefined';
    }
    return 'doctor.dashboard.status.' + status;
  }

  function getStatusLabel(status) {
    if (typeof status === 'undefined' || status === null || status === '') {
      return t('doctor.dashboard.status.undefined', 'Unknown');
    }
    return t('doctor.dashboard.status.' + status, status);
  }

  return (
    <Card className="flex flex-col min-w-0" noPadding>
      <CardHeader className="p-3 sm:p-4 pb-2">
        <CardTitle className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-card-foreground">
          {t('doctor.dashboard.calendar', 'Calendar')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="overflow-x-auto">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            className="calendar-bg modern-calendar min-w-[240px] sm:min-w-[260px]"
            tileClassName={({ date }) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              if (isSelected) return 'calendar-selected bg-primary text-primary-foreground';
              if (isToday) return 'calendar-today';
              return null;
            }}
          />
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="font-semibold mb-1 text-xs sm:text-sm text-card-foreground">
            {t('doctor.dashboard.appointmentsOn', 'Appointments on')} {selectedDate.toLocaleDateString()}:
          </div>
          {loading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size={18} />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              {t('doctor.dashboard.noAppointments', 'No appointments')}
            </div>
          ) : (
            <ul className="space-y-1.5 sm:space-y-2">
              {appointments.map((app) => (
                <li
                  key={app._id}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-2xl px-2 py-1.5 sm:py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <span className="font-semibold text-primary">{app.time}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-card-foreground truncate">
                    {app.patient?.user?.firstName} {app.patient?.user?.lastName}
                  </span>
                  <span className="sm:ml-auto px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                    {getStatusLabel(app.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default function DoctorDashboard() {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { patients, loading: patientsLoading, error: patientsError } = useAppSelector(
    (state) => state.doctorPatients
  );

  const { 
    analytics, 
    appointmentsChart, 
    patientDistribution, 
    recentAppointments,
    appointmentsByDate,
    loading: analyticsLoading, 
    error: analyticsError 
  } = useAppSelector((state) => state.dashboardAnalytics);

  const [chartColors, setChartColors] = useState(getChartColors(currentTheme));

  useEffect(() => {
    setChartColors(getChartColors(currentTheme));
    setChartKey(Date.now());
  }, [currentTheme]);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchDashboardAnalytics());
    dispatch(fetchAppointmentsAnalytics('week'));
    dispatch(fetchPatientDistribution());
    dispatch(fetchRecentAppointments(10));
  }, [dispatch]);

  const [chartOptions, setChartOptions] = useState({});
  const [doughnutOptions, setDoughnutOptions] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartKey, setChartKey] = useState(0);

  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    setCalendarLoading(true);
    dispatch(fetchAppointmentsByDate(dateString)).then((action) => {
      if (isMounted) {
        setCalendarLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setCalendarLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [selectedDate, dispatch]);

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const calendarAppointments = (appointmentsByDate && appointmentsByDate[dateString]) || [];

  const chartData = {
    appointments: {
      labels: appointmentsChart.labels.length > 0 ? appointmentsChart.labels : [
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
          data: appointmentsChart.data.length > 0 ? appointmentsChart.data : [1, 2, 1, 3, 2, 1, 1],
          backgroundColor: chartColors.bar,
          borderRadius: 8,
          borderSkipped: false,
          borderColor: chartColors.barBorder,
          borderWidth: 2,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          hoverBackgroundColor: chartColors.barHover,
        },
      ],
    },
    patientDistribution: {
      labels: patientDistribution.labels.length > 0 ? patientDistribution.labels : [
        t('doctor.dashboard.new', 'New'),
        t('doctor.dashboard.followUp', 'Follow-up'),
        t('doctor.dashboard.emergency', 'Emergency'),
        t('doctor.dashboard.regular', 'Regular')
      ],
      datasets: [
        {
          data: patientDistribution.data.length > 0 ? patientDistribution.data : [1, 1, 1, 1],
          backgroundColor: chartColors.doughnut.slice(0, 4),
          borderColor: chartColors.doughnutBorder.slice(0, 4),
          borderWidth: 3,
          hoverOffset: 15,
          hoverBorderWidth: 4,
          hoverBackgroundColor: chartColors.doughnut.slice(0, 4).map(color => color + 'dd'),
        },
      ],
    },
  };

  useEffect(() => {
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: chartColors.card,
          titleColor: chartColors.cardForeground,
          bodyColor: chartColors.cardForeground,
          borderColor: chartColors.border,
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          titleFont: { size: 12, weight: 600 },
          bodyFont: { size: 11 },
          callbacks: {
            label: (context) => {
              return `${context.parsed.y} appointments`;
            }
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: chartColors.border,
            borderDash: [4, 4],
          },
          ticks: {
            color: chartColors.cardForeground,
            font: { size: 10, weight: 600 },
            padding: 6,
            stepSize: 1,
            maxTicksLimit: 6,
          },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: chartColors.cardForeground,
            font: { size: 10, weight: 600 },
            padding: 6,
            maxTicksLimit: 7,
          },
        },
      },
    });

    setDoughnutOptions({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%', 
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: chartColors.cardForeground,
            font: { size: 10, weight: 600 },
            usePointStyle: true,
            padding: 10,
            generateLabels: (chart) => {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0];
                  const value = dataset.data[i];
                  const backgroundColor = dataset.backgroundColor[i];
                  const borderColor = dataset.borderColor[i];
                  
                  return {
                    text: `${label}: ${value}`,
                    fillStyle: backgroundColor,
                    strokeStyle: borderColor,
                    lineWidth: 2,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          },
        },
        tooltip: {
          backgroundColor: chartColors.card,
          titleColor: chartColors.cardForeground,
          bodyColor: chartColors.cardForeground,
          borderColor: chartColors.border,
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          titleFont: { size: 12, weight: 600 },
          bodyFont: { size: 11 },
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: chartColors.card,
        }
      }
    });

    setChartKey(Date.now());
  }, [currentTheme, t, chartColors]);

  const recentPatients = patients.slice(0, 3).map((patient) => ({
    _id: patient._id,
    firstName: patient.user?.firstName || patient.firstName,
    lastName: patient.user?.lastName || patient.lastName,
    lastVisit: patient.updatedAt || patient.lastVisit,
  }));

  const doctorName = doctors[0]?.user?.firstName || 'Doctor';

  const [addPatientDialogOpen, setAddPatientDialogOpen] = useState(false);
  const [addAppointmentDialogOpen, setAddAppointmentDialogOpen] = useState(false);
  const [addPrescriptionDialogOpen, setAddPrescriptionDialogOpen] = useState(false);

  // State for appointment form
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    date: '',
    time: '',
    type: 'checkup',
    reason: '',
    notes: '',
    duration: 30,
    location: '',
  });
  const [appointmentFormError, setAppointmentFormError] = useState('');
  const [appointmentSubmitting, setAppointmentSubmitting] = useState(false);

  // State for prescription dialog
  const [pharmacies, setPharmacies] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  // Fetch pharmacies and medicines for prescription dialog
  useEffect(() => {
    if (addPrescriptionDialogOpen) {
      setPrescriptionLoading(true);
      // Replace with actual fetch logic
      setTimeout(() => {
        setPharmacies([{ id: '1', name: 'Pharmacy A' }, { id: '2', name: 'Pharmacy B' }]);
        setMedicines([
          { name: 'Lisinopril 10mg' },
          { name: 'Metformin 500mg' },
          { name: 'Atorvastatin 10mg' },
        ]);
        setPrescriptionLoading(false);
      }, 500);
    }
  }, [addPrescriptionDialogOpen]);

  // Appointment form handlers
  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewAppointment = async (e) => {
    e.preventDefault();
    setAppointmentFormError('');
    setAppointmentSubmitting(true);
    // Replace with actual submit logic
    setTimeout(() => {
      setAppointmentSubmitting(false);
      setAddAppointmentDialogOpen(false);
      setAppointmentForm({
        patientId: '',
        date: '',
        time: '',
        type: 'checkup',
        reason: '',
        notes: '',
        duration: 30,
        location: '',
      });
    }, 1000);
  };

  // Add a quick action for starting a new conversation
  const handleStartConversation = () => {
    router.push('/doctor/messaging?newChat=1');
  };

  const quickActions = [
    {
      key: 'new-patient',
      icon: <UserPlus size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.newPatient', 'New Patient'),
      onClick: () => setAddPatientDialogOpen(true),
    },
    {
      key: 'new-appointment',
      icon: <CalendarClock size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.newAppointment', 'New Appointment'),
      onClick: () => setAddAppointmentDialogOpen(true),
    },
    {
      key: 'prescription',
      icon: <FileText size={28} strokeWidth={2.2} />,
      label: t('doctor.dashboard.prescription', 'Prescription'),
      onClick: () => setAddPrescriptionDialogOpen(true),
    },
    {
      key: 'start-conversation',
      icon: <MessageSquare size={28} strokeWidth={2.2} />,
      label: 'Start Conversation',
      onClick: handleStartConversation,
    },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (patientsLoading || analyticsLoading) {
    return <LoadingSpinner />;
  }

  if (patientsError || analyticsError) {
    return <ErrorMessage message={t('doctor.dashboard.loadError', 'Failed to load dashboard data.')} />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 min-h-screen">
      <div className="flex flex-col gap-y-4 sm:gap-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-card-foreground drop-shadow-sm">
              {t('doctor.dashboard.title', 'Dashboard')}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              {t('doctor.dashboard.welcome', 'Welcome back')}, <span className="font-semibold text-primary">{doctorName}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{t('doctor.dashboard.totalPatients', 'Total Patients')}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">{patients.length}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{t('doctor.dashboard.totalAppointments', 'Total Appointments')}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">{analytics.totalAppointments}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <CalendarClock className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              </div>
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{t('doctor.dashboard.completedAppointments', 'Completed')}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">{analytics.completedAppointments}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
              </div>
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{t('doctor.dashboard.pendingAppointments', 'Pending')}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">{analytics.pendingAppointments || 0}</p>
              </div>
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-danger/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-danger" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Card className="flex flex-col min-w-0" noPadding>
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-2">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-card-foreground">
                {t('doctor.dashboard.recentPatients', 'Recent Patients')}
              </CardTitle>
              <Link
                href="/doctor/patients"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm sm:text-base font-semibold transition-colors hover:text-accent"
              >
                <span className="hidden sm:inline">{t('doctor.dashboard.viewAll', 'View All')}</span>
                <span className="sm:hidden">{t('doctor.dashboard.viewAll', 'All')}</span>
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="border-b mb-3 sm:mb-4 border-muted" />
              {recentPatients.length === 0 ? (
                <div className="py-6 sm:py-8 text-center text-muted-foreground">
                  <div className="mx-auto mb-3 sm:mb-4 opacity-40 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                    <Users width="100%" height="100%" />
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg">{t('doctor.dashboard.noRecentPatients', 'No recent patients found')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:gap-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 group hover:bg-primary/5 rounded-xl px-2 py-2 transition"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg lg:text-xl shadow-lg group-hover:scale-105 transition-transform bg-primary text-card border-4 border-card">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                      </div>
                      <div className="flex-grow text-center sm:text-left min-w-0">
                        <p className="text-sm sm:text-base lg:text-lg font-semibold text-card-foreground truncate">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                          {t('doctor.dashboard.lastVisit', 'Last visit')}: {' '}
                          {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : t('doctor.dashboard.notAvailable', 'N/A')}
                        </p>
                      </div>
                      <Link
                        href={`/doctor/patients/${patient._id}`}
                        className="inline-flex items-center justify-center rounded-2xl px-2 sm:px-3 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base font-semibold border-0 transition-colors shadow-md bg-primary text-card hover:bg-accent focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary mt-2 sm:mt-0 flex-shrink-0"
                      >
                        {t('doctor.dashboard.view', 'View')}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col min-w-0 h-full" noPadding>
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.quickActions', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 h-full">
                {quickActions.map((action) => (
                  <Button
                    key={action.key}
                    onClick={action.onClick}
                    className="group flex flex-row items-center gap-2 sm:gap-3 rounded-2xl p-2 sm:p-3 font-semibold outline-none focus:ring-2 focus:ring-offset-2 border-0 transition-all bg-white/80 hover:bg-primary/10 focus:bg-primary/20 shadow-md hover:shadow-xl h-full min-h-[80px] sm:min-h-[100px]"
                  >
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all shadow bg-primary/10 group-hover:bg-primary/20 group-focus:bg-primary/20 text-primary flex-shrink-0">
                      {action.icon}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-card-foreground group-hover:text-primary group-focus:text-primary transition-colors truncate">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <CalendarAppointmentsCard
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            appointmentsForSelectedDate={calendarAppointments}
            loading={calendarLoading}
            t={t}
            handleDateChange={handleDateChange}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mt-2">
          <Card className="flex flex-col min-w-0 col-span-1 xl:col-span-2" noPadding>
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.appointmentsOverview', 'Appointments Overview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="flex-grow min-h-[200px] h-[250px] sm:h-[300px] lg:h-72">
                <Bar
                  key={currentTheme + '-' + chartKey}
                  data={chartData.appointments}
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col min-w-0 col-span-1" noPadding>
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-card-foreground">
                {t('doctor.dashboard.patientDistribution', 'Patient Distribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="flex-grow min-h-[200px] h-[250px] sm:h-[300px] lg:h-72">
                <Doughnut
                  key={currentTheme + '-' + chartKey}
                  data={chartData.patientDistribution}
                  options={doughnutOptions}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={addPatientDialogOpen} onOpenChange={setAddPatientDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl bg-card border border-border">
          <AddPatientForm onClose={() => setAddPatientDialogOpen(false)} onSuccess={() => setAddPatientDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={addAppointmentDialogOpen} onOpenChange={setAddAppointmentDialogOpen}>
        <DialogContent className="max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>Fill in the details to create a new appointment.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewAppointment} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Patient</label>
              <select
                name="patientId"
                value={appointmentForm.patientId}
                onChange={handleAppointmentFormChange}
                className="w-full border rounded p-2"
                required
              >
                <option key="select" value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.patientId || p._id} value={p._id}>
                    {p.user ? `${p.user.firstName} ${p.user.lastName}` : `${p.firstName} ${p.lastName}`} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Date</label>
                <input type="date" name="date" value={appointmentForm.date} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" required />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Time</label>
                <input type="time" name="time" value={appointmentForm.time} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" required />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select name="type" value={appointmentForm.type} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" required>
                <option key="checkup" value="checkup">Checkup</option>
                <option key="consultation" value="consultation">Consultation</option>
                <option key="follow-up" value="follow-up">Follow-up</option>
                <option key="emergency" value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Reason</label>
              <input type="text" name="reason" value={appointmentForm.reason} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Notes</label>
              <textarea name="notes" value={appointmentForm.notes} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" rows={2} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Duration (minutes)</label>
                <input type="number" name="duration" value={appointmentForm.duration} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" min={1} />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Location</label>
                <input type="text" name="location" value={appointmentForm.location} onChange={handleAppointmentFormChange} className="w-full border rounded p-2" />
              </div>
            </div>
            {appointmentFormError && <div className="text-red-600 text-sm">{appointmentFormError}</div>}
            <Button type="button" variant="outline" className="w-full mt-2" onClick={() => setAddAppointmentDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="default" className="w-full" disabled={appointmentSubmitting}>
              {appointmentSubmitting ? 'Creating...' : 'Create Appointment'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <NewRequestDialog
        open={addPrescriptionDialogOpen}
        onClose={() => setAddPrescriptionDialogOpen(false)}
        pharmacies={pharmacies}
        medicines={medicines}
        isCreating={prescriptionLoading}
        requirePharmacy
      />
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
          color: var(--primary-foreground, #fff) !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 2px 8px 0 rgba(37,99,235,0.10);
        }
        .calendar-today {
          background: transparent !important;
          color: var(--primary) !important;
          border: 2px solid var(--primary) !important;
          border-radius: 0.75rem !important;
          opacity: 1;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: var(--primary) !important;
          color: var(--primary-foreground, #fff) !important;
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