import React from 'react';
import { useSelector } from 'react-redux';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider
} from '@mui/material';
import {
    EventNote as ConsultationIcon,
    LocalPharmacy as PrescriptionIcon,
    Event as AppointmentIcon,
    Person as PatientIcon
} from '@mui/icons-material';

const ActivityIcon = ({ type }) => {
    const icons = {
        consultation: <ConsultationIcon color="primary" />,
        prescription: <PrescriptionIcon color="secondary" />,
        appointment: <AppointmentIcon color="success" />,
        patient: <PatientIcon color="info" />
    };
    return icons[type] || <ConsultationIcon />;
};

const RecentActivities = () => {
    const { consultations } = useSelector((state) => state.doctorConsultations);
    const { prescriptions } = useSelector((state) => state.doctorPrescriptions);
    const { appointments } = useSelector((state) => state.doctorSchedule);
    const { patients } = useSelector((state) => state.doctorPatients);

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

    const getActivityDescription = (activity) => {
        switch (activity.type) {
            case 'consultation':
                return `Consultation with ${activity.patientName}`;
            case 'prescription':
                return `Prescribed ${activity.medicationName} for ${activity.patientName}`;
            case 'appointment':
                return `Appointment scheduled with ${activity.patientName}`;
            case 'patient':
                return `New patient ${activity.patientName} registered`;
            default:
                return 'Unknown activity';
        }
    };

    // Combine and sort all activities
    const activities = [
        ...consultations.map(cons => ({
            ...cons,
            type: 'consultation',
            date: cons.date,
            patientName: patients.find(p => p.id === cons.patientId)?.firstName || 'Unknown'
        })),
        ...prescriptions.map(pres => ({
            ...pres,
            type: 'prescription',
            date: pres.date,
            patientName: patients.find(p => p.id === pres.patientId)?.firstName || 'Unknown',
            medicationName: pres.medications[0]?.name || 'medication'
        })),
        ...appointments.map(app => ({
            ...app,
            type: 'appointment',
            date: app.date,
            patientName: patients.find(p => p.id === app.patientId)?.firstName || 'Unknown'
        }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

    return (
        <List>
            {activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                    <ListItem>
                        <ListItemIcon>
                            <ActivityIcon type={activity.type} />
                        </ListItemIcon>
                        <ListItemText
                            primary={getActivityDescription(activity)}
                            secondary={
                                <Box>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formatDate(activity.date)}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                    {index < activities.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default RecentActivities; 