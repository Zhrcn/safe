'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Calendar, Clock, Heart, Activity, 
    Pill, FileText, MessageSquare, Plus,
    ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Tooltip implementation for this page
const Tooltip = ({ children, text }) => (
  <span className="relative group">
    {children}
    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-2 py-1 rounded bg-foreground text-background text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 shadow-lg">
      {text}
    </span>
  </span>
);

const HealthMetricCard = ({ title, value, icon: Icon, trend, color, progress }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)' }}
    className="focus-within:ring-2 focus-within:ring-primary outline-none"
  >
    <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none">
      <CardContent className="p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-card-foreground">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${color} shadow-md`} tabIndex={0} aria-label={title}>
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="transition-all duration-700 rounded-full" />
            <span className="block text-xs text-muted-foreground mt-1">Adherence</span>
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
              {trend === 0 ? 'No change' : `${Math.abs(trend)}% from last month`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, href, color, tooltip }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)' }}
    className="focus-within:ring-2 focus-within:ring-primary outline-none"
  >
    <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none">
      <CardContent className="p-6 rounded-2xl">
        <Tooltip text={tooltip}>
          <Link href={href} className="flex items-start gap-4 group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
            <div className={`p-3 rounded-xl ${color} shadow-md group-hover:scale-105 transition-transform`} tabIndex={0} aria-label={title}>
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </Tooltip>
      </CardContent>
    </Card>
  </motion.div>
);

const AppointmentCard = ({ appointment }) => (
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
                with Dr. {appointment.doctor}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {appointment.time}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'} className="capitalize rounded-lg px-3 py-1 text-sm">
            {appointment.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardPage = () => {
    const router = useRouter();
    // Mock user for greeting
    const user = { firstName: 'John' };

    // Mock data - replace with actual data from your API
    const healthMetrics = [
        {
            title: 'Heart Rate',
            value: '72 BPM',
            icon: Heart,
            trend: -2,
            color: 'bg-error',
        },
        {
            title: 'Blood Pressure',
            value: '120/80',
            icon: Activity,
            trend: 0,
            color: 'bg-info',
        },
        {
            title: 'Medication Adherence',
            value: '95%',
            icon: Pill,
            trend: 5,
            color: 'bg-success',
            progress: 95,
        },
        {
            title: 'Steps Today',
            value: '6,543',
            icon: Activity,
            trend: 12,
            color: 'bg-secondary',
        }
    ];

    const quickActions = [
        {
            title: 'Schedule Appointment',
            description: 'Book a new appointment with your healthcare provider',
            icon: Calendar,
            href: '/patient/appointments/new',
            color: 'bg-info',
            tooltip: 'Book a new appointment',
        },
        {
            title: 'View Medical Records',
            description: 'Access your medical history and test results',
            icon: FileText,
            href: '/patient/medical-records',
            color: 'bg-success',
            tooltip: 'See your medical history',
        },
        {
            title: 'Message Provider',
            description: 'Chat with your healthcare team',
            icon: MessageSquare,
            href: '/patient/messaging',
            color: 'bg-secondary',
            tooltip: 'Send a message to your provider',
        }
    ];

    const upcomingAppointments = [
        {
            id: 1,
            title: 'Annual Check-up',
            doctor: 'Sarah Johnson',
            time: 'Tomorrow, 10:00 AM',
            status: 'upcoming'
        },
        {
            id: 2,
            title: 'Follow-up Consultation',
            doctor: 'Michael Chen',
            time: 'Next Monday, 2:30 PM',
            status: 'upcoming'
        }
    ];

    return (
        <div className="flex flex-col gap-8 bg-background min-h-screen text-foreground px-2 sm:px-6 md:px-10 py-8 relative overflow-x-hidden rounded-2xl">
            {/* Animated background shape */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.08, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl z-0"
                aria-hidden="true"
            />
            <PageHeader
                title={`Welcome back${user?.firstName ? ', ' + user.firstName : ''}!`}
                description={"Here's an overview of your health status. Tip: Stay hydrated today!"}
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' }
                ]}
            />
            {/* Health Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10 rounded-2xl">
                <AnimatePresence>
                    {healthMetrics.map((metric, index) => (
                        <HealthMetricCard key={index} {...metric} />
                    ))}
                </AnimatePresence>
            </section>
            {/* Main Content */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 rounded-2xl">
                {/* Left Column - Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-lg font-semibold text-card-foreground mb-2 flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" /> Quick Actions
                    </h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {quickActions.map((action, index) => (
                                <QuickActionCard key={index} {...action} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                {/* Right Column - Appointments and Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="appointments" className="w-full rounded-2xl">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted">
                            <TabsTrigger value="appointments" className="rounded-xl">Upcoming Appointments</TabsTrigger>
                            <TabsTrigger value="activity" className="rounded-xl">Recent Activity</TabsTrigger>
                        </TabsList>
                        <TabsContent value="appointments">
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {upcomingAppointments.map((appointment) => (
                                        <AppointmentCard key={appointment.id} appointment={appointment} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </TabsContent>
                        <TabsContent value="activity">
                            <div className="space-y-4 text-muted-foreground text-center py-8 rounded-xl bg-card/60">
                                <span>No recent activity yet.</span>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;