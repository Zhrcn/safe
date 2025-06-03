'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Tabs,
    Tab,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, parseISO, addHours, isAfter } from 'date-fns';
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
    Plus
} from 'lucide-react';
import { getAppointments, manageAppointment, updateAppointmentStatus, acceptAppointment, rejectAppointment, updateAppointment } from '@/services/doctorService';

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
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card className="shadow-sm border border-border bg-card text-card-foreground transition-colors duration-200 hover:shadow-md">
            <CardContent>
                <Box className="flex items-center mb-3">
                    <User size={20} className="mr-2 text-primary" />
                    <Typography variant="h6" component="div" className="font-semibold text-foreground">
                        {appointment.patientName}
                    </Typography>
                    <Chip
                        label={appointment.status}
                        size="small"
                        color={getStatusColor(appointment.status)}
                        className="ml-auto"
                    />
                </Box>
                <Box className="space-y-2 text-muted-foreground">
                    {isPending ? (
                        <Typography variant="body2" className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Awaiting scheduling
                        </Typography>
                    ) : (
                        <Typography variant="body2" className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {appointment.date || 'No date set'}
                        </Typography>
                    )}
                    {isPending ? (
                        <Typography variant="body2" className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            Preferred: {appointment.preferredTimeSlot || 'Any time'}
                        </Typography>
                    ) : (
                        <Typography variant="body2" className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            {appointment.time || 'No time set'}
                        </Typography>
                    )}
                    <Typography variant="body2" className="flex items-center">
                        <FileText size={16} className="mr-2" />
                        {appointment.reason || appointment.type || 'General checkup'}
                    </Typography>
                </Box>
                <Box className="mt-4 flex justify-end gap-2">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onView(appointment)}
                        className="text-primary border-primary hover:bg-primary/10"
                    >
                        View
                    </Button>

                    {isPending && (
                        <>
                            <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                onClick={() => onAccept(appointment)}
                                startIcon={<Check size={16} />}
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                Accept
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => onReject(appointment)}
                                startIcon={<X size={16} />}
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Reject
                            </Button>
                        </>
                    )}

                    {!isPending && canEdit && appointment.status !== 'cancelled' && (
                        <Tooltip title="Edit Appointment">
                            <IconButton
                                size="small"
                                onClick={() => onEdit(appointment)}
                                className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <Edit size={16} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {!isPending && !canEdit && appointment.status !== 'cancelled' && (
                        <Tooltip title="Cannot edit appointments within 24 hours">
                            <span>
                                <IconButton
                                    size="small"
                                    disabled
                                    className="text-gray-400"
                                >
                                    <AlertCircle size={16} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

function AppointmentDetailDialog({ open, appointment, onClose }) {
    if (!appointment) return null;

    const isPending = appointment.status === 'pending';

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                Appointment Details
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box className="flex items-center mb-4">
                            <User size={24} className="mr-3 text-primary" />
                            <Typography variant="h6" className="text-foreground">
                                {appointment.patientName}
                            </Typography>
                            <Chip
                                label={appointment.status}
                                size="small"
                                color={
                                    appointment.status === 'scheduled' || appointment.status === 'confirmed' ? 'success' :
                                        appointment.status === 'pending' ? 'warning' : 'error'
                                }
                                className="ml-auto"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-muted-foreground">Date</Typography>
                        <Typography variant="body1" className="text-foreground flex items-center">
                            <Calendar size={16} className="mr-2 text-primary" />
                            {isPending ? 'Awaiting scheduling' : (appointment.date || 'Not set')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-muted-foreground">
                            {isPending ? 'Preferred Time' : 'Time'}
                        </Typography>
                        <Typography variant="body1" className="text-foreground flex items-center">
                            <Clock size={16} className="mr-2 text-primary" />
                            {isPending ?
                                (appointment.preferredTimeSlot || 'Any time') :
                                (appointment.time || 'Not set')
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" className="text-muted-foreground">Reason</Typography>
                        <Typography variant="body1" className="text-foreground">
                            {appointment.reason || appointment.type || 'General checkup'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" className="text-muted-foreground">Notes</Typography>
                        <Paper elevation={0} className="p-3 bg-muted/30 rounded-md">
                            <Typography variant="body1" className="text-foreground">
                                {appointment.notes || 'No notes provided'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted/50"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function EditAppointmentDialog({ open, appointment, onClose, onSave }) {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [type, setType] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (appointment) {
            try {
                const dateObj = appointment.date ? parseISO(appointment.date) : null;
                setDate(dateObj);
                setTime(dateObj);
                setType(appointment.type || '');
                setNotes(appointment.notes || '');
            } catch (err) {
                console.error('Error parsing date:', err);
            }
        }
    }, [appointment]);

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            setError('');

            if (!date || !time || !type) {
                setError('Please fill all required fields');
                return;
            }

            const formattedDate = format(date, 'yyyy-MM-dd');
            const formattedTime = format(time, 'h:mm a');

            const appointmentDate = new Date(`${formattedDate}T${formattedTime}`);
            const now = new Date();
            const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);

            if (hoursDifference < 24) {
                setError('Appointments can only be edited at least 24 hours in advance');
                return;
            }

            const updatedAppointment = {
                ...appointment,
                date: formattedDate,
                time: formattedTime,
                type,
                notes
            };

            const result = await manageAppointment(updatedAppointment);

            if (result.success) {
                if (onSave) onSave(result.appointment);
                onClose();
            } else {
                setError(result.message || 'Failed to update appointment');
            }
        } catch (err) {
            setError('An error occurred while updating the appointment');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                Edit Appointment
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={setDate}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    className: "bg-background",
                                    InputProps: {
                                        className: "text-foreground"
                                    },
                                    InputLabelProps: {
                                        className: "text-muted-foreground"
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            label="Time"
                            value={time}
                            onChange={setTime}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    className: "bg-background",
                                    InputProps: {
                                        className: "text-foreground"
                                    },
                                    InputLabelProps: {
                                        className: "text-muted-foreground"
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className="text-muted-foreground">Appointment Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                label="Appointment Type"
                                className="text-foreground bg-background"
                            >
                                {appointmentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                            className="bg-background"
                            InputProps={{
                                className: "text-foreground"
                            }}
                            InputLabelProps={{
                                className: "text-muted-foreground"
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:bg-muted/50"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function ConfirmationDialog({ open, type, onClose, onConfirm, isSubmitting }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                {type === 'accept' ? 'Accept Appointment' : 'Reject Appointment'}
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                <Typography variant="body1" className="text-foreground">
                    {type === 'accept'
                        ? 'Are you sure you want to accept this appointment? You will need to set a date and time.'
                        : 'Are you sure you want to reject this appointment?'}
                </Typography>
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted/50"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color={type === 'accept' ? 'success' : 'error'}
                    variant="contained"
                    className={type === 'accept'
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : type === 'accept' ? 'Accept' : 'Reject'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function AcceptAppointmentDialog({ open, appointment, onClose, onAccept, isSubmitting }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && appointment) {
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDate(format(tomorrow, 'yyyy-MM-dd'));

            // Set default time based on preferred time slot if available
            if (appointment.preferredTimeSlot) {
                switch (appointment.preferredTimeSlot) {
                    case 'morning':
                        setTime('09:00');
                        break;
                    case 'afternoon':
                        setTime('13:00');
                        break;
                    case 'evening':
                        setTime('18:00');
                        break;
                    default:
                        setTime('09:00');
                }
            } else {
                setTime('09:00');
            }

            setNotes('');
            setError('');
        }
    }, [open, appointment]);

    const handleAccept = () => {
        if (!date) {
            setError('Please select a date');
            return;
        }

        if (!time) {
            setError('Please select a time');
            return;
        }

        onAccept({
            date,
            time,
            notes
        });
    };

    if (!appointment) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                Accept Appointment Request
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Box className="mb-4">
                    <Typography variant="subtitle1" className="font-medium">
                        Patient Information
                    </Typography>
                    <Typography variant="body1">
                        {appointment.patientName || 'Patient'}
                    </Typography>
                    <Typography variant="body2" className="text-muted-foreground">
                        Reason: {appointment.reason || 'General checkup'}
                    </Typography>
                    {appointment.preferredTimeSlot && (
                        <Typography variant="body2" className="text-muted-foreground">
                            Preferred time: {appointment.preferredTimeSlot}
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes (Optional)"
                            multiline
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes for the patient"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted/50"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAccept}
                    color="success"
                    variant="contained"
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Accept Appointment'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function CreateAppointmentDialog({ open, onClose, onSave }) {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [type, setType] = useState('');
    const [notes, setNotes] = useState('');
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            setError('');

            if (!date || !time || !type || !patientId) {
                setError('Please fill all required fields');
                return;
            }

            const formattedDate = format(date, 'yyyy-MM-dd');
            const formattedTime = format(time, 'h:mm a');

            const newAppointment = {
                id: `app-${Date.now()}`,
                patientId,
                patientName: patientName || `Patient #${patientId}`,
                date: formattedDate,
                time: formattedTime,
                type,
                notes,
                status: 'Pending'
            };

            const result = await manageAppointment(newAppointment);

            if (result.success) {
                if (onSave) onSave(result.appointment || newAppointment);
                handleReset();
                onClose();
            } else {
                setError(result.message || 'Failed to create appointment');
            }
        } catch (err) {
            setError('An error occurred while creating the appointment');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setDate(null);
        setTime(null);
        setType('');
        setNotes('');
        setPatientId('');
        setPatientName('');
        setError('');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                Create New Appointment
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Patient ID"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            fullWidth
                            variant="outlined"
                            required
                            className="bg-background"
                            InputProps={{
                                className: "text-foreground"
                            }}
                            InputLabelProps={{
                                className: "text-muted-foreground"
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Patient Name (Optional)"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            className="bg-background"
                            InputProps={{
                                className: "text-foreground"
                            }}
                            InputLabelProps={{
                                className: "text-muted-foreground"
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={setDate}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    className: "bg-background",
                                    InputProps: {
                                        className: "text-foreground"
                                    },
                                    InputLabelProps: {
                                        className: "text-muted-foreground"
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            label="Time"
                            value={time}
                            onChange={setTime}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    className: "bg-background",
                                    InputProps: {
                                        className: "text-foreground"
                                    },
                                    InputLabelProps: {
                                        className: "text-muted-foreground"
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className="text-muted-foreground">Appointment Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                label="Appointment Type"
                                className="text-foreground bg-background"
                            >
                                {appointmentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                            className="bg-background"
                            InputProps={{
                                className: "text-foreground"
                            }}
                            InputLabelProps={{
                                className: "text-muted-foreground"
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:bg-muted/50"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? 'Creating...' : 'Create Appointment'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function AppointmentManagement() {
    const [activeTab, setActiveTab] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmationType, setConfirmationType] = useState('');
    const [confirmationId, setConfirmationId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getAppointments();
            console.log('Loaded appointments:', data);

            // Transform the data if needed to match the expected format
            const formattedAppointments = Array.isArray(data) ? data.map(appointment => {
                return {
                    id: appointment._id || appointment.id,
                    patientId: appointment.patientId?._id || appointment.patientId,
                    patientName: appointment.patientId?.name || 'Patient',
                    date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
                    time: appointment.time || '',
                    type: appointment.reason || 'General Checkup',
                    notes: appointment.notes || '',
                    status: appointment.status || 'Pending',
                    preferredTimeSlot: appointment.preferredTimeSlot || appointment.time_slot || 'any',
                    reason: appointment.reason || ''
                };
            }) : [];

            setAppointments(formattedAppointments);
        } catch (err) {
            setError('Failed to load appointments: ' + (err.message || 'Unknown error'));
            console.error('Error loading appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const allCount = Array.isArray(appointments) ? appointments.length : 0;
    const pendingCount = Array.isArray(appointments) ? appointments.filter(a => a.status === 'pending').length : 0;
    const confirmedCount = Array.isArray(appointments) ? appointments.filter(a => a.status === 'scheduled').length : 0;
    const rejectedCount = Array.isArray(appointments) ? appointments.filter(a => a.status === 'cancelled').length : 0;

    const filteredAppointments = Array.isArray(appointments) ? appointments.filter(appointment => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return appointment.status === 'pending';
        if (activeTab === 'confirmed') return appointment.status === 'scheduled';
        if (activeTab === 'rejected') return appointment.status === 'cancelled';
        return true;
    }) : [];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setDetailDialogOpen(true);
    };

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setEditDialogOpen(true);
    };

    const handleAcceptAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setAcceptDialogOpen(true);
    };

    const handleRejectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setRejectReason('');
        setRejectDialogOpen(true);
    };

    const handleConfirmAccept = async (appointmentData) => {
        if (!selectedAppointment) return;

        try {
            setIsSubmitting(true);
            setError('');

            const result = await acceptAppointment(selectedAppointment.id, appointmentData);

            // Update the appointment in the local state
            const updatedAppointments = appointments.map(appointment =>
                appointment.id === selectedAppointment.id
                    ? {
                        ...appointment,
                        status: 'scheduled',
                        date: appointmentData.date,
                        time: appointmentData.time,
                        notes: appointmentData.notes || selectedAppointment.notes
                    }
                    : appointment
            );

            setAppointments(updatedAppointments);
            setSuccessMessage('Appointment accepted successfully');

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            // Refresh appointments to get the latest data
            loadAppointments();
        } catch (err) {
            setError('Failed to accept appointment: ' + (err.message || 'Unknown error'));
            console.error('Error accepting appointment:', err);
        } finally {
            setIsSubmitting(false);
            setAcceptDialogOpen(false);
        }
    };

    const handleConfirmReject = async () => {
        if (!selectedAppointment) return;

        try {
            setIsSubmitting(true);
            setError('');

            const result = await rejectAppointment(selectedAppointment.id, rejectReason);

            // Update the appointment in the local state
            const updatedAppointments = appointments.map(appointment =>
                appointment.id === selectedAppointment.id
                    ? {
                        ...appointment,
                        status: 'cancelled',
                        notes: rejectReason || selectedAppointment.notes
                    }
                    : appointment
            );

            setAppointments(updatedAppointments);
            setSuccessMessage('Appointment rejected successfully');

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            // Refresh appointments to get the latest data
            loadAppointments();
        } catch (err) {
            setError('Failed to reject appointment: ' + (err.message || 'Unknown error'));
            console.error('Error rejecting appointment:', err);
        } finally {
            setIsSubmitting(false);
            setRejectDialogOpen(false);
        }
    };

    const handleSaveAppointment = async (updatedAppointment) => {
        try {
            setIsSubmitting(true);
            setError('');

            const result = await updateAppointment(updatedAppointment.id, updatedAppointment);

            // Update the appointment in the local state
            const updatedAppointments = appointments.map(appointment =>
                appointment.id === updatedAppointment.id
                    ? updatedAppointment
                    : appointment
            );

            setAppointments(updatedAppointments);
            setSuccessMessage('Appointment updated successfully');

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            // Refresh appointments to get the latest data
            loadAppointments();
        } catch (err) {
            setError('Failed to update appointment: ' + (err.message || 'Unknown error'));
            console.error('Error updating appointment:', err);
        } finally {
            setIsSubmitting(false);
            setEditDialogOpen(false);
        }
    };

    return (
        <Box>
            <Paper className="p-6 bg-card border border-border rounded-lg mb-6">
                <Typography variant="h5" component="h1" className="font-bold text-foreground mb-6">
                    Appointment Management
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" className="mb-4" onClose={() => setSuccessMessage('')}>
                        {successMessage}
                    </Alert>
                )}

                <Box className="mb-4">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={loadAppointments}
                        className="text-primary border-primary hover:bg-primary/10"
                    >
                        Refresh Appointments
                    </Button>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    className="mb-6"
                    TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
                >
                    <Tab
                        label={`All (${allCount})`}
                        value="all"
                    />
                    <Tab
                        label={`Pending (${pendingCount})`}
                        value="pending"
                    />
                    <Tab
                        label={`Confirmed (${confirmedCount})`}
                        value="confirmed"
                    />
                    <Tab
                        label={`Rejected (${rejectedCount})`}
                        value="rejected"
                    />
                </Tabs>

                {loading ? (
                    <Typography className="text-muted-foreground text-center py-8">
                        Loading appointments...
                    </Typography>
                ) : filteredAppointments.length === 0 ? (
                    <Typography className="text-muted-foreground text-center py-8">
                        No appointments found
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredAppointments.map(appointment => (
                            <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                                <AppointmentCard
                                    appointment={appointment}
                                    onView={handleViewAppointment}
                                    onEdit={handleEditAppointment}
                                    onAccept={() => handleAcceptAppointment(appointment)}
                                    onReject={() => handleRejectAppointment(appointment)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            <AppointmentDetailDialog
                open={detailDialogOpen}
                appointment={selectedAppointment}
                onClose={() => setDetailDialogOpen(false)}
            />

            <EditAppointmentDialog
                open={editDialogOpen}
                appointment={selectedAppointment}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSaveAppointment}
            />

            <AcceptAppointmentDialog
                open={acceptDialogOpen}
                appointment={selectedAppointment}
                onClose={() => setAcceptDialogOpen(false)}
                onAccept={handleConfirmAccept}
                isSubmitting={isSubmitting}
            />

            <Dialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    className: "bg-card"
                }}
            >
                <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                    Reject Appointment Request
                </DialogTitle>
                <DialogContent className="bg-card mt-4">
                    <Typography variant="body1" className="text-foreground mb-4">
                        Are you sure you want to reject this appointment request?
                    </Typography>
                    <TextField
                        fullWidth
                        label="Reason for Rejection (Optional)"
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide a reason for rejecting this appointment"
                    />
                </DialogContent>
                <DialogActions className="bg-card border-t border-border p-3">
                    <Button
                        onClick={() => setRejectDialogOpen(false)}
                        className="text-muted-foreground hover:bg-muted/50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmReject}
                        color="error"
                        variant="contained"
                        className="bg-red-600 text-white hover:bg-red-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Reject Appointment'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Box className="fixed bottom-6 right-6 z-10">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={20} />}
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 w-14 p-4 shadow-lg"
                    sx={{ minWidth: 0 }}
                >
                    <span className="sr-only">Add New Appointment</span>
                </Button>
            </Box>

            <CreateAppointmentDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSave={(newAppointment) => {
                    setAppointments([newAppointment, ...appointments]);
                    setSuccessMessage('Appointment created successfully');
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 3000);
                }}
            />
        </Box>
    );
} 