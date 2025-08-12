'use client';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { RefreshCw, TrendingUp, Users, Calendar, Pill } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { fetchComprehensiveAnalytics } from '@/store/slices/doctor/dashboardAnalyticsSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function getCssVar(varName, fallback) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
  return value ? value.trim() : fallback;
}

function StatCard({ value, label, icon: Icon, trend }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-2xl p-6 relative">
      {Icon && (
        <div className="absolute top-4 right-4 text-muted-foreground">
          <Icon size={20} />
        </div>
      )}
      <span className="text-3xl font-bold text-primary">{value}</span>
      <span className="text-muted-foreground text-center">{label}</span>
      {trend && (
        <div className={`flex items-center text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
          <span className="ml-1">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}

function SmallStatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-2xl p-4">
      <span className="text-xl font-bold text-primary">{value}</span>
      <span className="text-muted-foreground text-center text-sm">{label}</span>
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-background rounded-2xl p-6 shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TopConditions({ conditions }) {
  const { t } = useTranslation();
  return (
    <div className="bg-background rounded-2xl p-6 shadow mb-4">
      <h3 className="text-lg font-semibold mb-4">{t('doctor.analytics.topConditions', 'Top Patient Conditions')}</h3>
      {conditions.length > 0 ? (
        <ul className="divide-y divide-border">
          {conditions.map((cond) => (
            <li key={cond.name} className="flex justify-between py-2">
              <span>{t(`doctor.analytics.condition.${cond.name.toLowerCase()}`, cond.name)}</span>
              <span className="font-semibold">{cond.count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-center py-4">No conditions data available</p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="p-4 text-red-700 bg-red-100 rounded-2xl">
      <p className="font-semibold">Error loading analytics:</p>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw size={16} className="mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  
  const { 
    comprehensiveAnalytics, 
    loading, 
    error 
  } = useSelector((state) => state.dashboardAnalytics);

  const [chartColors, setChartColors] = useState({
    primary: '#3b82f6',
    primaryFg: '#fff',
    secondary: '#10b981',
    warning: '#fbbf24',
    danger: '#ef4444',
    muted: '#f3f4f6',
    border: '#e5e7eb',
    card: '#fff',
    cardForeground: '#1f2937',
    mutedForeground: '#6b7280',
  });

  useEffect(() => {
    setChartColors({
      primary: getCssVar('--color-primary', '#3b82f6'),
      primaryFg: getCssVar('--color-primary-foreground', '#fff'),
      secondary: getCssVar('--color-secondary', '#10b981'),
      warning: getCssVar('--color-warning', '#fbbf24'),
      danger: getCssVar('--color-danger', '#ef4444'),
      muted: getCssVar('--color-muted', '#f3f4f6'),
      border: getCssVar('--color-border', '#e5e7eb'),
      card: getCssVar('--color-card', '#fff'),
      cardForeground: getCssVar('--color-card-foreground', '#1f2937'),
      mutedForeground: getCssVar('--color-muted-foreground', '#6b7280'),
    });
  }, []);

  useEffect(() => {
    dispatch(fetchComprehensiveAnalytics());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchComprehensiveAnalytics());
  };

  const {
    barData,
    barOptions,
    doughnutData,
    doughnutOptions,
    prescriptionLineData,
    prescriptionLineOptions,
    appointmentTypePieData,
    appointmentTypePieOptions,
    genderAgeBarData,
    genderAgeBarOptions,
  } = useMemo(() => {
    return {
      barData: {
        labels: comprehensiveAnalytics.appointmentTrends.labels,
        datasets: [
          {
            label: t('doctor.analytics.appointments', 'Appointments'),
            data: comprehensiveAnalytics.appointmentTrends.data,
            backgroundColor: chartColors.primary + 'cc', 
            borderColor: chartColors.primary,
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      barOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            backgroundColor: chartColors.card,
            titleColor: chartColors.cardForeground,
            bodyColor: chartColors.cardForeground,
            borderColor: chartColors.border,
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
              color: chartColors.mutedForeground,
            },
            grid: {
              color: chartColors.border,
            },
          },
          x: {
            ticks: {
              color: chartColors.mutedForeground,
            },
            grid: {
              color: chartColors.border,
            },
          },
        },
      },
      doughnutData: {
        labels: comprehensiveAnalytics.patientDistribution.labels,
        datasets: [
          {
            data: comprehensiveAnalytics.patientDistribution.data,
            backgroundColor: [
              chartColors.primary + 'b3',
              chartColors.secondary + 'b3',
              chartColors.warning + 'b3',
            ],
            borderColor: [
              chartColors.primary,
              chartColors.secondary,
              chartColors.warning,
            ],
            borderWidth: 2,
          },
        ],
      },
      doughnutOptions: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: chartColors.mutedForeground,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: chartColors.card,
            titleColor: chartColors.cardForeground,
            bodyColor: chartColors.cardForeground,
            borderColor: chartColors.border,
            borderWidth: 1,
          },
        },
        cutout: '70%',
      },
      prescriptionLineData: {
        labels: comprehensiveAnalytics.prescriptionTrends.labels,
        datasets: [
          {
            label: t('doctor.analytics.prescriptionsIssued', 'Prescriptions Issued'),
            data: comprehensiveAnalytics.prescriptionTrends.data,
            fill: false,
            borderColor: chartColors.secondary,
            backgroundColor: chartColors.secondary + '33',
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: chartColors.secondary,
          },
        ],
      },
      prescriptionLineOptions: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top', labels: { color: chartColors.mutedForeground } },
          title: { display: false },
          tooltip: {
            backgroundColor: chartColors.card,
            titleColor: chartColors.cardForeground,
            bodyColor: chartColors.cardForeground,
            borderColor: chartColors.border,
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5, color: chartColors.mutedForeground },
            grid: { color: chartColors.border },
          },
          x: {
            ticks: { color: chartColors.mutedForeground },
            grid: { color: chartColors.border },
          },
        },
      },
      appointmentTypePieData: {
        labels: comprehensiveAnalytics.appointmentTypeDistribution.labels,
        datasets: [
          {
            data: comprehensiveAnalytics.appointmentTypeDistribution.data,
            backgroundColor: [
              chartColors.primary + 'b3',
              chartColors.warning + 'b3',
              chartColors.danger + 'b3',
              chartColors.secondary + 'b3',
            ],
            borderColor: [
              chartColors.primary,
              chartColors.warning,
              chartColors.danger,
              chartColors.secondary,
            ],
            borderWidth: 2,
          },
        ],
      },
      appointmentTypePieOptions: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: chartColors.mutedForeground,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: chartColors.card,
            titleColor: chartColors.cardForeground,
            bodyColor: chartColors.cardForeground,
            borderColor: chartColors.border,
            borderWidth: 1,
          },
        },
      },
      genderAgeBarData: {
        labels: comprehensiveAnalytics.genderAgeDistribution.labels,
        datasets: [
          {
            label: t('doctor.analytics.avgAge', 'Average Age'),
            data: comprehensiveAnalytics.genderAgeDistribution.data,
            backgroundColor: [
              chartColors.primary + '99',
              chartColors.secondary + '99',
              chartColors.warning + '99',
            ],
            borderColor: [
              chartColors.primary,
              chartColors.secondary,
              chartColors.warning,
            ],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      genderAgeBarOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            backgroundColor: chartColors.card,
            titleColor: chartColors.cardForeground,
            bodyColor: chartColors.cardForeground,
            borderColor: chartColors.border,
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5, color: chartColors.mutedForeground },
            grid: { color: chartColors.border },
          },
          x: {
            ticks: { color: chartColors.mutedForeground },
            grid: { color: chartColors.border },
          },
        },
      },
    };
  }, [comprehensiveAnalytics, chartColors, t]);

  if (loading) {
    return (
      <Card className="rounded-xl shadow-lg p-8">
        <CardHeader>
          <CardTitle>
            {i18n.isInitialized && i18n.hasLoadedNamespace('common')
              ? t('doctor.analytics.title', 'Patient Analytics')
              : 'Patient Analytics'}
          </CardTitle>
          <CardDescription>
            {i18n.isInitialized && i18n.hasLoadedNamespace('common')
              ? t(
                  'doctor.analytics.description',
                  'View analytics and statistics about your patients, appointments, and prescriptions.'
                )
              : 'View analytics and statistics about your patients, appointments, and prescriptions.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl shadow-lg p-8">
        <CardHeader>
          <CardTitle>
            {i18n.isInitialized && i18n.hasLoadedNamespace('common')
              ? t('doctor.analytics.title', 'Patient Analytics')
              : 'Patient Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} onRetry={handleRefresh} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg p-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {i18n.isInitialized && i18n.hasLoadedNamespace('common')
                ? t('doctor.analytics.title', 'Patient Analytics')
                : 'Patient Analytics'}
            </CardTitle>
            <CardDescription>
              {i18n.isInitialized && i18n.hasLoadedNamespace('common')
                ? t(
                    'doctor.analytics.description',
                    'View analytics and statistics about your patients, appointments, and prescriptions.'
                  )
                : 'View analytics and statistics about your patients, appointments, and prescriptions.'}
            </CardDescription>
          </div>
                  
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{t('doctor.analytics.recentPatients', 'Recent Patients')}</h3>
          {comprehensiveAnalytics.recentPatients.length > 0 ? (
            <ul className="divide-y divide-border bg-muted rounded-2xl">
              {comprehensiveAnalytics.recentPatients.map((patient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-3 px-4 hover:bg-primary/5 transition-colors"
                >
                  <span className="font-medium text-card-foreground">{patient.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {t('doctor.analytics.lastVisit', 'Last Visit')}: {patient.lastVisit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent patients data available</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={comprehensiveAnalytics.totalPatients}
            label={t('doctor.analytics.totalPatients', 'Total Patients')}
            icon={Users}
          />
          <StatCard
            value={comprehensiveAnalytics.totalAppointments}
            label={t('doctor.analytics.totalAppointments', 'Total Appointments')}
            icon={Calendar}
          />
          <StatCard
            value={comprehensiveAnalytics.prescriptionsIssued}
            label={t('doctor.analytics.prescriptionsIssued', 'Prescriptions Issued')}
            icon={Pill}
          />
          <StatCard
            value={comprehensiveAnalytics.upcomingAppointments}
            label={t('doctor.analytics.upcomingAppointments', 'Upcoming Appointments')}
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ChartCard title={t('doctor.analytics.appointmentTrends', 'Appointment Trends')}>
            <Bar data={barData} options={barOptions} height={220} />
          </ChartCard>
          <ChartCard title={t('doctor.analytics.patientDistribution', 'Patient Distribution')} className="flex flex-col items-center">
            <Doughnut data={doughnutData} options={doughnutOptions} width={220} height={220} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ChartCard title={t('doctor.analytics.prescriptionTrends', 'Prescription Trends')}>
            <Line data={prescriptionLineData} options={prescriptionLineOptions} height={220} />
          </ChartCard>
          <ChartCard title={t('doctor.analytics.appointmentTypeDistribution', 'Appointment Type Distribution')} className="flex flex-col items-center">
            <Pie data={appointmentTypePieData} options={appointmentTypePieOptions} width={220} height={220} />
          </ChartCard>
        </div>

        <TopConditions conditions={comprehensiveAnalytics.topConditions} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SmallStatCard
            value={comprehensiveAnalytics.newPatientsThisMonth}
            label={t('doctor.analytics.newPatientsThisMonth', 'New Patients This Month')}
          />
          <SmallStatCard
            value={comprehensiveAnalytics.completedAppointments}
            label={t('doctor.analytics.completedAppointments', 'Completed Appointments')}
          />
          <SmallStatCard
            value={comprehensiveAnalytics.cancelledAppointments}
            label={t('doctor.analytics.cancelledAppointments', 'Cancelled Appointments')}
          />
          <SmallStatCard
            value={`${Math.round(comprehensiveAnalytics.noShowRate * 100)}%`}
            label={t('doctor.analytics.noShowRate', 'No-Show Rate')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SmallStatCard
            value={`${comprehensiveAnalytics.avgAppointmentDuration} min`}
            label={t('doctor.analytics.avgAppointmentDuration', 'Avg. Appointment Duration')}
          />
          <SmallStatCard
            value={comprehensiveAnalytics.avgPatientAge}
            label={t('doctor.analytics.avgPatientAge', 'Avg. Patient Age')}
          />
          <SmallStatCard
            value={comprehensiveAnalytics.busiestDay}
            label={t('doctor.analytics.busiestDay', 'Busiest Day')}
          />
          <SmallStatCard
            value={comprehensiveAnalytics.busiestHour}
            label={t('doctor.analytics.busiestHour', 'Busiest Hour')}
          />
        </div>

        <ChartCard title={t('doctor.analytics.genderAgeDistribution', 'Average Age by Gender')} className="mb-4">
          <Bar data={genderAgeBarData} options={genderAgeBarOptions} height={180} />
        </ChartCard>
      </CardContent>
    </Card>
  );
}