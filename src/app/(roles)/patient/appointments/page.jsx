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
    Paper,
    Divider,
    Badge,
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
    VideoCall as VideoIcon,
    Phone as PhoneIcon,
    Business as BuildingIcon,
    ChevronRight as ChevronRightIcon,
    RefreshCw as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';
import { useNotification } from '@/components/ui/Notification';

const AppointmentCard = ({ appointment, onViewDetails }) => {
    const theme = useTheme();
    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'info';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'scheduled':
                return <TimeIcon />;
            case 'completed':
                return <CheckIcon />;
            case 'cancelled':
                return <XIcon />;
            default:
                return <AlertCircleIcon />;
        }
    };

    const getAppointmentTypeIcon = (type) => {
        switch (type) {
            case 'video':
                return <VideoIcon />;
            case 'phone':
                return <PhoneIcon />;
            case 'in-person':
                return <BuildingIcon />;
            default:
                return <CalendarIcon />;
        }
    };

    return (
        <Card 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                },
                position: 'relative',
                overflow: 'visible',
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                }}
            >
                <Chip
                    icon={getStatusIcon(appointment.status)}
                    label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    color={getStatusColor(appointment.status)}
                    size="small"
                    sx={{
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                            color: 'inherit',
                        },
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Stack spacing={2}>
                    {/* Doctor Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar
                            src={appointment.doctorPhoto}
                            alt={appointment.doctorName}
                            sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {appointment.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {appointment.specialty}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Appointment Details */}
                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2">
                                {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2">
                                {appointment.time} ({appointment.duration} min)
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getAppointmentTypeIcon(appointment.type)}
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {appointment.type} Appointment
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPinIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2" noWrap>
                                {appointment.location}
                            </Typography>
                        </Box>
                    </Stack>

                    {appointment.notes && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <AlertCircleIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2" color="text.secondary">
                                {appointment.notes}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ChevronRightIcon />}
                    onClick={() => onViewDetails(appointment)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    View Details
                </Button>
            </Box>
        </Card>
    );
};

const AppointmentDetailDialog = ({ open, onClose, appointment }) => {
    const theme = useTheme();

    if (!appointment) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle>
                <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
                    Appointment Details
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3}>
                    {/* Doctor Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={appointment.doctorPhoto}
                            alt={appointment.doctorName}
                            sx={{ width: 64, height: 64 }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {appointment.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {appointment.specialty}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Appointment Details */}
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Date & Time
                            </Typography>
                            <Typography variant="body1">
                                {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')} at {appointment.time}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Location
                            </Typography>
                            <Typography variant="body1">
                                {appointment.location}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Type
                            </Typography>
                            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                {appointment.type} Appointment
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Reason
                            </Typography>
                            <Typography variant="body1">
                                {appointment.reason}
                            </Typography>
                        </Box>

                        {appointment.notes && (
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Notes
                                </Typography>
                                <Typography variant="body1">
                                    {appointment.notes}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AppointmentsPage = () => {
    const [appointments] = useState(mockPatientData.appointments);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { showNotification } = useNotification();

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedAppointment(null);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            <PageHeader
                title="Appointments"
                subtitle="View and manage your upcoming appointments"
                action={
                    <Button
                        variant="contained"
                        startIcon={<PlusIcon />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Book Appointment
                    </Button>
                }
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {appointments.map((appointment) => (
                    <Box key={appointment.id}>
                        <AppointmentCard
                            appointment={appointment}
                            onViewDetails={handleViewDetails}
                        />
                    </Box>
                ))}
            </Box>

            <AppointmentDetailDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                appointment={selectedAppointment}
            />
        </Box>
    );
};

export default AppointmentsPage;
