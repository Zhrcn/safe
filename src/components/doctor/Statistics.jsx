import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    People as PeopleIcon,
    Event as EventIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';

const StatPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    height: '100%'
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
}));

const StatContent = styled(Box)({
    flex: 1
});

const Statistics = () => {
    const { patients } = useSelector((state) => state.doctorPatients);
    const { appointments } = useSelector((state) => state.doctorSchedule);
    const { consultations } = useSelector((state) => state.doctorConsultations);
    const { prescriptions } = useSelector((state) => state.doctorPrescriptions);

    const today = new Date();
    const todayAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toDateString() === today.toDateString();
    });

    const stats = [
        {
            title: 'Total Patients',
            value: patients.length,
            icon: <PeopleIcon />,
            color: '#1976d2'
        },
        {
            title: "Today's Appointments",
            value: todayAppointments.length,
            icon: <EventIcon />,
            color: '#2e7d32'
        },
        {
            title: 'Active Consultations',
            value: consultations.filter(cons => cons.status === 'active').length,
            icon: <HospitalIcon />,
            color: '#ed6c02'
        },
        {
            title: 'Active Prescriptions',
            value: prescriptions.filter(pres => pres.status === 'active').length,
            icon: <AssignmentIcon />,
            color: '#9c27b0'
        }
    ];

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatPaper elevation={2}>
                        <IconWrapper sx={{ backgroundColor: stat.color }}>
                            {stat.icon}
                        </IconWrapper>
                        <StatContent>
                            <Typography variant="h6" component="div">
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.title}
                            </Typography>
                        </StatContent>
                    </StatPaper>
                </Grid>
            ))}
        </Grid>
    );
};

export default Statistics; 