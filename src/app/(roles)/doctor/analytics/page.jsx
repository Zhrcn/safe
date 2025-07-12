'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
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

const mockAnalytics = {
  totalPatients: 120,
  newPatientsThisMonth: 15,
  totalAppointments: 340,
  completedAppointments: 300,
  cancelledAppointments: 20,
  upcomingAppointments: 20,
  prescriptionsIssued: 210,
  appointmentTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    data: [30, 45, 50, 40, 60, 55, 60],
  },
  patientDistribution: {
    labels: ['Male', 'Female'],
    data: [60, 55],
  },
  topConditions: [
    { name: 'Diabetes', count: 30 },
    { name: 'Hypertension', count: 25 },
    { name: 'Asthma', count: 15 },
    { name: 'Heart Disease', count: 10 },
    { name: 'Other', count: 40 },
  ],
  prescriptionTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    data: [20, 25, 30, 28, 35, 32, 40],
  },
  appointmentTypeDistribution: {
    labels: ['In-person', 'Video', 'Phone'],
    data: [200, 100, 40],
  },
  avgAppointmentDuration: 32,
  avgPatientAge: 45,
  genderAgeDistribution: {
    labels: ['Male', 'Female', 'Other'],
    data: [44, 46, 38],
  },
  noShowRate: 0.06,
  busiestDay: 'Wednesday',
  busiestHour: '10:00 AM',
};

const recentPatients = [
  { name: 'John Doe', lastVisit: '2024-05-01' },
  { name: 'Jane Smith', lastVisit: '2024-04-28' },
  { name: 'Robert Wilson', lastVisit: '2024-04-25' },
];

function StatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-2xl p-6">
      <span className="text-3xl font-bold text-primary">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function SmallStatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-2xl p-4">
      <span className="text-xl font-bold text-primary">{value}</span>
      <span className="text-muted-foreground">{label}</span>
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
      <ul className="divide-y divide-border">
        {conditions.map((cond) => (
          <li key={cond.name} className="flex justify-between py-2">
            <span>{t(`doctor.analytics.condition.${cond.name.toLowerCase()}`, cond.name)}</span>
            <span className="font-semibold">{cond.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalyticsPage() {
  const { t, i18n } = useTranslation();

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
        labels: mockAnalytics.appointmentTrends.labels,
        datasets: [
          {
            label: t('doctor.analytics.appointments', 'Appointments'),
            data: mockAnalytics.appointmentTrends.data,
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
        labels: mockAnalytics.patientDistribution.labels,
        datasets: [
          {
            data: mockAnalytics.patientDistribution.data,
            backgroundColor: [
              chartColors.primary + 'b3',
              chartColors.secondary + 'b3',
            ],
            borderColor: [
              chartColors.primary,
              chartColors.secondary,
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
        labels: mockAnalytics.prescriptionTrends.labels,
        datasets: [
          {
            label: t('doctor.analytics.prescriptionsIssued', 'Prescriptions Issued'),
            data: mockAnalytics.prescriptionTrends.data,
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
        labels: mockAnalytics.appointmentTypeDistribution.labels,
        datasets: [
          {
            data: mockAnalytics.appointmentTypeDistribution.data,
            backgroundColor: [
              chartColors.primary + 'b3',
              chartColors.warning + 'b3',
              chartColors.danger + 'b3',
            ],
            borderColor: [
              chartColors.primary,
              chartColors.warning,
              chartColors.danger,
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
        labels: mockAnalytics.genderAgeDistribution.labels,
        datasets: [
          {
            label: t('doctor.analytics.avgAge', 'Average Age'),
            data: mockAnalytics.genderAgeDistribution.data,
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
  }, [chartColors, t]);

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
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{t('doctor.analytics.recentPatients', 'Recent Patients')}</h3>
          <ul className="divide-y divide-border bg-muted rounded-2xl">
            {recentPatients.map((patient) => (
              <li
                key={patient.name}
                className="flex justify-between items-center py-3 px-4 hover:bg-primary/5 transition-colors"
              >
                <span className="font-medium text-card-foreground">{patient.name}</span>
                <span className="text-sm text-muted-foreground">
                  {t('doctor.analytics.lastVisit', 'Last Visit')}: {patient.lastVisit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={mockAnalytics.totalPatients}
            label={t('doctor.analytics.totalPatients', 'Total Patients')}
          />
          <StatCard
            value={mockAnalytics.totalAppointments}
            label={t('doctor.analytics.totalAppointments', 'Total Appointments')}
          />
          <StatCard
            value={mockAnalytics.prescriptionsIssued}
            label={t('doctor.analytics.prescriptionsIssued', 'Prescriptions Issued')}
          />
          <StatCard
            value={mockAnalytics.upcomingAppointments}
            label={t('doctor.analytics.upcomingAppointments', 'Upcoming Appointments')}
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

        <TopConditions conditions={mockAnalytics.topConditions} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SmallStatCard
            value={mockAnalytics.newPatientsThisMonth}
            label={t('doctor.analytics.newPatientsThisMonth', 'New Patients This Month')}
          />
          <SmallStatCard
            value={mockAnalytics.completedAppointments}
            label={t('doctor.analytics.completedAppointments', 'Completed Appointments')}
          />
          <SmallStatCard
            value={mockAnalytics.cancelledAppointments}
            label={t('doctor.analytics.cancelledAppointments', 'Cancelled Appointments')}
          />
          <SmallStatCard
            value={`${Math.round(mockAnalytics.noShowRate * 100)}%`}
            label={t('doctor.analytics.noShowRate', 'No-Show Rate')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SmallStatCard
            value={`${mockAnalytics.avgAppointmentDuration} min`}
            label={t('doctor.analytics.avgAppointmentDuration', 'Avg. Appointment Duration')}
          />
          <SmallStatCard
            value={mockAnalytics.avgPatientAge}
            label={t('doctor.analytics.avgPatientAge', 'Avg. Patient Age')}
          />
          <SmallStatCard
            value={mockAnalytics.busiestDay}
            label={t('doctor.analytics.busiestDay', 'Busiest Day')}
          />
          <SmallStatCard
            value={mockAnalytics.busiestHour}
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