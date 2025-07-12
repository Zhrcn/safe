'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Search, Video, Phone, User, Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import AppointmentManagementCard from '@/components/doctor/AppointmentManagementCard';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDoctorAppointments } from '@/store/slices/doctor/doctorAppointmentsSlice';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/Dialog';

function getStatusColor(status) {
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
}

function getTypeIcon(type) {
    switch (type?.toLowerCase()) {
        case 'video':
            return <Video className="h-4 w-4" />;
        case 'phone':
            return <Phone className="h-4 w-4" />;
        default:
            return <MapPin className="h-4 w-4" />;
    }
}

function formatDateTime(date, time) {
    try {
        const dateObj = new Date(date);
        const placeholderDate = new Date('1111-01-01');
        
        // If date is a placeholder (like 1/1/1111), show as TBD
        if (dateObj.getTime() === placeholderDate.getTime() || isNaN(dateObj.getTime())) {
            return {
                date: 'TBD',
                time: time || 'TBD'
            };
        }
        
        return {
            date: format(dateObj, 'MMM dd, yyyy'),
            time: time || format(dateObj, 'hh:mm a')
        };
    } catch (error) {
        return {
            date: 'TBD',
            time: 'TBD'
        };
    }
}

const AppointmentMobileCard = ({ appointment, onSelect, onAction, t }) => {
    const appointmentDate = appointment.date || appointment.appointmentDate;
    const appointmentTime = appointment.time || appointment.appointmentTime;
    const { date, time } = formatDateTime(appointmentDate, appointmentTime);

    const patientName = appointment.patient
        ? `${appointment.patient.user?.firstName || appointment.patient.firstName || ''} ${appointment.patient.user?.lastName || appointment.patient.lastName || ''}`.trim()
        : t('doctor.appointments.unknownPatient', 'Unknown Patient');

    const type = appointment.type || appointment.consultationType || '';
    const reason = appointment.reason || '';
    const status = appointment.status || t('doctor.appointments.unknown', 'Unknown');

    return (
        <div className="bg-white border border-border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{patientName}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status}
                </span>
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{time}</span>
                </div>
            </div>

            {/* Type & Reason */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                    {getTypeIcon(type)}
                    <span className="capitalize">{type || '-'}</span>
                </div>
                {reason && (
                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Reason:</span> {reason}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col xs:flex-row md:flex-row lg:flex-col xl:flex-row flex-wrap gap-2 pt-2 border-t border-border">
                {appointment.status === 'pending' && (
                    <>
                        <Button
                            size="sm"
                            variant="default"
                            className="text-xs px-3 py-1 h-8 w-full sm:w-auto lg:w-full xl:w-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(appointment, 'accept');
                            }}
                        >
                            {t('doctor.appointments.accepted', 'Accepted')}
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            className="text-xs px-3 py-1 h-8 w-full sm:w-auto lg:w-full xl:w-auto"
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
                            className="text-xs px-3 py-1 h-8 w-full sm:w-auto lg:w-full xl:w-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(appointment, 'approve_reschedule');
                            }}
                        >
                            {t('doctor.appointments.approveReschedule', 'Approve')}
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            className="text-xs px-3 py-1 h-8 w-full sm:w-auto lg:w-full xl:w-auto"
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
                        className="text-xs px-3 py-1 h-8 w-full sm:w-auto lg:w-full xl:w-auto"
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
                    className="h-8 w-8 p-0 ml-auto"
                    title={t('doctor.appointments.viewDetails', 'View Details')}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

const AppointmentTableRow = ({ appointment, onSelect, onAction, t }) => {
    const appointmentDate = appointment.date || appointment.appointmentDate;
    const appointmentTime = appointment.time || appointment.appointmentTime;
    const { date, time } = formatDateTime(appointmentDate, appointmentTime);

    const patientName = appointment.patient
        ? `${appointment.patient.user?.firstName || appointment.patient.firstName || ''} ${appointment.patient.user?.lastName || appointment.patient.lastName || ''}`.trim()
        : t('doctor.appointments.unknownPatient', 'Unknown Patient');

    const type = appointment.type || appointment.consultationType || '';
    const reason = appointment.reason || '';
    const status = appointment.status || t('doctor.appointments.unknown', 'Unknown');

    return (
        <tr className="hover:bg-muted/40 border-b border-border">
            <td className="px-3 lg:px-4 py-3 whitespace-nowrap font-medium">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm lg:text-base">{patientName}</span>
                </div>
            </td>
            <td className="px-3 lg:px-4 py-3 whitespace-nowrap">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{time}</span>
                    </div>
                </div>
            </td>
            <td className="px-3 lg:px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="capitalize text-sm">{type || '-'}</span>
                </div>
            </td>
            <td className="px-3 lg:px-4 py-3">
                <div className="max-w-32 lg:max-w-48">
                    <span className="text-sm text-muted-foreground truncate block">{reason || '-'}</span>
                </div>
            </td>
            <td className="px-3 lg:px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status}
                </span>
            </td>
            <td className="px-3 lg:px-4 py-3">
                <div className="flex flex-col xs:flex-row md:flex-row lg:flex-col xl:flex-row flex-wrap gap-1 lg:gap-2 justify-end">
                    {appointment.status === 'pending' && (
                        <>
                            <Button
                                size="sm"
                                variant="success"
                                className="text-xs px-2 py-1 h-7 lg:h-8 lg:px-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction(appointment, 'accept');
                                }}
                            >
                                {t('doctor.appointments.accepted', 'Accepted')}
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                className="text-xs px-2 py-1 h-7 lg:h-8 lg:px-3"
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
                                variant="success"
                                className="text-xs px-2 py-1 h-7 lg:h-8 lg:px-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction(appointment, 'approve_reschedule');
                                }}
                            >
                                {t('doctor.appointments.approveReschedule', 'Approve')}
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                className="text-xs px-2 py-1 h-7 lg:h-8 lg:px-3"
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
                            className="text-xs px-2 py-1 h-7 lg:h-8 lg:px-3"
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
                        className="h-7 w-7 lg:h-8 lg:w-8 p-0"
                        title={t('doctor.appointments.viewDetails', 'View Details')}
                    >
                        <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

const AppointmentDetailsDialog = ({ open, onOpenChange, appointment, dialogMode, onActionComplete, t }) => {
    if (!appointment) return null;
    const appointmentDate = appointment.date || appointment.appointmentDate;
    const appointmentTime = appointment.time || appointment.appointmentTime;
    const { date, time } = formatDateTime(appointmentDate, appointmentTime);

    const patientName = appointment.patient
        ? `${appointment.patient.user?.firstName || appointment.patient.firstName || ''} ${appointment.patient.user?.lastName || appointment.patient.lastName || ''}`.trim()
        : t('doctor.appointments.unknownPatient', 'Unknown Patient');

    const doctorName = appointment.doctor
        ? `${appointment.doctor.user?.firstName || appointment.doctor.firstName || ''} ${appointment.doctor.user?.lastName || appointment.doctor.lastName || ''}`.trim()
        : t('doctor.appointments.unknownDoctor', 'Unknown Doctor');

    // Limit dialog height and make content scrollable if needed
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-lg w-[95vw] sm:w-full p-0 mx-2"
                style={{
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <DialogHeader className="p-4 sm:p-6 pb-2">
                    <DialogTitle className="text-lg sm:text-xl">
                        {t('doctor.appointments.details', 'Appointment Details')}
                    </DialogTitle>
                </DialogHeader>
                <div
                    className="overflow-y-auto px-4 sm:px-6 pb-2"
                    style={{ maxHeight: '60vh' }}
                >
                    <div className="space-y-3 text-sm sm:text-base">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold min-w-20">{t('doctor.appointments.patient', 'Patient')}:</span> 
                            <span className="break-words">{patientName}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold min-w-20">{t('doctor.appointments.doctor', 'Doctor')}:</span> 
                            <span className="break-words">{doctorName}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold min-w-20">{t('doctor.appointments.date', 'Date')}:</span> 
                            <span>{date}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold min-w-20">{t('doctor.appointments.time', 'Time')}:</span> 
                            <span>{time}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold min-w-20">{t('doctor.appointments.type', 'Type')}:</span> 
                            <span className="capitalize">{appointment.type || appointment.consultationType || '-'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                            <span className="font-semibold min-w-20">{t('doctor.appointments.reason', 'Reason')}:</span> 
                            <span className="break-words">{appointment.reason || '-'}</span>
                        </div>
                        {appointment.notes && (
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                <span className="font-semibold min-w-20">{t('doctor.appointments.notes', 'Notes')}:</span> 
                                <span className="break-words">{appointment.notes}</span>
                            </div>
                        )}
                        {appointment.status === 'reschedule_requested' && appointment.rescheduleRequest && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
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
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-semibold min-w-20">{t('doctor.appointments.location', 'Location')}:</span> 
                                <span className="break-words">{appointment.location}</span>
                            </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                            <strong>Appointment ID:</strong> {appointment._id}
                        </div>
                    </div>
                    <div className="mt-6">
                        <AppointmentManagementCard
                            appointment={appointment}
                            dialogMode={dialogMode}
                            onActionComplete={onActionComplete}
                        />
                    </div>
                </div>
                <div className="p-4 sm:p-6 pt-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full mt-2 text-sm sm:text-base">
                            {t('doctor.appointments.close', 'Close')}
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
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
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchDoctorAppointments());
    }, [dispatch]);

    const filteredAppointments = appointments.filter(appointment => {
        const patientName = appointment.patient
            ? `${appointment.patient.user?.firstName || appointment.patient.firstName || ''} ${appointment.patient.user?.lastName || appointment.patient.lastName || ''}`.toLowerCase()
            : '';
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
        setDetailsDialogOpen(true);
    };

    const handleAppointmentAction = (appointment, mode) => {
        setSelectedAppointment(appointment);
        setDialogMode(mode);
        setDetailsDialogOpen(true);
    };

    const handleCloseManagement = () => {
        setSelectedAppointment(null);
        setDialogMode(null);
        setDetailsDialogOpen(false);
    };

    const handleActionComplete = () => {
        setDialogMode(null);
        setDetailsDialogOpen(false);
        setSelectedAppointment(null);
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
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
            {/* Header Card */}
            <Card className="mb-4 sm:mb-6 lg:mb-8 rounded-xl shadow-lg">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="w-full lg:w-auto">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t('doctor.appointments.title', 'Appointments')}</h1>
                            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                                {t('doctor.appointments.subtitle', 'Dr.')} {doctorName}
                            </p>
                        </div>
                        
                        {/* Search and Filters */}
                        <div className="w-full lg:w-auto space-y-3 lg:space-y-0 lg:space-x-3 lg:flex lg:items-center">
                            {/* Search */}
                            <div className="relative w-full lg:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder={t('doctor.appointments.searchPlaceholder', 'Search appointments...')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-2xl text-sm"
                                />
                            </div>
                            
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                                <div className="w-full sm:w-32 lg:w-36">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="text-sm">
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
                                <div className="w-full sm:w-32 lg:w-36">
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="text-sm">
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
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="danger" className="mb-6 rounded-2xl bg-danger/10 border border-danger text-danger-foreground">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card className="rounded-xl shadow-lg">
                <CardContent className="p-0">
                    {filteredAppointments.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                            <div className="mx-auto mb-4 opacity-40 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                                <Calendar className="w-full h-full" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                                    ? t('doctor.appointments.noFilteredResults', 'No appointments match your filters')
                                    : t('doctor.appointments.noAppointments', 'No appointments found')
                                }
                            </h3>
                            <p className="text-muted-foreground text-sm sm:text-base">
                                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                                    ? t('doctor.appointments.tryDifferentFilters', 'Try adjusting your search or filters')
                                    : t('doctor.appointments.noAppointmentsDesc', 'You don\'t have any appointments scheduled yet')
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block lg:hidden">
                                <div className="space-y-3 p-4">
                                    {filteredAppointments.map((appointment) => (
                                        <AppointmentMobileCard
                                            key={appointment._id || appointment.id}
                                            appointment={appointment}
                                            onSelect={handleAppointmentSelect}
                                            onAction={handleAppointmentAction}
                                            t={t}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr className="bg-muted">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{t('doctor.appointments.patient', 'Patient')}</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{t('doctor.appointments.dateTime', 'Date & Time')}</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{t('doctor.appointments.type', 'Type')}</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{t('doctor.appointments.reason', 'Reason')}</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{t('doctor.appointments.status', 'Status')}</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">{t('doctor.appointments.actions', 'Actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appointment) => (
                                            <AppointmentTableRow
                                                key={appointment._id || appointment.id}
                                                appointment={appointment}
                                                onSelect={handleAppointmentSelect}
                                                onAction={handleAppointmentAction}
                                                t={t}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <AppointmentDetailsDialog
                open={!!selectedAppointment && detailsDialogOpen}
                onOpenChange={(open) => {
                    if (!open) handleCloseManagement();
                }}
                appointment={selectedAppointment}
                dialogMode={dialogMode}
                onActionComplete={handleActionComplete}
                t={t}
            />
        </div>
    );
};

export default AppointmentsPage;