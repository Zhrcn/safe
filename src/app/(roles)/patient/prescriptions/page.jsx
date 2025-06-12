'use client';

import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';
import { useGetPrescriptionsQuery } from '@/store/services/patient/patientApi';

const PrescriptionCard = ({ prescription }) => (
    <Card>
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6">
                    {prescription.medicationName}
                </Typography>
                <Chip
                    label={prescription.status}
                    color={
                        prescription.status === 'active'
                            ? 'success'
                            : prescription.status === 'completed'
                            ? 'info'
                            : 'error'
                    }
                    size="small"
                />
            </Box>
            <Typography color="textSecondary" gutterBottom>
                Prescribed by: {prescription.doctorName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                Date: {prescription.date}
            </Typography>
            <Typography variant="body2" gutterBottom>
                Dosage: {prescription.dosage}
            </Typography>
            <Typography variant="body2" gutterBottom>
                Frequency: {prescription.frequency}
            </Typography>
            <Typography variant="body2">
                Instructions: {prescription.instructions}
            </Typography>
        </CardContent>
    </Card>
);

const PrescriptionsPage = () => {
    const { data: prescriptions, isLoading, error } = useGetPrescriptionsQuery();

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
                    {error.data?.message || 'Failed to load prescriptions'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Prescriptions
            </Typography>

            <Grid container spacing={3}>
                {prescriptions?.map((prescription) => (
                    <Grid item xs={12} sm={6} md={4} key={prescription.id}>
                        <PrescriptionCard prescription={prescription} />
                    </Grid>
                ))}
                {(!prescriptions || prescriptions.length === 0) && (
                    <Grid item xs={12}>
                        <Alert severity="info">No prescriptions found</Alert>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default PrescriptionsPage; 