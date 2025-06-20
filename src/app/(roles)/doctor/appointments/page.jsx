'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Search, Video, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import AppointmentManagement from '@/components/doctor/AppointmentManagement';
import { appointments as mockAppointments } from '@/mockdata/appointments';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const AppointmentCard = ({ appointment }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming':
            case 'scheduled':
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
        switch (type?.toLowerCase()) {
            case 'video':
                return <Video className="h-4 w-4" />;
            case 'phone':
                return <Phone className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    const formatDateTime = (date, time) => {
        try {
            const dateObj = new Date(date);
            return {
                date: format(dateObj, 'MMM dd, yyyy'),
                time: time || format(dateObj, 'hh:mm a')
            };
        } catch (error) {
            console.error('Error formatting date:', error);
            return {
                date: 'Invalid date',
                time: 'Invalid time'
            };
        }
    };

    const { date, time } = formatDateTime(appointment.appointmentDate, appointment.appointmentTime);
    const patientName = appointment.patient ? 
        `${appointment.patient.firstName || ''} ${appointment.patient.lastName || ''}`.trim() : 
        'Unknown Patient';
    const doctorName = appointment.doctor ? 
        `${appointment.doctor.firstName || ''} ${appointment.doctor.lastName || ''}`.trim() : 
        'Unknown Doctor';

    return (
        <Card className="rounded-xl shadow-md border border-border mb-4">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{appointment.consultationType || 'Consultation'}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status || 'Unknown'}
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{patientName}</span>
                </div>
                {appointment.reason && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.reason}</span>
                    </div>
                )}
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
            consultationType: 'Annual Check-up',
            patient: {
                firstName: 'John',
                lastName: 'Doe'
            },
            doctor: {
                firstName: 'Sarah',
                lastName: 'Johnson'
            },
            appointmentDate: '2024-03-20',
            appointmentTime: '10:00 AM',
            type: 'in-person',
            reason: 'Main Clinic, Room 101',
            status: 'scheduled'
        },
        {
            id: 2,
            consultationType: 'Follow-up Consultation',
            patient: {
                firstName: 'Jane',
                lastName: 'Smith'
            },
            doctor: {
                firstName: 'Michael',
                lastName: 'Chen'
            },
            appointmentDate: '2024-03-22',
            appointmentTime: '2:30 PM',
            type: 'video',
            reason: 'Virtual Meeting',
            status: 'scheduled'
        },
        {
            id: 3,
            consultationType: 'Lab Results Review',
            patient: {
                firstName: 'Robert',
                lastName: 'Wilson'
            },
            doctor: {
                firstName: 'Emily',
                lastName: 'Rodriguez'
            },
            appointmentDate: '2024-03-15',
            appointmentTime: '11:00 AM',
            type: 'phone',
            reason: 'Phone Consultation',
            status: 'completed'
        }
    ];

    const filteredAppointments = appointments.filter(appointment => {
        const patientName = appointment.patient ? 
            `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase() : '';
        const matchesSearch = patientName.includes(searchQuery.toLowerCase()) ||
            (appointment.consultationType || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8 rounded-xl shadow-lg">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold">Appointments</h1>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search appointments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Types</option>
                            <option value="in-person">In Person</option>
                            <option value="video">Video</option>
                            <option value="phone">Phone</option>
                        </select>
                    </div>
                </CardContent>
            </Card>
            <div className="grid gap-4">
                {filteredAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
            </div>
        </div>
    );
};

export default AppointmentsPage;