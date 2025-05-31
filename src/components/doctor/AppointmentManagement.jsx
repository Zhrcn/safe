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
import { getAppointments, manageAppointment, updateAppointmentStatus } from '@/services/doctorService';

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
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
    const canEdit = hoursDifference >= 24;
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'Confirmed':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Rejected':
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
                    <Typography variant="body2" className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {appointment.date}
                    </Typography>
                    <Typography variant="body2" className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        {appointment.time}
                    </Typography>
                    <Typography variant="body2" className="flex items-center">
                        <FileText size={16} className="mr-2" />
                        {appointment.type}
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
                    
                    {appointment.status === 'Pending' && (
                        <>
                            <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                onClick={() => onAccept(appointment.id)}
                                startIcon={<Check size={16} />}
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                Accept
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => onReject(appointment.id)}
                                startIcon={<X size={16} />}
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    
                    {canEdit && appointment.status !== 'Rejected' && (
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
                    
                    {!canEdit && appointment.status !== 'Rejected' && (
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
                                    appointment.status === 'Confirmed' ? 'success' : 
                                    appointment.status === 'Pending' ? 'warning' : 'error'
                                }
                                className="ml-auto"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-muted-foreground">Date</Typography>
                        <Typography variant="body1" className="text-foreground flex items-center">
                            <Calendar size={16} className="mr-2 text-primary" />
                            {appointment.date}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-muted-foreground">Time</Typography>
                        <Typography variant="body1" className="text-foreground flex items-center">
                            <Clock size={16} className="mr-2 text-primary" />
                            {appointment.time}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" className="text-muted-foreground">Type</Typography>
                        <Typography variant="body1" className="text-foreground">
                            {appointment.type}
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
    const isAccept = type === 'accept';
    
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
            <DialogTitle className="bg-card text-foreground font-bold">
                <Box className="flex items-center">
                    {isAccept ? (
                        <CheckCircle2 size={24} className="mr-2 text-green-500" />
                    ) : (
                        <XCircle size={24} className="mr-2 text-red-500" />
                    )}
                    {isAccept ? 'Accept Appointment' : 'Reject Appointment'}
                </Box>
            </DialogTitle>
            <DialogContent className="bg-card">
                <Typography variant="body1" className="text-foreground">
                    {isAccept 
                        ? 'Are you sure you want to accept this appointment? The patient will be notified.'
                        : 'Are you sure you want to reject this appointment? The patient will be notified.'
                    }
                </Typography>
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
                    onClick={onConfirm}
                    variant="contained"
                    color={isAccept ? 'success' : 'error'}
                    disabled={isSubmitting}
                    className={isAccept 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }
                >
                    {isSubmitting ? 'Processing...' : isAccept ? 'Accept' : 'Reject'}
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

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError('');
            
            const data = await getAppointments();
            setAppointments(data);
        } catch (err) {
            setError('Failed to load appointments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return appointment.status === 'Pending';
        if (activeTab === 'confirmed') return appointment.status === 'Confirmed';
        if (activeTab === 'rejected') return appointment.status === 'Rejected';
        return true;
    });

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

    const handleAcceptAppointment = (id) => {
        setConfirmationType('accept');
        setConfirmationId(id);
        setConfirmDialogOpen(true);
    };

    const handleRejectAppointment = (id) => {
        setConfirmationType('reject');
        setConfirmationId(id);
        setConfirmDialogOpen(true);
    };

    const handleConfirmStatusChange = async () => {
        try {
            setIsSubmitting(true);
            
            const status = confirmationType === 'accept' ? 'Confirmed' : 'Rejected';
            const result = await updateAppointmentStatus(confirmationId, status);
            
            if (result.success) {
                setAppointments(appointments.map(appointment => 
                    appointment.id === confirmationId 
                        ? { ...appointment, status } 
                        : appointment
                ));
                
                setSuccessMessage(`Appointment ${status.toLowerCase()} successfully`);
                
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                setError(result.message || `Failed to ${confirmationType} appointment`);
            }
        } catch (err) {
            setError(`An error occurred while ${confirmationType}ing the appointment`);
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setConfirmDialogOpen(false);
        }
    };

    const handleSaveAppointment = (updatedAppointment) => {
        setAppointments(appointments.map(appointment => 
            appointment.id === updatedAppointment.id 
                ? updatedAppointment 
                : appointment
        ));
        
        setSuccessMessage('Appointment updated successfully');
        
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    return (
        <Box>
            <Paper className="p-6 bg-card border border-border rounded-lg mb-6">
                <Typography variant="h5" component="h1" className="font-bold text-foreground mb-6">
                    Appointment Management
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" className="mb-4">
                        {successMessage}
                    </Alert>
                )}

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    className="mb-6"
                    TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
                >
                    <Tab 
                        label={`All (${appointments.length})`} 
                        value="all" 
                        className={activeTab === 'all' ? 'text-primary' : 'text-muted-foreground'}
                    />
                    <Tab 
                        label={`Pending (${appointments.filter(a => a.status === 'Pending').length})`} 
                        value="pending" 
                        className={activeTab === 'pending' ? 'text-primary' : 'text-muted-foreground'}
                    />
                    <Tab 
                        label={`Confirmed (${appointments.filter(a => a.status === 'Confirmed').length})`} 
                        value="confirmed" 
                        className={activeTab === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}
                    />
                    <Tab 
                        label={`Rejected (${appointments.filter(a => a.status === 'Rejected').length})`} 
                        value="rejected" 
                        className={activeTab === 'rejected' ? 'text-primary' : 'text-muted-foreground'}
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
                                    onAccept={handleAcceptAppointment}
                                    onReject={handleRejectAppointment}
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

            <ConfirmationDialog
                open={confirmDialogOpen}
                type={confirmationType}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmStatusChange}
                isSubmitting={isSubmitting}
            />

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