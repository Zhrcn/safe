'use client';
import React, { useState, useEffect } from 'react';
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
import { DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, createAppointment } from '@/store/slices/patient/appointmentsSlice';

const AppointmentCard = ({ appointment, onReschedule }) => {
    const getStatusProps = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return { variant: 'secondary', label: 'Scheduled' };
            case 'completed':
                return { variant: 'outline', label: 'Completed' };
            case 'cancelled':
                return { variant: 'destructive', label: 'Cancelled' };
            case 'pending':
                return { variant: 'ghost', label: 'Pending' };
            default:
                return { variant: 'outline', label: status || 'Unknown' };
        }
    };
    const now = new Date();
    const appointmentDate = appointment.date ? new Date(appointment.date) : null;
    const hoursDiff = appointmentDate ? (appointmentDate - now) / (1000 * 60 * 60) : 0;
    const canReschedule = appointmentDate && hoursDiff >= 72;
    // Doctor name for title only
    let doctorName = '';
    if (appointment.doctor && appointment.doctor.user) {
        const { firstName, lastName } = appointment.doctor.user;
        doctorName = `${firstName || ''} ${lastName || ''}`.trim();
    }
    if (!doctorName) doctorName = 'No doctor assigned';
    // Subtitle can show specialty or ID if desired
    let doctorSubtitle = '';
    if (appointment.doctor && appointment.doctor.specialty) {
        doctorSubtitle = `Specialty: ${appointment.doctor.specialty}`;
    } else if (appointment.doctor && appointment.doctor._id) {
        doctorSubtitle = `Doctor ID: ${appointment.doctor._id}`;
    } else {
        doctorSubtitle = 'No doctor assigned';
    }
    const statusProps = getStatusProps(appointment.status);
    return (
        <Card className="hover:shadow-lg transition-shadow border border-border bg-card flex flex-col h-full relative">
            <div className="absolute top-4 right-4">
                <Button variant={statusProps.variant} size="sm" className="rounded-full px-4 py-1 cursor-default" disabled>{statusProps.label}</Button>
            </div>
            <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex-1 space-y-2 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-primary">
                            {doctorName}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{doctorSubtitle}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time || 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>{appointment.type || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.reason || 'No reason provided'}</span>
                    </div>
                    {appointment.notes && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>Notes: {appointment.notes}</span>
                        </div>
                    )}
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
    const { t } = useTranslation('common');
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('new');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAppointments());
    }, [dispatch]);

    const { appointments, loading: isLoading, error } = useSelector(state => state.appointments);

    const filteredAppointments = appointments.filter(appointment => {
        const doctorName = appointment.doctor?.name || appointment.doctor?.firstName + ' ' + appointment.doctor?.lastName || '';
        const matchesSearch = (appointment.title || appointment.consultationType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctorName.toLowerCase().includes(searchQuery.toLowerCase());
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

    const handleSubmitAppointment = async (data) => {
        try {
            await dispatch(createAppointment({
                doctorId: data.doctorId,
                date: '1970-01-01',
                time: 'TBD',
                reason: data.reason,
                type: data.type,
                notes: data.notes,
            })).unwrap();
            setShowModal(false);
            setSelectedAppointment(null);
            dispatch(fetchAppointments());
        } catch (e) {
            console.error('Error creating appointment:', e);
            showNotification(t('patient.appointments.createError', 'Failed to create appointment'), 'error');
        }
    };

    return (
      <div className="flex flex-col space-y-6">
        <PageHeader
          title={t("patient.appointments.title")}
          description={t("patient.appointments.description")}
          breadcrumbs={[
            {
              label: t("patient.dashboard.breadcrumb"),
              href: "/patient/dashboard",
            },
            {
              label: t("patient.appointments.title"),
              href: "/patient/appointments",
            },
          ]}
          actions={
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2 bg-primary text-white rounded-2xl"
                  onClick={handleNewAppointment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("patient.appointments.new")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl w-full">
                <DialogTitle>{modalType === 'reschedule' ? 'Reschedule Appointment' : 'Schedule Appointment'}</DialogTitle>
                <DialogDescription>Fill out the form below to {modalType === 'reschedule' ? 'reschedule' : 'schedule'} your appointment.</DialogDescription>
                <AppointmentForm
                  open={showModal}
                  onClose={handleCloseModal}
                  onSubmit={handleSubmitAppointment}
                  initialData={modalType === "reschedule" ? selectedAppointment : null}
                  isReschedule={modalType === "reschedule"}
                />
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex flex-col md:flex-row gap-4 items-start  md:items-center justify-between">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("patient.appointments.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-2xl"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-card rounded-2xl shadow-sm col-span-full">
            <Calendar className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-3">{t("loading")}</h3>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-card rounded-2xl shadow-sm col-span-full">
            <h3 className="text-xl font-semibold mb-3 text-red-500">{t("error")}</h3>
            <p className="text-muted-foreground mb-6">{error?.data?.message || error?.error || 'Failed to load appointments.'}</p>
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, idx) => (
              <Dialog
                key={appointment.id || appointment._id || idx}
                open={
                  showModal &&
                  selectedAppointment?.id === (appointment.id || appointment._id) &&
                  modalType === "reschedule"
                }
                onOpenChange={setShowModal}
              >
                <AppointmentCard
                  appointment={appointment}
                  onReschedule={handleReschedule}
                />
              </Dialog>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl shadow-sm col-span-full">
              <Calendar className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-3">
                {t("patient.appointments.noAppointments")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? t("patient.appointments.noAppointmentsSearch")
                  : t("patient.appointments.noAppointmentsDefault")}
              </p>
              <Button
                onClick={handleNewAppointment}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("patient.appointments.scheduleNew")}
              </Button>
            </div>
          )}
        </div>
        )}
      </div>
    );
};

export default AppointmentsPage;
