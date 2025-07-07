'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { 
    Calendar, Clock, MapPin, Video, Phone, 
    User, ChevronRight, Plus, Search, Filter,
    Calendar as CalendarIcon, List, Grid, Info, CalendarDays
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
import RescheduleRequestForm from '@/components/appointments/RescheduleRequestForm';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, createAppointment, removeAppointment, editAppointment } from '@/store/slices/patient/appointmentsSlice';
import { requestReschedule } from '@/store/services/patient/appointmentApi';

const AppointmentCard = ({ appointment, onReschedule, onCancel, onRequestReschedule }) => {
    const getStatusProps = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return { 
                    label: 'Scheduled', 
                    className: 'bg-blue-100 text-blue-800 border-blue-200' 
                };
            case 'completed':
                return { 
                    label: 'Completed', 
                    className: 'bg-green-100 text-green-800 border-green-200' 
                };
            case 'cancelled':
                return { 
                    label: 'Cancelled', 
                    className: 'bg-red-100 text-red-800 border-red-200' 
                };
            case 'pending':
                return { 
                    label: 'Pending', 
                    className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                };
            case 'accepted':
                return { 
                    label: 'Accepted', 
                    className: 'bg-green-100 text-green-800 border-green-200' 
                };
            case 'rescheduled':
                return { 
                    label: 'Rescheduled', 
                    className: 'bg-purple-100 text-purple-800 border-purple-200' 
                };
            case 'reschedule_requested':
                return { 
                    label: 'Reschedule Requested', 
                    className: 'bg-orange-100 text-orange-800 border-orange-200' 
                };
            default:
                return { 
                    label: status || 'Unknown', 
                    className: 'bg-gray-100 text-gray-800 border-gray-200' 
                };
        }
    };
    const now = new Date();
    const appointmentDate = appointment.date ? new Date(appointment.date) : null;
    const hoursDiff = appointmentDate ? (appointmentDate - now) / (1000 * 60 * 60) : 0;
    
    // Check if appointment has a valid date (not the placeholder date)
    const hasValidDate = appointmentDate && appointment.date !== "1111-01-01T00:00:00.000Z";
    const canReschedule = hasValidDate && hoursDiff >= 24; // 24 hours minimum notice
    
    // Check if appointment is eligible for reschedule request
    const canRequestReschedule = ['accepted', 'scheduled', 'rescheduled'].includes(appointment.status) && canReschedule;
    
    // For now, allow reschedule requests for all eligible statuses regardless of time
    const canRequestRescheduleTest = ['accepted', 'scheduled', 'rescheduled'].includes(appointment.status);
    
    // Debug logging to see what's happening
    console.log('Appointment debug:', {
      id: appointment._id || appointment.id,
      status: appointment.status,
      date: appointment.date,
      appointmentDate,
      hoursDiff,
      hasValidDate,
      canReschedule,
      canRequestReschedule,
      canRequestRescheduleTest,
      statusIncluded: ['accepted', 'scheduled', 'rescheduled'].includes(appointment.status)
    });
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
          <span
            className={`rounded-full px-4 py-1 text-sm font-medium border cursor-default select-none ${statusProps.className}`}
          >
            {statusProps.label}
          </span>
        </div>
        <CardContent className="p-6 flex flex-col h-full justify-between">
          <div className="flex-1 space-y-2 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">{doctorName}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{
                appointment.date && appointment.date.startsWith('1111-01-01')
                  ? 'TBD'
                  : format(parseISO(appointment.date), 'yyyy-MM-dd')
              }</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{doctorSubtitle}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{appointment.time || "TBD"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{appointment.type || "N/A"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>{appointment.reason || "No reason provided"}</span>
            </div>
            {appointment.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            )}
            {appointment.notes && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Notes: {appointment.notes}</span>
              </div>
            )}
          </div>
          <div className="flex items-end gap-3">
            {appointment.status === "pending" && (
              <Button
                variant="default"
                size="sm"
                className="mt-5 bg-primary text-foreground"
                onClick={() => onReschedule(appointment)}
              >
                Edit
              </Button>
            )}
            {appointment.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment)}
                className="mt-2 border-primary text-primary"
              >
                Cancel
              </Button>
            )}
            {canRequestRescheduleTest && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRequestReschedule(appointment)}
                className="mt-2 border-primary text-primary hover:bg-orange-50"
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Request Reschedule
              </Button>
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
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
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

    const handleRequestReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setShowRescheduleModal(true);
    };

    const handleCloseRescheduleModal = () => {
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
    };

    const handleSubmitRescheduleRequest = async (rescheduleData) => {
        if (!selectedAppointment) return;
        
        setRescheduleLoading(true);
        try {
            await requestReschedule(selectedAppointment._id || selectedAppointment.id, rescheduleData);
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
            dispatch(fetchAppointments()); // Refresh appointments
        } catch (error) {
            console.error('Error submitting reschedule request:', error);
            // You might want to show a notification here
        } finally {
            setRescheduleLoading(false);
        }
    };

    const timeSlotToTime = {
        morning: '09:00',
        afternoon: '14:00',
        evening: '18:00'
    };

    const handleSubmitAppointment = async (data) => {
        // Prefer data.time, else map from data.timeSlot, else fallback
        const time = data.time || timeSlotToTime[data.timeSlot] || data.timeSlot || '09:00';
        try {
            if (modalType === 'reschedule' && selectedAppointment) {
                await dispatch(editAppointment({
                    id: selectedAppointment.id || selectedAppointment._id,
                    appointmentData: {
                        date: data.date,
                        time,
                        type: data.type,
                        reason: data.reason,
                        notes: data.notes,
                    }
                })).unwrap();
            } else {
                await dispatch(createAppointment({
                    doctorId: data.doctorId,
                    date: data.date,
                    time,
                    reason: data.reason,
                    type: data.type,
                    notes: data.notes,
                })).unwrap();
            }
            setShowModal(false);
            setSelectedAppointment(null);
            dispatch(fetchAppointments());
        } catch (e) {
            console.error('Error submitting appointment:', e);
            // Optionally show notification
        }
    };

    const handleCancel = async (appointment) => {
        try {
            await dispatch(removeAppointment(appointment.id || appointment._id)).unwrap();
            dispatch(fetchAppointments());
        } catch (e) {
            console.error('Error cancelling appointment:', e);
            // Optionally show notification
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
              <AppointmentCard
                key={appointment.id || appointment._id || idx}
                appointment={appointment}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onRequestReschedule={handleRequestReschedule}
              />
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

        {/* Reschedule Request Modal */}
        {showRescheduleModal && selectedAppointment && (
          <RescheduleRequestForm
            appointment={selectedAppointment}
            onSubmit={handleSubmitRescheduleRequest}
            onCancel={handleCloseRescheduleModal}
            isLoading={rescheduleLoading}
          />
        )}
      </div>
    );
  };

export default AppointmentsPage;
