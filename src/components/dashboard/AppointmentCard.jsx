'use client';

import { Box, Card, Typography, Chip, Button } from '@mui/material';
import { Calendar, MapPin, User } from 'lucide-react';

export default function AppointmentCard({ appointments = [] }) {
    // Add debug logging
    console.log('AppointmentCard received appointments:', appointments);

    if (!appointments?.length) {
        return (
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography color="text.secondary" align="center">
                    No upcoming appointments
                </Typography>
            </Card>
        );
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'scheduled':
                return 'primary';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDateTime = (date, time) => {
        try {
            if (!date) return 'Date not specified';
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return 'Invalid date';
            return `${dateObj.toLocaleDateString()}${time ? ` at ${time}` : ''}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    return (
        <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Upcoming Appointments
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {appointments.map((appointment, index) => (
                    <Box
                        key={appointment?.id || index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {appointment?.doctorName || 'Doctor'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {appointment?.specialty || 'General Medicine'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <Calendar size={14} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDateTime(appointment?.date, appointment?.time)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                                <MapPin size={14} />
                                <Typography variant="body2" color="text.secondary">
                                    {appointment?.location || 'Virtual Consultation'}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Chip
                                label={appointment?.status || 'Unknown'}
                                color={getStatusColor(appointment?.status)}
                                size="small"
                            />
                            <Button variant="outlined" size="small">
                                Details
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Card>
    );
} 