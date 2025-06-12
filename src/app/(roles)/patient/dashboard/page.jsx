'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Event as EventIcon,
    LocalPharmacy as MedicationIcon,
    Message as MessageIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useGetDashboardSummaryQuery } from '@/store/services/patient/patientApi';

const DashboardPage = () => {
    const { data: summary, isLoading, error } = useGetDashboardSummaryQuery();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error.data?.message || 'Failed to load dashboard data'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Statistics */}
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Upcoming Appointments
                        </Typography>
                        <Typography variant="h4">
                            {summary?.upcomingAppointments?.length || 0}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Active Medications
                        </Typography>
                        <Typography variant="h4">
                            {summary?.activeMedications?.length || 0}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Unread Messages
                        </Typography>
                        <Typography variant="h4">
                            {summary?.unreadMessages?.length || 0}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Consultations
                        </Typography>
                        <Typography variant="h4">
                            {summary?.recentConsultations?.length || 0}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Upcoming Appointments */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Upcoming Appointments
                        </Typography>
                        <List>
                            {summary?.upcomingAppointments?.map((appointment) => (
                                <React.Fragment key={appointment.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <EventIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={appointment.doctorName}
                                            secondary={`${appointment.date} at ${appointment.time}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                            {(!summary?.upcomingAppointments || summary.upcomingAppointments.length === 0) && (
                                <ListItem>
                                    <ListItemText primary="No upcoming appointments" />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Active Medications */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Active Medications
                        </Typography>
                        <List>
                            {summary?.activeMedications?.map((medication) => (
                                <React.Fragment key={medication.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MedicationIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={medication.name}
                                            secondary={`${medication.dosage} - ${medication.frequency}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                            {(!summary?.activeMedications || summary.activeMedications.length === 0) && (
                                <ListItem>
                                    <ListItemText primary="No active medications" />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Messages */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Messages
                        </Typography>
                        <List>
                            {summary?.recentMessages?.map((message) => (
                                <React.Fragment key={message.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MessageIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={message.senderName}
                                            secondary={message.content}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                            {(!summary?.recentMessages || summary.recentMessages.length === 0) && (
                                <ListItem>
                                    <ListItemText primary="No recent messages" />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Consultations */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Consultations
                        </Typography>
                        <List>
                            {summary?.recentConsultations?.map((consultation) => (
                                <React.Fragment key={consultation.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={consultation.doctorName}
                                            secondary={`${consultation.date} - ${consultation.type}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                            {(!summary?.recentConsultations || summary.recentConsultations.length === 0) && (
                                <ListItem>
                                    <ListItemText primary="No recent consultations" />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;