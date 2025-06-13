'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Event as EventIcon,
    LocalPharmacy as MedicationIcon,
    Message as MessageIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    Notifications as NotificationsIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import {
    selectDashboardSummary,
    selectUpcomingAppointments,
    selectActiveMedications,
    selectRecentMessages,
    selectRecentConsultations,
} from '@/store/slices/patient/dashboardSlice';
import { appointments } from '@/mockdata/appointments';
import { medications } from '@/mockdata/medications';
import { conversations } from '@/mockdata/conversations';
import { consultations } from '@/mockdata/consultations';

const StatCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    
    return (
        <Card 
            elevation={0}
            sx={{
                p: 2,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
                border: `1px solid ${alpha(color, 0.1)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 16px ${alpha(color, 0.1)}`,
                },
            }}
        >
            <CardContent sx={{ p: '16px !important' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {value}
                        </Typography>
                    </Box>
                    <Avatar 
                        sx={{ 
                            bgcolor: alpha(color, 0.1),
                            color: color,
                            width: 48,
                            height: 48,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

const DashboardPage = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const dashboardSummary = useSelector(state => state.patientDashboard.summary);
    const upcomingAppointments = useSelector(state => state.patientDashboard.appointments);
    const activeMedications = useSelector(state => state.patientDashboard.medications);
    const recentMessages = useSelector(state => state.patientDashboard.messages);
    const recentConsultations = useSelector(state => state.patientDashboard.consultations);

    useEffect(() => {
        // Load mock data
        const mockAppointments = appointments.filter(apt => 
            new Date(apt.date) > new Date() && apt.status === 'scheduled'
        );
        const mockMedications = medications.filter(med => 
            med.status === 'active'
        );
        const mockMessages = conversations[0]?.messages || [];
        const mockConsultations = consultations.filter(cons => 
            cons.status === 'completed'
        ).slice(0, 5);

        // Dispatch actions to update state
        dispatch({ type: 'patientDashboard/setUpcomingAppointments', payload: mockAppointments });
        dispatch({ type: 'patientDashboard/setActiveMedications', payload: mockMedications });
        dispatch({ type: 'patientDashboard/setRecentMessages', payload: mockMessages });
        dispatch({ type: 'patientDashboard/setRecentConsultations', payload: mockConsultations });
    }, [dispatch]);

    if (!dashboardSummary || !upcomingAppointments || !activeMedications || !recentMessages || !recentConsultations) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (dashboardSummary.isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (dashboardSummary.error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {dashboardSummary.error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome back, {dashboardSummary.data?.name || 'Patient'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's an overview of your health status and upcoming activities
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Statistics Cards */}
                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                    <StatCard
                        title="Upcoming Appointments"
                        value={upcomingAppointments?.data?.length || 0}
                        icon={<EventIcon />}
                        color={theme.palette.primary.main}
                    />
                </Grid>

                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                    <StatCard
                        title="Active Medications"
                        value={activeMedications?.data?.length || 0}
                        icon={<MedicationIcon />}
                        color={theme.palette.success.main}
                    />
                </Grid>

                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                    <StatCard
                        title="Unread Messages"
                        value={recentMessages?.data?.filter(msg => !msg.isRead)?.length || 0}
                        icon={<MessageIcon />}
                        color={theme.palette.warning.main}
                    />
                </Grid>

                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
                    <StatCard
                        title="Recent Consultations"
                        value={recentConsultations?.data?.length || 0}
                        icon={<PersonIcon />}
                        color={theme.palette.info.main}
                    />
                </Grid>

                {/* Upcoming Appointments */}
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">
                                    Upcoming Appointments
                                </Typography>
                                <Tooltip title="View all appointments">
                                    <IconButton size="small">
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {upcomingAppointments?.data?.map((appointment) => (
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
                                                <CalendarIcon fontSize="small" />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={appointment.doctor}
                                            secondary={
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <TimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                                                    {appointment.date} at {appointment.time}
                                                </span>
                                            }
                                        />
                                        <Chip 
                                            label={appointment.status} 
                                            size="small"
                                            color={appointment.status === 'scheduled' ? 'primary' : 'default'}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Medications */}
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">
                                    Active Medications
                                </Typography>
                                <Tooltip title="View all medications">
                                    <IconButton size="small">
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {activeMedications?.data?.map((medication) => (
                                    <ListItem 
                                        key={medication.id}
                                        sx={{ 
                                            px: 0,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.success.main, 0.04),
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                    color: theme.palette.success.main,
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            >
                                                <MedicationIcon fontSize="small" />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={medication.name}
                                            secondary={
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {medication.dosage} - {medication.frequency}
                                                </span>
                                            }
                                        />
                                        <Chip 
                                            label={medication.status} 
                                            size="small"
                                            color="success"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Messages */}
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">
                                    Recent Messages
                                </Typography>
                                <Tooltip title="View all messages">
                                    <IconButton size="small">
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {recentMessages?.data?.map((message, index) => (
                                    <ListItem 
                                        key={`${message.sender}-${message.timestamp}-${index}`}
                                        sx={{ 
                                            px: 0,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.warning.main, 0.04),
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                    color: theme.palette.warning.main,
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            >
                                                <MessageIcon fontSize="small" />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={message.sender}
                                            secondary={
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {message.content}
                                                </span>
                                            }
                                        />
                                        {!message.read && (
                                            <Chip 
                                                label="New" 
                                                size="small"
                                                color="warning"
                                            />
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Consultations */}
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">
                                    Recent Consultations
                                </Typography>
                                <Tooltip title="View all consultations">
                                    <IconButton size="small">
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {recentConsultations?.data?.map((consultation) => (
                                    <ListItem 
                                        key={consultation.id}
                                        sx={{ 
                                            px: 0,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.info.main, 0.04),
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                                    color: theme.palette.info.main,
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            >
                                                <PersonIcon fontSize="small" />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={consultation.doctor}
                                            secondary={
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <TimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                                                    {consultation.date} at {consultation.time}
                                                </span>
                                            }
                                        />
                                        <Chip 
                                            label={consultation.type} 
                                            size="small"
                                            color="info"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;