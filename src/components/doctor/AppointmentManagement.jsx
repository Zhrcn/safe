'use client';
import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    FileText,
    Check,
    X,
    Edit,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Plus,
    Video,
    Phone,
    Building,
    Search,
    Filter,
    ArrowUpDown,
} from 'lucide-react';
import { format, parseISO, addHours, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { useNotification } from '@/components/ui/Notification';
import { appointments as mockAppointments } from '@/mockdata/appointments';
import { useDispatch, useSelector } from 'react-redux';
import {
    acceptAppointment,
    rejectAppointment,
    updateAppointment,
    getAppointmentDetails,
    clearError,
    clearSuccess
} from '../../store/slices/doctor/doctorAppointmentsSlice';
import { Textarea } from '../ui/Textarea';

const appointmentTypes = [
    'Annual Physical',
    'Follow-up',
    'New Consultation',
    'Vaccination',
    'Check-up',
    'Specialist Referral',
    'Urgent Care',
    'Prescription Renewal'
];

function AppointmentCard({ appointment, onView, onEdit, onAccept, onReject }) {
    const appointmentDate = appointment.date ? new Date(`${appointment.date}T${appointment.time || '00:00'}`) : null;
    const now = new Date();
    const hoursDifference = appointmentDate ? (appointmentDate - now) / (1000 * 60 * 60) : 0;
    const canEdit = hoursDifference >= 24;
    const isPending = appointment.status === 'pending';
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
            case 'confirmed':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };
    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
            case 'confirmed':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'pending':
                return <AlertCircle className="h-4 w-4" />;
            case 'cancelled':
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };
    const getAppointmentTypeIcon = (type) => {
        switch (type) {
            case 'video':
                return <Video className="h-4 w-4" />;
            case 'phone':
                return <Phone className="h-4 w-4" />;
            case 'in-person':
                return <Building className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };
    return (
        <Card className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} />
                            <AvatarFallback>
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.patient.name}</h3>
                            <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                        <div className="flex items-center gap-1">
                            {getStatusIcon(appointment.status)}
                            <span className="text-sm font-medium">{appointment.status}</span>
                        </div>
                    </Badge>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                            {format(new Date(appointment.date), 'MMMM d, yyyy')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getAppointmentTypeIcon(appointment.type)}
                        <span className="text-sm text-gray-700">{appointment.type}</span>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    {isPending ? (
                        <>
                            <Button
                                onClick={() => onAccept(appointment)}
                                variant="default"
                                size="sm"
                                className="mr-2"
                            >
                                Accept
                            </Button>
                            <Button
                                onClick={() => onReject(appointment)}
                                variant="danger"
                                size="sm"
                                className="mr-2"
                            >
                                Decline
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onView(appointment)}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                            {canEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(appointment)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AppointmentManagement() {
    const { showNotification } = useNotification();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date(),
        time: '',
        type: 'in-person',
        status: 'scheduled',
        notes: '',
        patientId: '',
        duration: 30
    });
    const dispatch = useDispatch();
    const { loading: reduxLoading, error, success } = useSelector((state) => state.doctorAppointments);
    const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    
    const [acceptForm, setAcceptForm] = useState({
        date: '',
        time: '',
        location: '',
        doctorNotes: ''
    });
    const [rejectForm, setRejectForm] = useState({
        doctorNotes: ''
    });
    const [updateForm, setUpdateForm] = useState({
        date: '',
        time: '',
        location: '',
        doctorNotes: '',
        patientNotes: '',
        reason: '',
        type: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setAppointments(mockAppointments);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (selectedAppointment) {
            setUpdateForm({
                date: selectedAppointment.date ? new Date(selectedAppointment.date).toISOString().split('T')[0] : '',
                time: selectedAppointment.time || '',
                location: selectedAppointment.location || '',
                doctorNotes: selectedAppointment.doctorNotes || '',
                patientNotes: selectedAppointment.patientNotes || '',
                reason: selectedAppointment.reason || '',
                type: selectedAppointment.type || ''
            });
        }
    }, [selectedAppointment]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(clearSuccess());
            }, 3000);
        }
    }, [success, dispatch]);

    const handleTabChange = (value) => {
        setActiveTab(value);
    };
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleOpenDialog = (appointment = null) => {
        if (appointment) {
            setSelectedAppointment(appointment);
            setFormData({
                date: new Date(appointment.date),
                time: appointment.time,
                type: appointment.type,
                status: appointment.status,
                notes: appointment.notes,
                patientId: appointment.patient.id,
                duration: appointment.duration
            });
        } else {
            setSelectedAppointment(null);
            setFormData({
                date: new Date(),
                time: '',
                type: 'in-person',
                status: 'scheduled',
                notes: '',
                patientId: '',
                duration: 30
            });
        }
        setIsDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedAppointment(null);
        setFormData({
            date: new Date(),
            time: '',
            type: 'in-person',
            status: 'scheduled',
            notes: '',
            patientId: '',
            duration: 30
        });
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (selectedAppointment) {
                setAppointments(prev => prev.map(apt => 
                    apt.id === selectedAppointment.id ? { ...apt, ...formData } : apt
                ));
                showNotification('Appointment updated successfully', 'success');
            } else {
                const newAppointment = {
                    id: Date.now().toString(),
                    ...formData,
                    patient: {
                        id: formData.patientId,
                        name: 'John Doe', 
                        avatar: '/images/default-avatar.png'
                    }
                };
                setAppointments(prev => [...prev, newAppointment]);
                showNotification('Appointment created successfully', 'success');
            }
            handleCloseDialog();
        } catch (error) {
            showNotification(error.message || 'Failed to save appointment', 'error');
        }
    };
    const handleAccept = async () => {
        const appointmentData = {};
        if (acceptForm.date) appointmentData.date = acceptForm.date;
        if (acceptForm.time) appointmentData.time = acceptForm.time;
        if (acceptForm.location) appointmentData.location = acceptForm.location;
        if (acceptForm.doctorNotes) appointmentData.doctorNotes = acceptForm.doctorNotes;

        await dispatch(acceptAppointment({ appointmentId: selectedAppointment._id, appointmentData }));
        setIsAcceptDialogOpen(false);
        setAcceptForm({ date: '', time: '', location: '', doctorNotes: '' });
    };
    const handleReject = async () => {
        await dispatch(rejectAppointment({ 
            appointmentId: selectedAppointment._id, 
            doctorNotes: rejectForm.doctorNotes 
        }));
        setIsRejectDialogOpen(false);
        setRejectForm({ doctorNotes: '' });
    };
    const handleUpdate = async () => {
        const appointmentData = {};
        if (updateForm.date) appointmentData.date = updateForm.date;
        if (updateForm.time) appointmentData.time = updateForm.time;
        if (updateForm.location) appointmentData.location = updateForm.location;
        if (updateForm.doctorNotes !== undefined) appointmentData.doctorNotes = updateForm.doctorNotes;
        if (updateForm.patientNotes !== undefined) appointmentData.patientNotes = updateForm.patientNotes;
        if (updateForm.reason) appointmentData.reason = updateForm.reason;
        if (updateForm.type) appointmentData.type = updateForm.type;

        await dispatch(updateAppointment({ appointmentId: selectedAppointment._id, appointmentData }));
        setIsUpdateDialogOpen(false);
    };
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || appointment.status === activeTab;
        return matchesSearch && matchesTab;
    });
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="upcoming"><span>Upcoming</span></TabsTrigger>
                        <TabsTrigger value="pending"><span>Pending</span></TabsTrigger>
                        <TabsTrigger value="completed"><span>Completed</span></TabsTrigger>
                        <TabsTrigger value="all"><span>All</span></TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Appointment
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map(appointment => (
                    <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onView={handleOpenDialog}
                        onEdit={handleOpenDialog}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                ))}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={format(formData.date, 'yyyy-MM-dd')}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger>
                                    <span>
                                        {/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in-person">In Person</SelectItem>
                                    <SelectItem value="video">Video Call</SelectItem>
                                    <SelectItem value="phone">Phone Call</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleFormChange}
                                className="w-full min-h-[100px] p-2 border rounded-md"
                                placeholder="Add any additional notes..."
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {selectedAppointment ? 'Update' : 'Create'} Appointment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {error && (
                <Alert variant="danger">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {success && (
                <Alert>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {selectedAppointment?.status === 'pending' && (
                <>
                    <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" disabled={reduxLoading || !selectedAppointment?.canBeModified}>
                                Accept Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Accept Appointment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="accept-date">Date</Label>
                                    <Input
                                        id="accept-date"
                                        type="date"
                                        value={acceptForm.date}
                                        onChange={(e) => setAcceptForm({ ...acceptForm, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="accept-time">Time</Label>
                                    <Input
                                        id="accept-time"
                                        type="time"
                                        value={acceptForm.time}
                                        onChange={(e) => setAcceptForm({ ...acceptForm, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="accept-location">Location</Label>
                                    <Input
                                        id="accept-location"
                                        value={acceptForm.location}
                                        onChange={(e) => setAcceptForm({ ...acceptForm, location: e.target.value })}
                                        placeholder="Enter location"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="accept-notes">Doctor Notes</Label>
                                    <Textarea
                                        id="accept-notes"
                                        value={acceptForm.doctorNotes}
                                        onChange={(e) => setAcceptForm({ ...acceptForm, doctorNotes: e.target.value })}
                                        placeholder="Add notes for the patient"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAccept} disabled={reduxLoading}>
                                        Accept
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="danger" disabled={reduxLoading || !selectedAppointment?.canBeModified}>
                                Reject Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject Appointment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="reject-notes">Reason for Rejection</Label>
                                    <Textarea
                                        id="reject-notes"
                                        value={rejectForm.doctorNotes}
                                        onChange={(e) => setRejectForm({ doctorNotes: e.target.value })}
                                        placeholder="Provide a reason for rejecting this appointment"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={handleReject} disabled={reduxLoading}>
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            )}

            {selectedAppointment?.status !== 'rejected' && selectedAppointment?.status !== 'completed' && (
                <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" disabled={reduxLoading || !selectedAppointment?.canBeModified}>
                            Update Appointment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Update Appointment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="update-date">Date</Label>
                                    <Input
                                        id="update-date"
                                        type="date"
                                        value={updateForm.date}
                                        onChange={(e) => setUpdateForm({ ...updateForm, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="update-time">Time</Label>
                                    <Input
                                        id="update-time"
                                        type="time"
                                        value={updateForm.time}
                                        onChange={(e) => setUpdateForm({ ...updateForm, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="update-location">Location</Label>
                                <Input
                                    id="update-location"
                                    value={updateForm.location}
                                    onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                                    placeholder="Enter location"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="update-type">Type</Label>
                                    <Select value={updateForm.type} onValueChange={(value) => setUpdateForm({ ...updateForm, type: value })}>
                                        <SelectTrigger>
                                            <span>
                                                {/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}
                                            </span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="checkup">Checkup</SelectItem>
                                            <SelectItem value="consultation">Consultation</SelectItem>
                                            <SelectItem value="follow-up">Follow-up</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="update-reason">Reason</Label>
                                    <Input
                                        id="update-reason"
                                        value={updateForm.reason}
                                        onChange={(e) => setUpdateForm({ ...updateForm, reason: e.target.value })}
                                        placeholder="Enter reason"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="update-doctor-notes">Doctor Notes</Label>
                                <Textarea
                                    id="update-doctor-notes"
                                    value={updateForm.doctorNotes}
                                    onChange={(e) => setUpdateForm({ ...updateForm, doctorNotes: e.target.value })}
                                    placeholder="Add notes for the patient"
                                />
                            </div>
                            <div>
                                <Label htmlFor="update-patient-notes">Patient Notes</Label>
                                <Textarea
                                    id="update-patient-notes"
                                    value={updateForm.patientNotes}
                                    onChange={(e) => setUpdateForm({ ...updateForm, patientNotes: e.target.value })}
                                    placeholder="Add notes for the patient"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdate} disabled={reduxLoading}>
                                    Update
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {!selectedAppointment?.canBeModified && (
                <div className="text-sm text-red-600">
                    Cannot modify appointment within 24 hours of scheduled time
                </div>
            )}
        </div>
    );
} 