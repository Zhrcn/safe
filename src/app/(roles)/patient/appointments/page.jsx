'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Avatar,
    Tooltip,
    useTheme,
    alpha,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    InputAdornment,
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    Add as PlusIcon,
    Check as CheckIcon,
    Close as XIcon,
    Delete as TrashIcon,
    Edit as EditIcon,
    Event as CalendarIcon,
    LocationOn as MapPinIcon,
    Person as UserIcon,
    Search as SearchIcon,
    Warning as AlertCircleIcon,
} from '@mui/icons-material';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';

const statusIcons = {
    scheduled: <TimeIcon />,
    completed: <CheckIcon />,
    cancelled: <XIcon />,
};

const AppointmentCard = ({ appointment, onEdit, onCancel }) => {
    const theme = useTheme();
    const statusColors = {
        scheduled: 'primary',
        completed: 'success',
        cancelled: 'error',
    };

    return (
        <Card 
            elevation={0}
            sx={{
                height: '100%',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar 
                            sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                            }}
                        >
                            <UserIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {appointment.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {appointment.specialty}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={statusIcons[appointment.status]}
                        label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        color={statusColors[appointment.status]}
                        size="small"
                    />
                </Box>

                <Stack spacing={1} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <CalendarIcon size={16} color="action" />
                        <Typography variant="body2">
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <TimeIcon size={16} color="action" />
                        <Typography variant="body2">
                            {appointment.time} ({appointment.duration} minutes)
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <MapPinIcon size={16} color="action" />
                        <Typography variant="body2">
                            {appointment.location}
                        </Typography>
                    </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {appointment.reason}
                </Typography>

                {appointment.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Notes:</strong> {appointment.notes}
                    </Typography>
                )}

                <Box display="flex" gap={1} mt={2}>
                    {appointment.status === 'scheduled' && (
                        <>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => onEdit(appointment)}
                                sx={{ flex: 1 }}
                            >
                                Reschedule
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<TrashIcon />}
                                onClick={() => onCancel(appointment)}
                                sx={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(mockPatientData.appointments);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('new'); // 'new' or 'edit'
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        notes: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const theme = useTheme();

    const handleOpenDialog = (type, appointment = null) => {
        setDialogType(type);
        if (type === 'edit' && appointment) {
            setSelectedAppointment(appointment);
            setFormData({
                doctorId: appointment.doctorId,
                date: appointment.date,
                time: appointment.time,
                reason: appointment.reason,
                notes: appointment.notes,
            });
        } else {
            setFormData({
                doctorId: '',
                date: '',
                time: '',
                reason: '',
                notes: '',
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedAppointment(null);
        setFormData({
            doctorId: '',
            date: '',
            time: '',
            reason: '',
            notes: '',
        });
    };

    const handleSubmit = () => {
        if (dialogType === 'new') {
            const newAppointment = {
                id: appointments.length + 1,
                ...formData,
                status: 'scheduled',
                type: 'regular',
                duration: 30,
                location: 'Main Hospital',
            };
            setAppointments([...appointments, newAppointment]);
        } else {
            setAppointments(appointments.map(appointment =>
                appointment.id === selectedAppointment.id
                    ? { ...appointment, ...formData }
                    : appointment
            ));
        }
        handleCloseDialog();
    };

    const handleCancel = (appointment) => {
        setAppointments(appointments.map(apt =>
            apt.id === appointment.id
                ? { ...apt, status: 'cancelled' }
                : apt
        ));
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <Box className="container mx-auto px-4 py-8">
            <PageHeader
                title="Appointments"
                description="Schedule and manage your medical appointments"
            />

            <Box display="flex" justifyContent="flex-end" mb={4}>
                <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => handleOpenDialog('new')}
                    sx={{ 
                        borderRadius: 1,
                        textTransform: 'none',
                        px: 3,
                    }}
                >
                    Schedule New Appointment
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Filters */}
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                    <TextField
                        fullWidth
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={typeFilter}
                            label="Type"
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="checkup">Checkup</MenuItem>
                            <MenuItem value="consultation">Consultation</MenuItem>
                            <MenuItem value="follow-up">Follow-up</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Appointments List */}
                <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 8' } }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">
                                    Appointments
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<PlusIcon />}
                                    onClick={() => handleOpenDialog('new')}
                                >
                                    New Appointment
                                </Button>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {filteredAppointments.map((appointment) => (
                                    <ListItem 
                                        key={appointment.id}
                                        sx={{ 
                                            px: 0,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            >
                                                {statusIcons[appointment.status]}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={appointment.doctorName}
                                            secondary={
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <TimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                                                    {appointment.date} at {appointment.time}
                                                </span>
                                            }
                                        />
                                        <Box display="flex" gap={1}>
                                            <Chip 
                                                label={appointment.type} 
                                                size="small"
                                                color="primary"
                                            />
                                            <Chip 
                                                label={appointment.status} 
                                                size="small"
                                                color={appointment.status === 'scheduled' ? 'primary' : 'default'}
                                            />
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Appointment Details */}
                <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 4' } }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Appointment Details
                            </Typography>
                            {selectedAppointment ? (
                                <Box>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            {statusIcons[selectedAppointment.status]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {selectedAppointment.doctorName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedAppointment.specialty}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box mb={2}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Date & Time
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CalendarIcon fontSize="small" />
                                            <Typography variant="body1">
                                                {selectedAppointment.date}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                            <TimeIcon fontSize="small" />
                                            <Typography variant="body1">
                                                {selectedAppointment.time}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box mb={2}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Location
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <MapPinIcon fontSize="small" />
                                            <Typography variant="body1">
                                                {selectedAppointment.location}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box mb={2}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Reason
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedAppointment.reason}
                                        </Typography>
                                    </Box>
                                    {selectedAppointment.notes && (
                                        <Box mb={2}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Notes
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedAppointment.notes}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box display="flex" gap={1}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleOpenDialog('edit', selectedAppointment)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<TrashIcon />}
                                            onClick={() => handleCancel(selectedAppointment)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box 
                                    display="flex" 
                                    flexDirection="column" 
                                    alignItems="center" 
                                    justifyContent="center" 
                                    minHeight={200}
                                >
                                    <Typography color="text.secondary" align="center">
                                        Select an appointment to view details
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog 
                open={dialogOpen} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {dialogType === 'new' ? 'Schedule New Appointment' : 'Reschedule Appointment'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Doctor</InputLabel>
                            <Select
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                label="Doctor"
                            >
                                {mockPatientData.doctors.map((doctor) => (
                                    <MenuItem key={doctor.id} value={doctor.id}>
                                        {doctor.name} - {doctor.specialty}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        <TextField
                            label="Time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        <TextField
                            label="Reason for Visit"
                            multiline
                            rows={3}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            label="Additional Notes"
                            multiline
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        disabled={!formData.doctorId || !formData.date || !formData.time || !formData.reason}
                    >
                        {dialogType === 'new' ? 'Schedule' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
