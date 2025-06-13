'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Stack,
    Avatar,
    Tooltip,
    useTheme,
    alpha,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    Medication as MedicationIcon,
    CalendarMonth as CalendarIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Warning as AlertCircleIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    QrCode as QrCodeIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import PageHeader from '@/components/patient/PageHeader';
import { mockPatientData } from '@/mockdata/patientData';

const PrescriptionCard = ({ prescription, onShowQR, onViewDetails }) => {
    const theme = useTheme();
    const statusColors = {
        active: 'success',
        completed: 'info',
        expired: 'error',
        pending: 'warning',
    };

    const statusIcons = {
        active: <CheckIcon />,
        completed: <CheckIcon />,
        expired: <CloseIcon />,
        pending: <AlertCircleIcon />,
    };

    return (
        <Card 
            elevation={0}
            sx={{
                height: '280px',
                width: '100%',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                    '& .prescription-actions': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                }}
            />
            <CardContent sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                            sx={{ 
                                width: 48,
                                height: 48,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        >
                            <PersonIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {prescription.doctorName}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(prescription.date).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Chip
                        icon={statusIcons[prescription.status]}
                        label={prescription.status}
                        color={statusColors[prescription.status]}
                        size="small"
                    />
                </Box>

                <Stack spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
                    {prescription.medications.map((medication, index) => (
                        <Box 
                            key={index}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                    }}
                                >
                                    <MedicationIcon />
                                </Box>
                                <Typography variant="subtitle1" fontWeight="medium" noWrap>
                                    {medication.name}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {medication.dosage} - {medication.frequency}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                <Box 
                    className="prescription-actions"
                    display="flex" 
                    gap={1} 
                    sx={{
                        mt: 2,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={() => onViewDetails(prescription)}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                }
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Tooltip title="Show QR Code">
                            <IconButton
                                size="small"
                                onClick={() => onShowQR(prescription)}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                    }
                                }}
                            >
                                <QrCodeIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Download">
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                }
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                }
                            }}
                        >
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

const PrescriptionDetailDialog = ({ open, onClose, prescription, onShowQR }) => {
    const theme = useTheme();

    const statusColors = {
        active: 'success',
        completed: 'info',
        expired: 'error',
        pending: 'warning',
    };

    const statusIcons = {
        active: <CheckIcon />,
        completed: <CheckIcon />,
        expired: <CloseIcon />,
        pending: <AlertCircleIcon />,
    };

    if (!prescription) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }
            }}
        >
            <DialogTitle sx={{ 
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                pb: 2
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar 
                        sx={{ 
                            width: 40,
                            height: 40,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                        }}
                    >
                        <MedicationIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            Prescription Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ID: {prescription.id}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                    {/* Doctor Information */}
                    <Grid item xs={12}>
                        <Box 
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Avatar 
                                        sx={{ 
                                            width: 64,
                                            height: 64,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        <PersonIcon />
                                    </Avatar>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h5" gutterBottom>
                                        {prescription.doctorName}
                                    </Typography>
                                    <Box display="flex" gap={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CalendarIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Prescribed on {new Date(prescription.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AccessTimeIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Last updated {new Date(prescription.lastUpdated).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Chip
                                        icon={statusIcons[prescription.status]}
                                        label={prescription.status}
                                        color={statusColors[prescription.status]}
                                        sx={{ 
                                            px: 1,
                                            '& .MuiChip-icon': {
                                                color: 'inherit',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Medications */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MedicationIcon color="primary" />
                            Medications
                        </Typography>
                        <Stack spacing={2}>
                            {prescription.medications.map((medication, index) => (
                                <Box 
                                    key={index}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                            borderColor: alpha(theme.palette.primary.main, 0.2),
                                        },
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        borderRadius: 1,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                    }}
                                                >
                                                    <MedicationIcon />
                                                </Box>
                                                <Typography variant="subtitle1" fontWeight="medium">
                                                    {medication.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Dosage:</strong>
                                            </Typography>
                                            <Typography variant="body1">
                                                {medication.dosage}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Frequency:</strong>
                                            </Typography>
                                            <Typography variant="body1">
                                                {medication.frequency}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Duration:</strong>
                                            </Typography>
                                            <Typography variant="body1">
                                                {medication.duration}
                                            </Typography>
                                        </Grid>
                                        {medication.refills > 0 && (
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    <strong>Refills:</strong>
                                                </Typography>
                                                <Typography variant="body1">
                                                    {medication.refills} remaining
                                                </Typography>
                                            </Grid>
                                        )}
                                        {medication.instructions && (
                                            <Grid item xs={12}>
                                                <Box 
                                                    sx={{ 
                                                        mt: 1.5,
                                                        pt: 1.5,
                                                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        <strong>Instructions:</strong>
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {medication.instructions}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Notes */}
                    {prescription.notes && (
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AlertCircleIcon color="info" />
                                Additional Notes
                            </Typography>
                            <Box 
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.info.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                                }}
                            >
                                <Typography variant="body1" color="text.secondary">
                                    {prescription.notes}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ 
                px: 3, 
                py: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                gap: 1
            }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                >
                    Close
                </Button>
                {(prescription.status === 'active' || prescription.status === 'pending') && (
                    <Button 
                        variant="outlined"
                        startIcon={<QrCodeIcon />}
                        onClick={() => {
                            onClose();
                            onShowQR(prescription);
                        }}
                    >
                        Show QR Code
                    </Button>
                )}
                <Button 
                    variant="contained" 
                    startIcon={<DownloadIcon />}
                >
                    Download
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={<PrintIcon />}
                >
                    Print
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const QRCodeDialog = ({ open, onClose, prescription }) => {
    const theme = useTheme();

    if (!prescription) return null;

    const qrValue = JSON.stringify({
        prescriptionId: prescription.id,
        doctorName: prescription.doctorName,
        date: prescription.date,
        status: prescription.status,
        medications: prescription.medications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions
        }))
    });

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <QrCodeIcon color="primary" />
                    <Typography variant="h6">
                        Prescription QR Code
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    gap={2}
                    sx={{ py: 2 }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <QRCodeSVG 
                            value={qrValue}
                            size={200}
                            level="H"
                            includeMargin
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Scan this QR code to view prescription details
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button 
                    variant="contained" 
                    startIcon={<DownloadIcon />}
                >
                    Download QR
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const PrescriptionsPage = () => {
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API call with mock data
        const loadPrescriptions = async () => {
            try {
                setIsLoading(true);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setPrescriptions(mockPatientData.prescriptions);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadPrescriptions();
    }, []);

    const handleShowQR = (prescription) => {
        setSelectedPrescription(prescription);
        setQrDialogOpen(true);
    };

    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPrescription(null);
    };

    const handleCloseQrDialog = () => {
        setQrDialogOpen(false);
        setSelectedPrescription(null);
    };

    const handleRetry = () => {
        setIsLoading(true);
        // Simulate API call with mock data
        setTimeout(() => {
            setPrescriptions(mockPatientData.prescriptions);
            setError(null);
            setIsLoading(false);
        }, 1000);
    };

    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                gap: 2
            }}>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary">
                    Loading prescriptions...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography color="error" variant="h6">
                    Error loading prescriptions
                </Typography>
                <Typography color="error" variant="body1">
                    {error.message || 'An unexpected error occurred'}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={handleRetry}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    if (!prescriptions || prescriptions.length === 0) {
        return (
            <Box sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="h6" color="text.secondary">
                    No prescriptions found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    You don't have any prescriptions at the moment.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            <PageHeader
                title="Prescriptions"
                subtitle="View and manage your prescriptions"
            />

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(3, 1fr)' 
                }, 
                gap: 3, 
                mt: 3 
            }}>
                {prescriptions.map((prescription) => (
                    <Box key={prescription.id}>
                        <PrescriptionCard
                            prescription={prescription}
                            onShowQR={handleShowQR}
                            onViewDetails={handleViewDetails}
                        />
                    </Box>
                ))}
            </Box>

            <PrescriptionDetailDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                prescription={selectedPrescription}
                onShowQR={handleShowQR}
            />

            <QRCodeDialog
                open={qrDialogOpen}
                onClose={handleCloseQrDialog}
                prescription={selectedPrescription}
            />
        </Box>
    );
};

export default PrescriptionsPage; 