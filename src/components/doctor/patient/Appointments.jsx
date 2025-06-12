import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    VideoCall as VideoCallIcon,
    Phone as PhoneCallIcon
} from '@mui/icons-material';
import { fetchAppointmentsByPatient } from '../../../store/slices/doctor/doctorAppointmentsSlice';
import { createAppointment, updateAppointment } from '../../../store/slices/doctor/doctorAppointmentsSlice';

const AppointmentPaper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius
}));

const Appointments = ({ patientId }) => {
    const dispatch = useDispatch();
    const { appointments, loading } = useSelector((state) => state.doctorAppointments);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = React.useState(null);
    const [formData, setFormData] = React.useState({
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
        // Implement video/audio call functionality
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'primary';
            case 'in-progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video':
                return <VideoCallIcon />;
            case 'phone':
                return <PhoneCallIcon />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography>Loading appointments...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Appointments</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    New Appointment
                </Button>
            </Box>

            <List>
                {appointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                        <AppointmentPaper>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1">
                                        {formatDate(appointment.date)}
                                    </Typography>
                                    <Box display="flex" gap={1} mt={1}>
                                        <Chip
                                            label={appointment.status}
                                            color={getStatusColor(appointment.status)}
                                            size="small"
                                        />
                                        <Chip
                                            label={appointment.type}
                                            variant="outlined"
                                            size="small"
                                            icon={getTypeIcon(appointment.type)}
                                        />
                                        <Chip
                                            label={`${appointment.duration} min`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(appointment)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    {(appointment.type === 'video' || appointment.type === 'phone') && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleStartCall(appointment)}
                                        >
                                            {appointment.type === 'video' ? <VideoCallIcon /> : <PhoneCallIcon />}
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>

                            {appointment.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {appointment.notes}
                                </Typography>
                            )}
                        </AppointmentPaper>
                        {index < appointments.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale="en-US">
                                <DateTimePicker
                                    label="Date and Time"
                                    value={formData.date}
                                    onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={formData.type}
                                    label="Type"
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <MenuItem value="in-person">In Person</MenuItem>
                                    <MenuItem value="video">Video Call</MenuItem>
                                    <MenuItem value="phone">Phone Call</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Status"
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <MenuItem value="scheduled">Scheduled</MenuItem>
                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Duration (minutes)"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedAppointment ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Appointments; 