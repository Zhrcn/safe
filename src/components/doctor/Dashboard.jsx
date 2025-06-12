import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    fetchPatients,
    fetchConsultations,
    fetchPrescriptions
} from '../../store/slices/doctor/doctorPatientsSlice';
import {
    fetchAppointments
} from '../../store/slices/doctor/doctorScheduleSlice';
import PatientList from './PatientList';
import AppointmentCalendar from './AppointmentCalendar';
import RecentActivities from './RecentActivities';
import Statistics from './Statistics';

const DashboardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh'
}));

const DashboardPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
}));

const Dashboard = () => {
    const dispatch = useDispatch();
    const { loading: patientsLoading } = useSelector((state) => state.doctorPatients);
    const { loading: appointmentsLoading } = useSelector((state) => state.doctorSchedule);
    const { loading: consultationsLoading } = useSelector((state) => state.doctorConsultations);
    const { loading: prescriptionsLoading } = useSelector((state) => state.doctorPrescriptions);

    useEffect(() => {
        dispatch(fetchPatients());
        dispatch(fetchAppointments());
        dispatch(fetchConsultations());
        dispatch(fetchPrescriptions());
    }, [dispatch]);

    if (patientsLoading || appointmentsLoading || consultationsLoading || prescriptionsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DashboardContainer>
            <Typography variant="h4" gutterBottom>
                Doctor Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Statistics Section */}
                <Grid item xs={12}>
                    <DashboardPaper>
                        <Statistics />
                    </DashboardPaper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                        {/* Patient List */}
                        <Grid item xs={12}>
                            <DashboardPaper>
                                <Typography variant="h6" gutterBottom>
                                    Recent Patients
                                </Typography>
                                <PatientList />
                            </DashboardPaper>
                        </Grid>

                        {/* Recent Activities */}
                        <Grid item xs={12}>
                            <DashboardPaper>
                                <Typography variant="h6" gutterBottom>
                                    Recent Activities
                                </Typography>
                                <RecentActivities />
                            </DashboardPaper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <DashboardPaper>
                        <Typography variant="h6" gutterBottom>
                            Today's Appointments
                        </Typography>
                        <AppointmentCalendar />
                    </DashboardPaper>
                </Grid>
            </Grid>
        </DashboardContainer>
    );
};

export default Dashboard; 