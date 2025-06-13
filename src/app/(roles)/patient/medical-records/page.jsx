'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useTheme, alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WarningIcon from '@mui/icons-material/Warning';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MedicationIcon from '@mui/icons-material/Medication';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScaleIcon from '@mui/icons-material/Scale';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '../../../../components/patient/PageHeader';
import { setMedicalRecords, setLoading, setError } from '@/store/slices/patient/medicalRecordsSlice';

const MedicalRecordCard = ({ title, icon, children, action }) => {
    const theme = useTheme();
    
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar 
                            sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                            }}
                        >
                            {icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                    {action}
                </Box>
                <Divider sx={{ mb: 2 }} />
                {children}
            </CardContent>
        </Card>
    );
};

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`medical-record-tabpanel-${index}`}
            aria-labelledby={`medical-record-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const MedicalRecordsPage = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { loading, error, basicInfo, vitalSigns, allergies, conditions, medications } = useSelector(state => state.medicalRecords);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const loadMedicalRecords = async () => {
            try {
                dispatch(setLoading(true));
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                dispatch(setMedicalRecords(mockPatientData.medicalRecord));
            } catch (err) {
                dispatch(setError(err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadMedicalRecords();
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
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
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            <PageHeader
                title="Medical Records"
                description="View your complete medical history"
                breadcrumbs={[
                    { label: 'Medical Records', href: '/patient/medical-records' }
                ]}
            />

            <Paper 
                elevation={0}
                sx={{ 
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 3,
                    }}
                >
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <PersonIcon fontSize="small" />
                                <Typography>Basic Info</Typography>
                            </Box>
                        }
                    />
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <MonitorHeartIcon fontSize="small" />
                                <Typography>Vital Signs</Typography>
                            </Box>
                        }
                    />
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <WarningIcon fontSize="small" />
                                <Typography>Allergies</Typography>
                            </Box>
                        }
                    />
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <PsychologyIcon fontSize="small" />
                                <Typography>Conditions</Typography>
                            </Box>
                        }
                    />
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <MedicationIcon fontSize="small" />
                                <Typography>Medications</Typography>
                            </Box>
                        }
                    />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <MedicalRecordCard
                                title="Basic Information"
                                icon={<PersonIcon />}
                            >
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <WaterDropIcon color="action" />
                                        <Typography>
                                            <strong>Blood Type:</strong> {basicInfo?.bloodType}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <ScaleIcon color="action" />
                                        <Typography>
                                            <strong>Height:</strong> {basicInfo?.height}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <ScaleIcon color="action" />
                                        <Typography>
                                            <strong>Weight:</strong> {basicInfo?.weight}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </MedicalRecordCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MedicalRecordCard
                                title="Vital Signs"
                                icon={<MonitorHeartIcon />}
                                action={
                                    <Tooltip title="Last updated">
                                        <Chip
                                            icon={<AccessTimeIcon />}
                                            label={vitalSigns?.lastUpdated}
                                            size="small"
                                        />
                                    </Tooltip>
                                }
                            >
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <WaterDropIcon color="action" />
                                        <Typography>
                                            <strong>Blood Pressure:</strong> {vitalSigns?.bloodPressure}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FavoriteIcon color="action" />
                                        <Typography>
                                            <strong>Heart Rate:</strong> {vitalSigns?.heartRate}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <DeviceThermostatIcon color="action" />
                                        <Typography>
                                            <strong>Temperature:</strong> {vitalSigns?.temperature}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </MedicalRecordCard>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MedicalRecordCard
                                title="Vital Signs History"
                                icon={<MonitorHeartIcon />}
                            >
                                <Stack spacing={2}>
                                    {vitalSigns?.history?.map((record, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <AccessTimeIcon color="action" />
                                            <Typography>
                                                <strong>{record.date}:</strong> {record.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </MedicalRecordCard>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MedicalRecordCard
                                title="Allergies"
                                icon={<WarningIcon />}
                            >
                                <Stack spacing={2}>
                                    {allergies?.map((allergy, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <WarningIcon color="error" />
                                            <Typography>
                                                <strong>{allergy.name}</strong> - {allergy.severity}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </MedicalRecordCard>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MedicalRecordCard
                                title="Medical Conditions"
                                icon={<PsychologyIcon />}
                            >
                                <Stack spacing={2}>
                                    {conditions?.map((condition, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <PsychologyIcon color="action" />
                                            <Typography>
                                                <strong>{condition.name}</strong> - {condition.status}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </MedicalRecordCard>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MedicalRecordCard
                                title="Current Medications"
                                icon={<MedicationIcon />}
                            >
                                <Stack spacing={2}>
                                    {medications?.map((medication, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <MedicationIcon color="action" />
                                            <Typography>
                                                <strong>{medication.name}</strong> - {medication.dosage}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </MedicalRecordCard>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default MedicalRecordsPage; 