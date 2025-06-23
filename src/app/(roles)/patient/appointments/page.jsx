'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, differenceInCalendarDays } from 'date-fns';
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Link from 'next/link';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import AppointmentForm from '@/components/appointments/AppointmentForm';

const AppointmentCard = ({ appointment, onReschedule }) => {
    const getStatusProps = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming':
            case 'scheduled':
                return { variant: 'secondary', label: 'Upcoming' };
            case 'completed':
                return { variant: 'outline', label: 'Completed' };
            case 'cancelled':
                return { variant: 'destructive', label: 'Cancelled' };
            case 'pending':
                return { variant: 'ghost', label: 'Pending' };
            default:
                return { variant: 'outline', label: status };
        }
    };
    const now = new Date();
    const appointmentDate = new Date(appointment.date || appointment.appointmentDate);
    const hoursDiff = (appointmentDate - now) / (1000 * 60 * 60);
    const canReschedule = hoursDiff >= 72;
    const statusProps = getStatusProps(appointment.status);
    return (
        <Card className="hover:shadow-lg transition-shadow border border-border bg-card flex flex-col h-full relative">
            {/* Status badge at top right */}
            <div className="absolute top-4 right-4">
                <Button variant={statusProps.variant} size="sm" className="rounded-full px-4 py-1 cursor-default" disabled>{statusProps.label}</Button>
            </div>
            <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex-1 space-y-2 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-primary">{appointment.title || appointment.consultationType}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Dr. {appointment.doctor?.name || appointment.doctor?.firstName + ' ' + appointment.doctor?.lastName || 'Select Doctor'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time || appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {appointment.type && <span>{appointment.type}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.reason}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    {canReschedule && (
                        <DialogTrigger >
                            <Button variant="outline" size="sm" onClick={() => onReschedule(appointment)}>
                                Reschedule
                            </Button>
                        </DialogTrigger>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const AppointmentsPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('new');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

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
        return matchesSearch;
    });

    const handleNewAppointment = () => {
        setModalType('new');
        setSelectedAppointment(null);
        setShowModal(true);
    };

    const handleReschedule = (appointment) => {
        setModalType('reschedule');
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAppointment(null);
    };

    const handleSubmitAppointment = (data) => {
        handleCloseModal();
    };

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Appointments"
                description="Schedule and manage your healthcare appointments."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Appointments', href: '/patient/appointments' }
                ]}
                actions={
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogTrigger >
                            <Button onClick={handleNewAppointment}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl w-full">
                            <AppointmentForm
                                open={showModal}
                                onClose={handleCloseModal}
                                onSubmit={handleSubmitAppointment}
                                patient={{ id: 1, name: 'John Doe' }}
                                doctor={selectedAppointment ? { id: 1, name: selectedAppointment.doctor } : { id: 1, name: 'Sarah Johnson' }}
                                initialData={modalType === 'reschedule' ? selectedAppointment : null}
                                isReschedule={modalType === 'reschedule'}
                            />
                        </DialogContent>
                    </Dialog>
                }
            />

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search appointments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Appointments List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <Dialog key={appointment.id} open={showModal && selectedAppointment?.id === appointment.id && modalType === 'reschedule'} onOpenChange={setShowModal}>
                            <AppointmentCard appointment={appointment} onReschedule={handleReschedule} />
                            {/* The reschedule modal is handled globally above, so this Dialog is just for accessibility */}
                        </Dialog>
                    ))
                ) : (
                    <div className="text-center py-12 bg-card rounded-lg shadow-sm col-span-full">
                        <Calendar className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
                        <h3 className="text-xl font-semibold mb-3">No Appointments Found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery
                                ? 'Try adjusting your search to find appointments.'
                                : 'You don\'t have any appointments. Schedule your first appointment!'}
                        </p>
                        <Button onClick={handleNewAppointment}>
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule New Appointment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
