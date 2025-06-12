import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    Chip,
    Avatar,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Person as PersonIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { fetchPatientDetails } from '../../store/slices/doctor/doctorPatientsSlice';
import { addPatientToFavorites, removePatientFromFavorites } from '../../store/slices/doctor/doctorPatientsSlice';
import MedicalHistory from './patient/MedicalHistory';
import Consultations from './patient/Consultations';
import Prescriptions from './patient/Prescriptions';
import Appointments from './patient/Appointments';

const PatientDetailsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh'
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1)
}));

const TabPanel = ({ children, value, index }) => (
    <Box hidden={value !== index} sx={{ p: 3 }}>
        {value === index && children}
    </Box>
);

const PatientDetails = () => {
    const { patientId } = useParams();
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = React.useState(0);
    const { selectedPatient: patient, loading, favorites } = useSelector((state) => state.doctorPatients);

    useEffect(() => {
        dispatch(fetchPatientDetails(patientId));
    }, [dispatch, patientId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleFavoriteToggle = () => {
        if (favorites.includes(patientId)) {
            dispatch(removePatientFromFavorites(patientId));
        } else {
            dispatch(addPatientToFavorites(patientId));
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!patient) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6">Patient not found</Typography>
            </Box>
        );
    }

    return (
        <PatientDetailsContainer>
            <ProfilePaper>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ width: 64, height: 64 }}>
                                <PersonIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="h5">
                                        {patient.firstName} {patient.lastName}
                                    </Typography>
                                    <IconButton onClick={handleFavoriteToggle} size="small">
                                        {favorites.includes(patientId) ? (
                                            <StarIcon color="primary" />
                                        ) : (
                                            <StarBorderIcon />
                                        )}
                                    </IconButton>
                                </Box>
                                <Typography variant="body1" color="text.secondary">
                                    Patient ID: {patient.id}
                                </Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <InfoItem>
                                    <PhoneIcon color="action" />
                                    <Typography>{patient.phone}</Typography>
                                </InfoItem>
                                <InfoItem>
                                    <EmailIcon color="action" />
                                    <Typography>{patient.email}</Typography>
                                </InfoItem>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem>
                                    <LocationIcon color="action" />
                                    <Typography>{patient.address}</Typography>
                                </InfoItem>
                                <Box display="flex" gap={1} mt={1}>
                                    <Chip label={patient.gender} color="primary" variant="outlined" />
                                    <Chip label={`Age: ${patient.age}`} color="secondary" variant="outlined" />
                                    <Chip label={patient.bloodType} color="error" variant="outlined" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ProfilePaper>

            <Paper>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Medical History" />
                    <Tab label="Consultations" />
                    <Tab label="Prescriptions" />
                    <Tab label="Appointments" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <MedicalHistory patientId={patientId} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Consultations patientId={patientId} />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Prescriptions patientId={patientId} />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <Appointments patientId={patientId} />
                </TabPanel>
            </Paper>
        </PatientDetailsContainer>
    );
};

export default PatientDetails; 