'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Calendar, Clock, Heart, Activity, 
    Pill, FileText, MessageSquare, Plus,
    ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Card, CardContent} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '@/store/slices/patient/profileSlice';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { createAppointment, fetchAppointments } from '@/store/slices/patient/appointmentsSlice';
import { doctors } from '@/mockdata/doctors';

const HealthMetricCard = ({ title, value, icon: Icon, trend, color, progress, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)' }}
    className="focus-within:ring-2 focus-within:ring-primary outline-none h-full"
  >
    <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none min-h-[240px] h-full flex flex-col">
      <CardContent className="p-6 rounded-2xl h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-card-foreground">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${color} shadow-md`} tabIndex={0} aria-label={title}>
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end">
          {progress !== undefined && (
            <div className="mt-4">
              <Progress value={progress} className="transition-all duration-700 rounded-full" />
              <span className="block text-xs text-muted-foreground mt-1">{t('patient.dashboard.adherence')}</span>
            </div>
          )}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-error" />
              ) : null}
              <span className={`text-sm ${trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'}`}> 
                {trend === 0 ? t('patient.dashboard.noChange') : t('patient.dashboard.trend', { value: Math.abs(trend) }, '{{value}}% from last month')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, href, bgClass, tooltip, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)' }}
    className="focus-within:ring-2 focus-within:ring-primary outline-none h-full"
  >
    <Card className="hover:shadow-2xl transition-all duration-300 rounded-2xl bg-card/95 border-none h-full flex flex-col">
      <CardContent className="p-6 rounded-2xl h-full flex flex-col justify-between">
        <Tooltip content={tooltip}>
          <Link href={href} className="flex items-center gap-4 group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl transition-colors hover:bg-muted/60 py-2 px-1" onClick={onClick}>
            <div className={`p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform ${bgClass}`} tabIndex={0} aria-label={title}>
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1 truncate">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </Tooltip>
      </CardContent>
    </Card>
  </motion.div>
);

const AppointmentCard = ({ appointment, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)' }}
    className="focus-within:ring-2 focus-within:ring-primary outline-none"
  >
    <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none">
      <CardContent className="p-6 rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-primary/10 shadow-md">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{appointment.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('patient.dashboard.withDoctor', { doctor: appointment.doctor }, 'with Dr. {{doctor}}')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {appointment.time}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'} className="capitalize rounded-2xl px-3 py-1 text-sm">
            {t(`patient.appointments.${appointment.status}`)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardPage = () => {
    const { t, i18n } = useTranslation('common');
    const router = useRouter();
    const dispatch = useDispatch();
    const [isAppointmentFormOpen, setAppointmentFormOpen] = React.useState(false);
    const [vitals, setVitals] = useState(null);
    const [loadingVitals, setLoadingVitals] = useState(true);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);
    const { profile: user, loading, error } = useSelector(state => state.profile);
    const { appointments, loading: isLoadingAppointments, error: appointmentsError } = useSelector(state => state.appointments);
    const isRtl = i18n.language === 'ar';

    const loadVitals = async () => {
      setLoadingVitals(true);
      try {
  
      } catch (err) {
        setVitals(null);
      } finally {
        setLoadingVitals(false);
      }
    };

    React.useEffect(() => {
      dispatch(fetchAppointments());
      loadVitals();
    }, [dispatch]);

    const healthMetrics = [
        {
            title: t('patient.dashboard.heartRate', 'Heart Rate'),
            value: vitals && vitals.heartRate ? `${vitals.heartRate} BPM` : t('patient.dashboard.noData', 'No Data'),
            icon: Heart,
            trend: 0,
            color: 'bg-error',
        },
        {
            title: t('patient.dashboard.bloodPressure', 'Blood Pressure'),
            value: vitals && vitals.bloodPressure ? vitals.bloodPressure : t('patient.dashboard.noData', 'No Data'),
            icon: Activity,
            trend: 0,
            color: 'bg-info',
        },
        {
            title: t('patient.dashboard.temperature', 'Temperature'),
            value: vitals && vitals.temperature ? `${vitals.temperature}°C` : t('patient.dashboard.noData', 'No Data'),
            icon: Pill,
            trend: 0,
            color: 'bg-success',
        },
        {
            title: t('patient.dashboard.respiratoryRate', 'Respiratory Rate'),
            value: vitals && vitals.respiratoryRate ? `${vitals.respiratoryRate} bpm` : t('patient.dashboard.noData', 'No Data'),
            icon: Activity,
            trend: 0,
            color: 'bg-secondary',
        },
        {
            title: t('patient.dashboard.bmi', 'BMI'),
            value: vitals && vitals.bmi ? `${vitals.bmi}` : t('patient.dashboard.noData', 'No Data'),
            icon: TrendingUp,
            trend: 0,
            color: 'bg-warning',
        },
        {
            title: t('patient.dashboard.oxygenSaturation', 'Oxygen Saturation'),
            value: vitals && vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : t('patient.dashboard.noData', 'No Data'),
            icon: Clock,
            trend: 0,
            color: 'bg-primary',
        }
    ];

    const quickActions = [
        {
            title: t('patient.dashboard.scheduleAppointment'),
            description: t('patient.dashboard.scheduleAppointmentDesc'),
            icon: Calendar,
            href: '#',
            bgClass: 'bg-primary/90 dark:bg-primary/80',
            tooltip: t('patient.dashboard.scheduleAppointmentTooltip'),
            onClick: () => setAppointmentFormOpen(true),
        },
        {
            title: t('patient.dashboard.viewMedicalRecords'),
            description: t('patient.dashboard.viewMedicalRecordsDesc'),
            icon: FileText,
            href: '/patient/medical-records',
            bgClass: 'bg-success/90 dark:bg-success/80',
            tooltip: t('patient.dashboard.viewMedicalRecordsTooltip'),
        },
        {
            title: t('patient.dashboard.messageProvider'),
            description: t('patient.dashboard.messageProviderDesc'),
            icon: MessageSquare,
            href: '/patient/messaging',
            bgClass: 'bg-secondary/90 dark:bg-secondary/80',
            tooltip: t('patient.dashboard.messageProviderTooltip'),
        }
    ];

    const upcomingAppointments = appointments.filter(a => a.status === 'scheduled' || a.status === 'upcoming');

    return (
        <div className="flex flex-col gap-8 bg-background min-h-screen text-foreground px-2 sm:px-6 md:px-10 py-8 relative overflow-x-hidden rounded-2xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.08, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl z-0"
                aria-hidden="true"
            />
            <PageHeader
                title={t('patient.dashboard.welcome', { name: user?.firstName ? ', ' + user.firstName : '' })}
                description={t('patient.dashboard.overview')}
                breadcrumbs={[
                    { label: t('patient.dashboard.breadcrumb'), href: '/patient/dashboard' }
                ]}
            />
            <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 w-full">
                {healthMetrics.map((metric, idx) => (
                    <HealthMetricCard key={idx} {...metric} t={t} />
                ))}
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 rounded-2xl">
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-lg font-semibold text-card-foreground mb-2 flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" /> {t('patient.dashboard.quickActions')}
                    </h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {quickActions.map((action, index) => (
                                <div key={index} onClick={action.onClick}>
                                    <QuickActionCard {...action} />
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="appointments" className="w-full rounded-2xl">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted">
                            <TabsTrigger value="appointments" className="rounded-xl">{t('patient.dashboard.upcomingAppointments')}</TabsTrigger>
                            <TabsTrigger value="activity" className="rounded-xl">{t('patient.dashboard.recentActivity')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="appointments">
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {isLoadingAppointments ? (
                                        <div className="text-center py-8 text-muted-foreground">{t('loading')}</div>
                                    ) : appointmentsError ? (
                                        <div className="text-center py-8 text-red-500">{t('error')}</div>
                                    ) : upcomingAppointments.length > 0 ? (
                                        upcomingAppointments.map((appointment) => (
                                            <AppointmentCard key={appointment._id || appointment.id} appointment={appointment} t={t} />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">{t('patient.dashboard.noUpcomingAppointments')}</div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </TabsContent>
                        <TabsContent value="activity">
                            <div className="space-y-4 text-muted-foreground text-center py-8 rounded-xl bg-card/60">
                                <span>{t('patient.dashboard.noRecentActivity')}</span>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
            {isAppointmentFormOpen && (
                <AppointmentForm
                    onClose={() => setAppointmentFormOpen(false)}
                    onSubmit={async (appointmentData) => {
                        await dispatch(createAppointment({
                            doctorId: appointmentData.doctorId,
                            date: '1970-01-01',
                            time: 'TBD',
                            reason: appointmentData.reason,
                            type: appointmentData.type,
                            notes: appointmentData.notes,
                        })).unwrap();
                        setAppointmentFormOpen(false);
                        dispatch(fetchAppointments());
                    }}
                    initialData={null}
                    isReschedule={false}
                />
            )}
        </div>
    );
};

export default DashboardPage;