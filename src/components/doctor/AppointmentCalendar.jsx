import React from 'react';
import { useSelector } from 'react-redux';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Chip,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentCalendar = () => {
    const { appointments } = useSelector((state) => state.doctorSchedule);
    const { patients } = useSelector((state) => state.doctorPatients);
    const navigate = useNavigate();

    const today = new Date();
    const todayAppointments = appointments
        .filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.toDateString() === today.toDateString();
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
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

    const handleAppointmentClick = (appointmentId) => {
        navigate(`/doctor/appointments/${appointmentId}`);
    };

    if (todayAppointments.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
            >
                <Typography variant="body1" color="text.secondary">
                    No appointments scheduled for today
                </Typography>
            </Box>
        );
    }

    return (
        <List>
            {todayAppointments.map((appointment, index) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                    <React.Fragment key={appointment.id}>
                        <ListItem
                            button
                            onClick={() => handleAppointmentClick(appointment.id)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="subtitle1">
                                            {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={appointment.status}
                                            color={getStatusColor(appointment.status)}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {formatTime(appointment.date)}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1 }}
                                        >
                                            {appointment.type}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                        {index < todayAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })}
        </List>
    );
};

export default AppointmentCalendar; 