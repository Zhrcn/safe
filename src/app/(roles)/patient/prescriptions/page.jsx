'use client';

import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';

const PrescriptionCard = ({ prescription, onShowQR }) => {
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
                height: '100%',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
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
            <CardContent sx={{ pt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
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
                        label={prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        color={statusColors[prescription.status]}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                color: 'inherit',
                            },
                        }}
                    />
                </Box>

                <Stack spacing={2} mb={3}>
                    {prescription.medications.map((medication) => (
                        <Box 
                            key={medication.id}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Dosage:</strong> {medication.dosage}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Frequency:</strong> {medication.frequency}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Duration:</strong> {medication.duration}
                                    </Typography>
                                </Grid>
                                {medication.refills > 0 && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Refills:</strong> {medication.refills}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                            {medication.instructions && (
                                <Box 
                                    sx={{ 
                                        mt: 1.5,
                                        pt: 1.5,
                                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Instructions:</strong> {medication.instructions}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Stack>

                {prescription.notes && (
                    <Box 
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            <strong>Notes:</strong> {prescription.notes}
                        </Typography>
                    </Box>
                )}

                <Box 
                    className="prescription-actions"
                    display="flex" 
                    gap={1} 
                    sx={{
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {prescription.status === 'pending' && (
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<QrCodeIcon />}
                            onClick={() => onShowQR(prescription)}
                            sx={{ 
                                flex: 1,
                                py: 1,
                                fontWeight: 600,
                            }}
                        >
                            Show QR Code
                        </Button>
                    )}
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{ 
                            flex: 1,
                            py: 1,
                            fontWeight: 600,
                        }}
                    >
                        Download
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        sx={{ 
                            flex: 1,
                            py: 1,
                            fontWeight: 600,
                        }}
                    >
                        Print
                    </Button>
                </Box>
            </CardContent>
        </Card>
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
                            boxShadow: 1,
                        }}
                    >
                        <QRCodeSVG 
                            value={qrValue}
                            size={200}
                            level="H"
                            includeMargin
                            bgColor={theme.palette.background.paper}
                            fgColor={theme.palette.primary.main}
                        />
                    </Box>
                    <Stack spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                            {prescription.doctorName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Prescribed on {new Date(prescription.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            Show this QR code to the pharmacist to collect your medication
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button 
                    variant="contained" 
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                >
                    Print QR Code
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const PrescriptionsPage = () => {
    const [prescriptions, setPrescriptions] = useState(mockPatientData.prescriptions);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);

    const handleOpenDialog = (prescription) => {
        setSelectedPrescription(prescription);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPrescription(null);
    };

    const handleShowQR = (prescription) => {
        setSelectedPrescription(prescription);
        setQrDialogOpen(true);
    };

    const handleCloseQR = () => {
        setQrDialogOpen(false);
        setSelectedPrescription(null);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            <PageHeader
                title="Prescriptions"
                subtitle="View and manage your medication prescriptions"
            />

            <Grid container spacing={3}>
                {prescriptions.map((prescription) => (
                    <Grid item xs={12} md={6} key={prescription.id}>
                        <PrescriptionCard
                            prescription={prescription}
                            onShowQR={handleShowQR}
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog 
                open={dialogOpen} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Prescription Details
                </DialogTitle>
                <DialogContent>
                    {selectedPrescription && (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Typography variant="h6">
                                {selectedPrescription.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Prescribed on {new Date(selectedPrescription.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                                {selectedPrescription.notes}
                            </Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>

            <QRCodeDialog
                open={qrDialogOpen}
                onClose={handleCloseQR}
                prescription={selectedPrescription}
            />
        </Box>
    );
};

export default PrescriptionsPage; 