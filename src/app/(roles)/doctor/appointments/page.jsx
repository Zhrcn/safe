'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Search, Video, Phone, User, Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import AppointmentManagementCard from '@/components/doctor/AppointmentManagementCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDoctorAppointments } from '@/store/slices/doctor/doctorAppointmentsSlice';
import { Alert, AlertDescription } from '@/components/ui/Alert';

const AppointmentCard = ({ appointment, onSelect, onAction }) => {
    const { t } = useTranslation();
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming':
            case 'scheduled':
            case 'confirmed':
            case 'accepted':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rescheduled':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'reschedule_requested':
                return 'bg-orange-100 text-orange-800 border-orange-200';
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

    const appointmentDate = appointment.date || appointment.appointmentDate;
    const appointmentTime = appointment.time || appointment.appointmentTime;
    const { date, time } = formatDateTime(appointmentDate, appointmentTime);
    
    const patientName = appointment.patient ? 
        `${appointment.patient.user?.firstName || appointment.patient.firstName || ''} ${appointment.patient.user?.lastName || appointment.patient.lastName || ''}`.trim() : 
        t('doctor.appointments.unknownPatient', 'Unknown Patient');
    
    const doctorName = appointment.doctor ? 
        `${appointment.doctor.user?.firstName || appointment.doctor.firstName || ''} ${appointment.doctor.user?.lastName || appointment.doctor.lastName || ''}`.trim() : 
        t('doctor.appointments.unknownDoctor', 'Unknown Doctor');

    return (
        <Card className="rounded-xl shadow-md border border-border mb-4 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">
                            {patientName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {appointment.status || t('doctor.appointments.unknown', 'Unknown')}
                        </span>
                        {appointment.status === 'pending' && (
                            <>
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-primary text-foreground"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(appointment, 'accept');
                                    }}
                                >
                                    {t('doctor.appointments.accepted', 'Accepted')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-primary text-foreground"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(appointment, 'reject');
                                    }}
                                >
                                    {t('doctor.appointments.rejected', 'Rejected')}
                                </Button>
                            </>
                        )}
                        {appointment.status === 'reschedule_requested' && (
                            <>
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(appointment, 'approve_reschedule');
                                    }}
                                >
                                    {t('doctor.appointments.approveReschedule', 'Approve')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(appointment, 'reject_reschedule');
                                    }}
                                >
                                    {t('doctor.appointments.rejectReschedule', 'Reject')}
                                </Button>
                            </>
                        )}
                        {['accepted', 'confirmed', 'scheduled'].includes(appointment.status) && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-primary text-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction(appointment, 'reschedule');
                                }}
                            >
                                {t('doctor.appointments.rescheduled', 'Rescheduled')}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(appointment);
                            }}
                            className="h-8 w-8 p-0 border-primary text-primary"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{patientName}</span>
                </div>
                {appointment.reason && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.reason}</span>
                    </div>
                )}
                {appointment.notes && (
                    <div className="text-sm text-muted-foreground mb-2">
                        <strong>Notes:</strong> {appointment.notes}
                    </div>
                )}
                {appointment.status === 'reschedule_requested' && appointment.rescheduleRequest && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-orange-800 mb-2">
                            {t('doctor.appointments.rescheduleRequest', 'Reschedule Request')}
                        </div>
                        <div className="text-sm text-orange-700">
                            <strong>{t('doctor.appointments.preferredTimes', 'Preferred Times:')}</strong> {appointment.rescheduleRequest?.preferredTimes || 'Not specified'}
                        </div>
                        {appointment.rescheduleRequest?.reason && (
                            <div className="text-sm text-orange-700 mt-1">
                                <strong>{t('doctor.appointments.reason', 'Reason:')}</strong> {appointment.rescheduleRequest.reason}
                            </div>
                        )}
                    </div>
                )}
                {appointment.location && appointment.location !== 'TBD' && (
                    <div className="text-sm text-muted-foreground mb-2">
                        <strong>Location:</strong> {appointment.location}
                    </div>
                )}
                <div className="text-xs text-muted-foreground">
                    <strong>Appointment ID:</strong> {appointment._id}
                </div>
            </CardContent>
        </Card>
    );
};

const AppointmentsPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    
    const { appointments, loading, error } = useAppSelector(
        (state) => state.doctorAppointments
    );
    
    const { user } = useAppSelector((state) => state.auth);
    const doctorName = user ? `${user.firstName} ${user.lastName}` : 'Doctor';
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);

    useEffect(() => {
        dispatch(fetchDoctorAppointments());
    }, [dispatch]);

    const filteredAppointments = appointments.filter(appointment => {
        const patientName = appointment.patient ? 
            `${appointment.patient.user?.firstName || appointment.patient.firstName || ''} ${appointment.patient.user?.lastName || appointment.patient.lastName || ''}`.toLowerCase() : '';
        const matchesSearch = patientName.includes(searchQuery.toLowerCase()) ||
            (appointment.type || appointment.consultationType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (appointment.reason || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const handleAppointmentSelect = (appointment) => {
        setSelectedAppointment(appointment);
        setDialogMode(null);
    };

    const handleAppointmentAction = (appointment, mode) => {
        setSelectedAppointment(appointment);
        setDialogMode(mode);
    };

    const handleCloseManagement = () => {
        setSelectedAppointment(null);
        setDialogMode(null);
    };

    const handleActionComplete = () => {
        setDialogMode(null);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">{t('doctor.appointments.loading', 'Loading appointments...')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8 rounded-xl shadow-lg">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{t('doctor.appointments.title', 'Appointments')}</h1>
                        <p className="text-muted-foreground mt-1">
                            {t('doctor.appointments.subtitle', 'Dr.')} {doctorName}
                        </p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('doctor.appointments.searchPlaceholder', 'Search appointments...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-2xl"
                            />
                        </div>
                        <div className="w-36">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('doctor.appointments.allStatus', 'All Status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('doctor.appointments.allStatus', 'All Status')}</SelectItem>
                                    <SelectItem value="pending">{t('doctor.appointments.pending', 'Pending')}</SelectItem>
                                    <SelectItem value="accepted">{t('doctor.appointments.accepted', 'Accepted')}</SelectItem>
                                    <SelectItem value="rejected">{t('doctor.appointments.rejected', 'Rejected')}</SelectItem>
                                    <SelectItem value="scheduled">{t('doctor.appointments.scheduled', 'Scheduled')}</SelectItem>
                                    <SelectItem value="completed">{t('doctor.appointments.completed', 'Completed')}</SelectItem>
                                    <SelectItem value="cancelled">{t('doctor.appointments.cancelled', 'Cancelled')}</SelectItem>
                                    <SelectItem value="rescheduled">{t('doctor.appointments.rescheduled', 'Rescheduled')}</SelectItem>
                                    <SelectItem value="reschedule_requested">{t('doctor.appointments.rescheduleRequested', 'Reschedule Requested')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-36">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('doctor.appointments.allTypes', 'All Types')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('doctor.appointments.allTypes', 'All Types')}</SelectItem>
                                    <SelectItem value="checkup">{t('doctor.appointments.checkup', 'Checkup')}</SelectItem>
                                    <SelectItem value="consultation">{t('doctor.appointments.consultation', 'Consultation')}</SelectItem>
                                    <SelectItem value="follow-up">{t('doctor.appointments.followUp', 'Follow-up')}</SelectItem>
                                    <SelectItem value="emergency">{t('doctor.appointments.emergency', 'Emergency')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive" className="mb-6 rounded-2xl bg-destructive/10 border border-destructive text-destructive-foreground">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Appointments List */}
                <div className="lg:col-span-2">
                    {filteredAppointments.length === 0 ? (
                        <Card className="rounded-xl shadow-lg">
                            <CardContent className="p-8 text-center">
                                <div className="mx-auto mb-4 opacity-40 w-16 h-16 flex items-center justify-center">
                                    <Calendar className="w-full h-full" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                                        ? t('doctor.appointments.noFilteredResults', 'No appointments match your filters')
                                        : t('doctor.appointments.noAppointments', 'No appointments found')
                                    }
                                </h3>
                                <p className="text-muted-foreground">
                                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                                        ? t('doctor.appointments.tryDifferentFilters', 'Try adjusting your search or filters')
                                        : t('doctor.appointments.noAppointmentsDesc', 'You don\'t have any appointments scheduled yet')
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredAppointments.map((appointment) => (
                                <AppointmentCard 
                                    key={appointment._id || appointment.id} 
                                    appointment={appointment}
                                    onSelect={handleAppointmentSelect}
                                    onAction={handleAppointmentAction}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Appointment Management Panel */}
                <div className="lg:col-span-1">
                    {selectedAppointment ? (
                        <div className="sticky top-4">
                            <AppointmentManagementCard 
                                appointment={selectedAppointment}
                                dialogMode={dialogMode}
                                onActionComplete={handleActionComplete}
                            />
                            <Button 
                                variant="outline" 
                                onClick={handleCloseManagement}
                                className="w-full mt-4"
                            >
                                Close Management
                            </Button>
                        </div>
                    ) : (
                        <Card className="rounded-xl shadow-lg">
                            <CardContent className="p-8 text-center">
                                <div className="mx-auto mb-4 opacity-40 w-16 h-16 flex items-center justify-center">
                                    <Settings className="w-full h-full" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {t('doctor.appointments.selectAppointment', 'Select an Appointment')}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t('doctor.appointments.selectAppointmentDesc', 'Click the settings icon on any appointment to manage it')}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsPage;