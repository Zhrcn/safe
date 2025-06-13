'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMedicalRecords, setLoading, setError } from '@/store/slices/patient/medicalRecordsSlice';
import { medicalFiles } from '@/mockdata/medicalFiles';
import { 
    Box, 
    CircularProgress, 
    Typography, 
    Card, 
    Grid, 
    Chip,
    Divider,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Tooltip,
    Paper,
    Tabs,
    Tab,
    Breadcrumbs,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HistoryIcon from '@mui/icons-material/History';
import FolderIcon from '@mui/icons-material/Folder';
import WarningIcon from '@mui/icons-material/Warning';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const MedicalRecordsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { records, loading, error } = useSelector((state) => state.medicalRecords);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const recordCategories = [
        { id: 'all', label: 'All Records', icon: <FolderIcon /> },
        { id: 'lab', label: 'Lab Results', icon: <ScienceIcon /> },
        { id: 'imaging', label: 'Imaging Reports', icon: <LocalHospitalIcon /> },
        { id: 'vital', label: 'Vital Signs', icon: <BloodtypeIcon /> },
        { id: 'medication', label: 'Medications', icon: <MedicationIcon /> },
        { id: 'vaccination', label: 'Immunizations', icon: <VaccinesIcon /> },
        { id: 'surgery', label: 'Surgical History', icon: <HistoryIcon /> },
        { id: 'allergy', label: 'Allergies', icon: <WarningIcon /> },
        { id: 'condition', label: 'Chronic Conditions', icon: <MedicalServicesIcon /> }
    ];

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                dispatch(setLoading(true));
                
                // Transform medical file data into records format
                const transformedRecords = [];
                const medicalFile = medicalFiles[0]; // Using first medical file for now

                // Add lab results
                medicalFile.labResults.forEach(result => {
                    transformedRecords.push({
                        id: `lab-${result.testName}`,
                        title: result.testName,
                        type: 'lab',
                        date: result.date,
                        doctor: result.doctorId,
                        location: result.labName,
                        description: `Results: ${result.results} ${result.unit} (Normal Range: ${result.normalRange})`,
                        attachments: result.documents
                    });
                });

                // Add imaging reports
                medicalFile.imagingReports.forEach(report => {
                    transformedRecords.push({
                        id: `imaging-${report.type}`,
                        title: `${report.type} - ${report.location}`,
                        type: 'imaging',
                        date: report.date,
                        doctor: report.doctorId,
                        location: 'Imaging Center',
                        description: report.findings,
                        attachments: report.images
                    });
                });

                // Add vital signs
                medicalFile.vitalSigns.forEach(signs => {
                    transformedRecords.push({
                        id: `vital-${signs.date}`,
                        title: 'Vital Signs Check',
                        type: 'vital',
                        date: signs.date,
                        doctor: 'Dr. Smith',
                        location: 'Main Clinic',
                        description: `BP: ${signs.bloodPressure}, HR: ${signs.heartRate}, Temp: ${signs.temperature}°C, RR: ${signs.respiratoryRate}, SpO2: ${signs.oxygenSaturation}%`,
                        attachments: []
                    });
                });

                // Add medications
                medicalFile.medicationHistory.forEach(med => {
                    transformedRecords.push({
                        id: `med-${med.medicine}`,
                        title: med.name,
                        type: 'medication',
                        date: med.startDate,
                        doctor: med.prescribedBy,
                        location: 'Pharmacy',
                        description: `${med.dose} ${med.frequency} - ${med.instructions}`,
                        attachments: []
                    });
                });

                // Add immunizations
                medicalFile.immunizations.forEach(immunization => {
                    transformedRecords.push({
                        id: `vacc-${immunization.name}`,
                        title: immunization.name,
                        type: 'vaccination',
                        date: immunization.dateAdministered,
                        doctor: immunization.administeredBy,
                        location: 'Vaccination Center',
                        description: `Manufacturer: ${immunization.manufacturer}, Batch: ${immunization.batchNumber}`,
                        attachments: []
                    });
                });

                // Add surgical history
                medicalFile.surgicalHistory.forEach(surgery => {
                    transformedRecords.push({
                        id: `surgery-${surgery.name}`,
                        title: surgery.name,
                        type: 'surgery',
                        date: surgery.date,
                        doctor: surgery.surgeon,
                        location: surgery.hospital,
                        description: `${surgery.notes} - Outcome: ${surgery.outcome}`,
                        attachments: []
                    });
                });

                // Add allergies
                medicalFile.allergies.forEach(allergy => {
                    transformedRecords.push({
                        id: `allergy-${allergy.name}`,
                        title: allergy.name,
                        type: 'allergy',
                        date: new Date(),
                        doctor: 'Dr. Smith',
                        location: 'Main Clinic',
                        description: `Severity: ${allergy.severity}, Reaction: ${allergy.reaction}`,
                        attachments: []
                    });
                });

                // Add chronic conditions
                medicalFile.chronicConditions.forEach(condition => {
                    transformedRecords.push({
                        id: `condition-${condition.name}`,
                        title: condition.name,
                        type: 'condition',
                        date: condition.diagnosisDate,
                        doctor: 'Dr. Smith',
                        location: 'Main Clinic',
                        description: `Status: ${condition.status}, Notes: ${condition.notes}`,
                        attachments: []
                    });
                });

                // Sort records by date
                transformedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                dispatch(setMedicalRecords(transformedRecords));
            } catch (error) {
                dispatch(setError(error.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchRecords();
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const filteredRecords = selectedTab === 0 
        ? records 
        : records.filter(record => record.type === recordCategories[selectedTab].id);

    const handleOpenModal = (record) => {
        setSelectedRecord(record);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRecord(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Error Loading Medical Records
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {error}
                </Typography>
            </Box>
        );
    }

    const getRecordTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'lab':
                return 'success';
            case 'imaging':
                return 'info';
            case 'vital':
                return 'primary';
            case 'medication':
                return 'warning';
            case 'vaccination':
                return 'secondary';
            case 'surgery':
                return 'error';
            case 'allergy':
                return 'error';
            case 'condition':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getRecordTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'lab':
                return <ScienceIcon />;
            case 'imaging':
                return <LocalHospitalIcon />;
            case 'vital':
                return <BloodtypeIcon />;
            case 'medication':
                return <MedicationIcon />;
            case 'vaccination':
                return <VaccinesIcon />;
            case 'surgery':
                return <HistoryIcon />;
            case 'allergy':
                return <WarningIcon />;
            case 'condition':
                return <MedicalServicesIcon />;
            default:
                return <FolderIcon />;
        }
    };

    return (
        <Box
            sx={{
                pt: { xs: 3, sm: 4, md: 6 },
                pb: { xs: 8, sm: 10, md: 12 },
                maxWidth: '2000px',
                margin: '0 auto',
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            {/* Breadcrumbs */}
            <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" />} 
                aria-label="breadcrumb"
                sx={{ mb: 5 }}
            >
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/patient/dashboard"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Dashboard
                </Link>
                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                >
                    <FolderIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Medical Records
                </Typography>
            </Breadcrumbs>

            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    mb: 5,
                    fontWeight: 700,
                    color: 'text.primary',
                    letterSpacing: '-0.5px'
                }}
            >
                Medical Records
            </Typography>

            {/* Tabs */}
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                mb: 5,
                '& .MuiTabs-root': {
                    minHeight: '56px'
                }
            }}>
                <Tabs 
                    value={selectedTab} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: '56px',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            px: 3,
                            '&.Mui-selected': {
                                fontWeight: 600
                            }
                        },
                        '& .MuiTabs-indicator': {
                            height: 3
                        }
                    }}
                >
                    {recordCategories.map((category, index) => (
                        <Tab
                            key={category.id}
                            icon={category.icon}
                            label={category.label}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Records Grid */}
            {filteredRecords.length === 0 ? (
                <Box sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Records Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        No {recordCategories[selectedTab].label.toLowerCase()} available.
                    </Typography>
                </Box>
            ) : (
                <Grid 
                    container 
                    spacing={4} 
                    sx={{ 
                        justifyContent: 'center',
                        '& .MuiGrid-item': {
                            width: { xs: '100%' },
                            '@media (min-width: 600px)': {
                                width: 'calc(50% - 16px)',
                            },
                            '@media (min-width: 900px)': {
                                width: 'calc(33.33% - 22px)',
                            }
                        }
                    }}
                >
                    {filteredRecords.map((record) => (
                        <Grid item key={record.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    minHeight: { 
                                        xs: '460px',
                                        sm: '440px',
                                        md: '420px',
                                        lg: '400px'
                                    },
                                    maxHeight: { 
                                        xs: '460px',
                                        sm: '440px',
                                        md: '420px',
                                        lg: '400px'
                                    },
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[8],
                                    },
                                    borderRadius: 3,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    bgcolor: 'background.paper',
                                    overflow: 'hidden'
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: alpha(theme.palette[getRecordTypeColor(record.type)].main, 0.1),
                                                color: theme.palette[getRecordTypeColor(record.type)].main,
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {getRecordTypeIcon(record.type)}
                                        </Avatar>
                                    }
                                    action={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {record.attachments && record.attachments.length > 0 && (
                                                <Tooltip title="Download Attachments">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => window.open(record.attachments[0], '_blank')}
                                                        sx={{ 
                                                            color: theme.palette[getRecordTypeColor(record.type)].main,
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette[getRecordTypeColor(record.type)].main, 0.1),
                                                            },
                                                        }}
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="View Details">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleOpenModal(record)}
                                                    sx={{ 
                                                        color: theme.palette[getRecordTypeColor(record.type)].main,
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette[getRecordTypeColor(record.type)].main, 0.1),
                                                        },
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                                                {record.title}
                                            </Typography>
                                            <Chip 
                                                label={record.type}
                                                size="small"
                                                color={getRecordTypeColor(record.type)}
                                                sx={{ 
                                                    ml: 1,
                                                    fontWeight: 500,
                                                    height: '24px'
                                                }}
                                            />
                                        </Box>
                                    }
                                    subheader={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <EventIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(record.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        pb: 1.5,
                                        px: 3,
                                        pt: 3,
                                        '& .MuiCardHeader-content': {
                                            overflow: 'hidden'
                                        }
                                    }}
                                />
                                <Divider />
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    overflow: 'auto',
                                    p: 3,
                                    '&:last-child': {
                                        pb: 3
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                            <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
                                                Doctor: {record.doctor}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                            <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
                                                Location: {record.location}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <DescriptionIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: '1.2rem' }} />
                                            <Typography variant="body1" sx={{ 
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: 1.5
                                            }}>
                                                {record.description}
                                            </Typography>
                                        </Box>
                                        {record.attachments && record.attachments.length > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AttachFileIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {record.attachments.length} attachment(s)
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Modal for full card details */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Record Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRecord && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedRecord.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                <b>Type:</b> {selectedRecord.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <b>Date:</b> {new Date(selectedRecord.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <b>Doctor:</b> {selectedRecord.doctor}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <b>Location:</b> {selectedRecord.location}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>{selectedRecord.description}</Typography>
                            {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <b>Attachments:</b> {selectedRecord.attachments.length}
                                    </Typography>
                                    {/* You can add download/view links for attachments here if needed */}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MedicalRecordsPage; 