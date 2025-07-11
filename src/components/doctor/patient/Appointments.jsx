import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Plus,
    Edit,
    Video,
    Phone,
    CalendarDays,
    AlertCircle,
    Check,
    X
} from 'lucide-react';
import { fetchAppointmentsByPatient, createAppointment, updateAppointment } from '../../../store/slices/doctor/doctorAppointmentsSlice';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
const Appointments = ({ patientId }) => {
    const dispatch = useDispatch();
    const { appointments, loading } = useSelector((state) => state.doctorAppointments);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date(),
        type: 'in-person',
        status: 'scheduled',
        notes: '',
        duration: 30
    });
    useEffect(() => {
        dispatch(fetchAppointmentsByPatient(patientId));
    }, [dispatch, patientId]);
    const handleOpenDialog = (appointment = null) => {
        if (appointment) {
            setSelectedAppointment(appointment);
            setFormData({
                date: new Date(appointment.date),
                type: appointment.type,
                status: appointment.status,
                notes: appointment.notes,
                duration: appointment.duration
            });
        } else {
            setSelectedAppointment(null);
            setFormData({
                date: new Date(),
                type: 'in-person',
                status: 'scheduled',
                notes: '',
                duration: 30
            });
        }
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAppointment(null);
        setFormData({
            date: new Date(),
            type: 'in-person',
            status: 'scheduled',
            notes: '',
            duration: 30
        });
    };
    const handleSubmit = () => {
        const appointmentData = {
            ...formData,
            patientId,
            date: formData.date.toISOString()
        };
        if (selectedAppointment) {
            dispatch(updateAppointment({
                id: selectedAppointment.id,
                ...appointmentData
            }));
        } else {
            dispatch(createAppointment(appointmentData));
        }
        handleCloseDialog();
    };
    const handleStartCall = (appointment) => {
        console.log('Starting call for appointment:', appointment);
    };
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const getStatusColorClass = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case 'video':
                return <Video className="h-4 w-4 mr-1" />;
            case 'phone':
                return <Phone className="h-4 w-4 mr-1" />;
            default:
                return <CalendarDays className="h-4 w-4 mr-1" />;
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Loading appointments...</p>
            </div>
        );
    }
    return (
        <div className="p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
                <Button
                    className="flex items-center space-x-2"
                    onClick={() => handleOpenDialog()}
                >
                    <Plus className="h-5 w-5" />
                    <span>New Appointment</span>
                </Button>
            </div>
            <div className="divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                    <div key={appointment.id} className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-lg font-medium text-gray-900">
                                    {formatDate(appointment.date)}
                                </p>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center">
                                        {getTypeIcon(appointment.type)}
                                        {appointment.type}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {`${appointment.duration} min`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenDialog(appointment)}
                                >
                                    <Edit className="h-5 w-5" />
                                </Button>
                                {(appointment.type === 'video' || appointment.type === 'phone') && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleStartCall(appointment)}
                                    >
                                        {appointment.type === 'video' ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                                    </Button>
                                )}
                            </div>
                        </div>
                        {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                                {appointment.notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
                        </DialogTitle>
                    </DialogHeader>
                    <form className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date and Time</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={new Date(formData.date).toISOString().slice(0, 16)}
                                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <span>
                                        {/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in-person">In-person</SelectItem>
                                    <SelectItem value="video">Video Call</SelectItem>
                                    <SelectItem value="phone">Phone Call</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <span>
                                        {/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="in-progress">In-Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                rows="3"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" size="sm" onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="default" size="sm" onClick={handleSubmit}>{selectedAppointment ? 'Update' : 'Create'} Appointment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default Appointments; 