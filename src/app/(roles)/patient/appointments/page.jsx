'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
    Calendar, Clock, MapPin, Video, Phone, 
    User, ChevronRight, Plus, Search, Filter,
    Calendar as CalendarIcon, List, Grid
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Link from 'next/link';

const AppointmentCard = ({ appointment }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'video':
                return <Video className="h-4 w-4" />;
            case 'phone':
                return <Phone className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-primary">{appointment.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Dr. {appointment.doctor}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{format(new Date(appointment.date), 'PPP')} at {appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {getTypeIcon(appointment.type)}
                                <span>{appointment.type === 'video' ? 'Video Consultation' : 
                                       appointment.type === 'phone' ? 'Phone Consultation' : 
                                       appointment.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                        </Badge>
                        <div className="flex gap-2">
                            {appointment.status === 'upcoming' && (
                                <>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/patient/appointments/${appointment.id}/reschedule`}>
                                            Reschedule
                                        </Link>
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                        Cancel
                                    </Button>
                                </>
                            )}
                            <Button variant="destructive" size="sm" asChild>
                                <Link href={`/patient/appointments/${appointment.id}`}>
                                    View Details
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AppointmentsPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    // Mock data - replace with actual data from your API
    const appointments = [
        {
            id: 1,
            title: 'Annual Check-up',
            doctor: 'Sarah Johnson',
            date: '2024-03-20',
            time: '10:00 AM',
            type: 'in-person',
            location: 'Main Clinic, Room 101',
            status: 'upcoming'
        },
        {
            id: 2,
            title: 'Follow-up Consultation',
            doctor: 'Michael Chen',
            date: '2024-03-22',
            time: '2:30 PM',
            type: 'video',
            location: 'Virtual Meeting',
            status: 'upcoming'
        },
        {
            id: 3,
            title: 'Lab Results Review',
            doctor: 'Emily Rodriguez',
            date: '2024-03-15',
            time: '11:00 AM',
            type: 'phone',
            location: 'Phone Consultation',
            status: 'completed'
        }
    ];

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Appointments"
                description="Schedule and manage your healthcare appointments."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Appointments', href: '/patient/appointments' }
                ]}
            />

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="in-person">In-Person</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setViewMode('calendar')}>
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                    <Button asChild>
                        <Link href="/patient/appointments/new">
                            <Plus className="h-4 w-4 mr-2" />
                            New Appointment
                        </Link>
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Appointments List/Calendar */}
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                            <Calendar className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
                            <h3 className="text-xl font-semibold mb-3">No Appointments Found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                                    ? 'Try adjusting your search or filters to find appointments.'
                                    : 'You don\'t have any upcoming appointments. Schedule your first appointment!'}
                            </p>
                            <Button asChild>
                                <Link href="/patient/appointments/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule New Appointment
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="past" className="space-y-4">
                    {/* Past appointments content */}
                </TabsContent>
                <TabsContent value="cancelled" className="space-y-4">
                    {/* Cancelled appointments content */}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AppointmentsPage;
