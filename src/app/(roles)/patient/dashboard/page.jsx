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

const HealthMetricCard = ({ title, value, icon: Icon, trend, color }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1 mt-2">
                    {trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-error" />
                    )}
                    <span className={`text-sm ${trend > 0 ? 'text-success' : 'text-error'}`}>
                        {Math.abs(trend)}% from last month
                    </span>
                </div>
            )}
        </CardContent>
    </Card>
);

const QuickActionCard = ({ title, description, icon: Icon, href, color }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
            <Link href={href} className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
        </CardContent>
    </Card>
);

const AppointmentCard = ({ appointment }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{appointment.title}</h3>
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
                <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'}>
                    {appointment.status}
                </Badge>
            </div>
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    const router = useRouter();

    // Mock data - replace with actual data from your API
    const healthMetrics = [
        {
            title: 'Heart Rate',
            value: '72 BPM',
            icon: Heart,
            trend: -2,
            color: 'bg-error'
        },
        {
            title: 'Blood Pressure',
            value: '120/80',
            icon: Activity,
            trend: 0,
            color: 'bg-info'
        },
        {
            title: 'Medication Adherence',
            value: '95%',
            icon: Pill,
            trend: 5,
            color: 'bg-success'
        },
        {
            title: 'Steps Today',
            value: '6,543',
            icon: Activity,
            trend: 12,
            color: 'bg-secondary'
        }
    ];

    const quickActions = [
        {
            title: 'Schedule Appointment',
            description: 'Book a new appointment with your healthcare provider',
            icon: Calendar,
            href: '/patient/appointments/new',
            color: 'bg-info'
        },
        {
            title: 'View Medical Records',
            description: 'Access your medical history and test results',
            icon: FileText,
            href: '/patient/medical-records',
            color: 'bg-success'
        },
        {
            title: 'Message Provider',
            description: 'Chat with your healthcare team',
            icon: MessageSquare,
            href: '/patient/messaging',
            color: 'bg-secondary'
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
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's an overview of your health status."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' }
                ]}
            />

            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric, index) => (
                    <HealthMetricCard key={index} {...metric} />
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Quick Actions */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                    <div className="space-y-4">
                        {quickActions.map((action, index) => (
                            <QuickActionCard key={index} {...action} />
                        ))}
                    </div>
                </div>

                {/* Right Column - Appointments and Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="appointments" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
                            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                        </TabsList>
                        <TabsContent value="appointments" className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/patient/appointments">
                                    View All Appointments
                                </Link>
                            </Button>
                        </TabsContent>
                        <TabsContent value="activity" className="space-y-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-success/10">
                                                    <FileText className="h-4 w-4 text-success" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">New Lab Results</p>
                                                    <p className="text-sm text-muted-foreground">Blood test results available</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-info/10">
                                                    <MessageSquare className="h-4 w-4 text-info" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">New Message</p>
                                                    <p className="text-sm text-muted-foreground">From Dr. Johnson</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">5 hours ago</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;