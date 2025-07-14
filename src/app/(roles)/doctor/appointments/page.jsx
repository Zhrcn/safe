'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Search, Video, Phone, User, Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import AppointmentManagementCard from '@/components/doctor/AppointmentManagementCard';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDoctorAppointments, createAppointment } from '@/store/slices/doctor/doctorAppointmentsSlice';
import { fetchPatients, fetchPatientById } from '@/store/slices/doctor/doctorPatientsSlice';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/Dialog';

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

function isMoreThan24HoursAway(date, time) {
    try {
        const now = new Date();
        const appointmentDate = new Date(date);
        if (!time || time === 'TBD' || !time.includes(':')) {
            // If time is not set, just compare date
            const timeDifference = appointmentDate.getTime() - now.getTime();
            return timeDifference > 24 * 60 * 60 * 1000;
        }
        const [hours, minutes] = time.split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
        const timeDifference = appointmentDate.getTime() - now.getTime();
        return timeDifference > 24 * 60 * 60 * 1000;
    } catch {
        return false;
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{patientName}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status}
                </span>
            </div>
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
                {['accepted', 'confirmed', 'scheduled', 'rescheduled'].includes(appointment.status) &&
                    isMoreThan24HoursAway(appointment.date || appointment.appointmentDate, appointment.time || appointment.appointmentTime) && (
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
                    {['accepted', 'confirmed', 'scheduled', 'rescheduled'].includes(appointment.status) &&
                        isMoreThan24HoursAway(appointment.date || appointment.appointmentDate, appointment.time || appointment.appointmentTime) && (
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-lg w-[95vw] sm:w-full p-0 mx-2"
                aria-describedby="appointment-details-desc"
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
                    <DialogDescription id="appointment-details-desc">
                        {t('doctor.appointments.detailsDescription', 'Detailed information about the selected appointment.')}
                    </DialogDescription>
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
    const searchParams = useSearchParams();
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
    const [newDialogOpen, setNewDialogOpen] = useState(false);
    const [form, setForm] = useState({
        patientId: '',
        date: '',
        time: '',
        type: 'checkup',
        reason: '',
        notes: '',
        duration: 30,
        location: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { patients, loading: patientsLoading } = useAppSelector((state) => state.doctorPatients);

    useEffect(() => {
        dispatch(fetchDoctorAppointments());
        dispatch(fetchPatients());
    }, [dispatch]);

    useEffect(() => {
        const shouldOpenNewDialog = searchParams.get('new') === 'true';
        if (shouldOpenNewDialog) {
            setNewDialogOpen(true);
            const url = new URL(window.location);
            url.searchParams.delete('new');
            window.history.replaceState({}, '', url);
        }
    }, [searchParams]);

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

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePatientIdSearch = async () => {
        const patient = patients.find((p) => p.patientId === form.patientId);
        if (patient) {
            setForm((prev) => ({ ...prev, patientId: patient._id }));
            await dispatch(fetchPatientById(patient._id));
        } else {
            setFormError('No patient found with that ID');
        }
    };

    const handleNewAppointment = async (e) => {
        e.preventDefault();
        console.log('[Appointment Form] handleNewAppointment called');
        setFormError('');
        setSubmitting(true);
        try {
            if (!form.patientId || !form.date || !form.time || !form.type || !form.reason) {
                setFormError('Please fill all required fields.');
                setSubmitting(false);
                return;
            }
            const appointmentData = {
                patient: form.patientId,
                date: form.date,
                time: form.time,
                type: form.type,
                reason: form.reason,
                notes: form.notes,
                duration: form.duration,
                location: form.location,
                status: 'accepted',
            };
            console.log('[Appointment Form] Submitting:', appointmentData);
            const resultAction = await dispatch(createAppointment(appointmentData));
            if (createAppointment.fulfilled.match(resultAction)) {
                console.log('[Appointment Form] Success:', resultAction.payload);
                setNewDialogOpen(false);
                setForm({ patientId: '', date: '', time: '', type: 'checkup', reason: '', notes: '', duration: 30, location: '' });
                dispatch(fetchDoctorAppointments());
            } else {
                console.error('[Appointment Form] Error:', resultAction.payload || resultAction.error);
                setFormError(resultAction.payload || resultAction.error?.message || 'Failed to create appointment');
            }
        } catch (err) {
            console.error('[Appointment Form] Exception:', err);
            setFormError(err?.message || 'Failed to create appointment');
        } finally {
            setSubmitting(false);
        }
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
            <Card className="mb-4 sm:mb-6 lg:mb-8 rounded-xl shadow-lg">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="w-full lg:w-auto">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t('doctor.appointments.title', 'Appointments')}</h1>
                            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                                {t('doctor.appointments.subtitle', 'Dr.')} {doctorName}
                            </p>
                        </div>
                        <Button variant="default" onClick={() => setNewDialogOpen(true)} className="mt-2 lg:mt-0">+ New Appointment</Button>
                        <div className="w-full lg:w-auto space-y-3 lg:space-y-0 lg:space-x-3 lg:flex lg:items-center">
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

            <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
                <DialogContent className="max-w-lg w-[95vw]" aria-describedby="new-appointment-desc">
                    <DialogHeader>
                        <DialogTitle>New Appointment</DialogTitle>
                        <DialogDescription id="new-appointment-desc">
                            Fill in the details to create a new appointment.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleNewAppointment} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Patient</label>
                            <select
                                name="patientId"
                                value={form.patientId}
                                onChange={handleFormChange}
                                className="w-full border rounded p-2"
                                required
                            >
                                <option key="select" value="">Select patient</option>
                                {patients.map((p) => (
                                    <option key={p.patientId || p._id} value={p._id}>
                                        {p.user ? `${p.user.firstName} ${p.user.lastName}` : `${p.firstName} ${p.lastName}`} ({p.patientId})
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    name="patientId"
                                    placeholder="Or enter patient ID"
                                    value={form.patientId}
                                    onChange={handleFormChange}
                                    className="flex-1 border rounded p-2"
                                />
                                <Button type="button" variant="outline" onClick={handlePatientIdSearch} disabled={!form.patientId || patientsLoading}>
                                    Search
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium">Date</label>
                                <input type="date" name="date" value={form.date} onChange={handleFormChange} className="w-full border rounded p-2" required />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 font-medium">Time</label>
                                <input type="time" name="time" value={form.time} onChange={handleFormChange} className="w-full border rounded p-2" required />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Type</label>
                            <select name="type" value={form.type} onChange={handleFormChange} className="w-full border rounded p-2" required>
                                <option key="checkup" value="checkup">Checkup</option>
                                <option key="consultation" value="consultation">Consultation</option>
                                <option key="follow-up" value="follow-up">Follow-up</option>
                                <option key="emergency" value="emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Reason</label>
                            <input type="text" name="reason" value={form.reason} onChange={handleFormChange} className="w-full border rounded p-2" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Notes</label>
                            <textarea name="notes" value={form.notes} onChange={handleFormChange} className="w-full border rounded p-2" rows={2} />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium">Duration (minutes)</label>
                                <input type="number" name="duration" value={form.duration} onChange={handleFormChange} className="w-full border rounded p-2" min={1} />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 font-medium">Location</label>
                                <input type="text" name="location" value={form.location} onChange={handleFormChange} className="w-full border rounded p-2" />
                            </div>
                        </div>
                        {formError && <div className="text-red-600 text-sm">{formError}</div>}
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="w-full mt-2">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="default" className="w-full" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Appointment'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AppointmentsPage;