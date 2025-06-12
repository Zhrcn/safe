'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Alert, Grid } from '@mui/material';
import { useGetInsuranceQuery, useUpdateInsuranceMutation } from '@/store/services/patient/patientApi';
import { Shield, CreditCard, FileText, Calendar } from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';

const InsuranceInfoCard = ({ title, value, icon: Icon }) => (
    <Card>
        <CardContent>
            <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" component="h3">
                    {title}
                </Typography>
                <Icon className="text-primary" size={24} />
            </Box>
            <Typography variant="body1" component="p">
                {value || 'Not provided'}
            </Typography>
        </CardContent>
    </Card>
);

const CoverageCard = ({ title, covered, details }) => (
    <Card>
        <CardContent>
            <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" component="h3">
                    {title}
                </Typography>
                <Box
                    className={`px-2 py-1 rounded-full text-sm ${
                        covered ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
                    }`}
                >
                    {covered ? 'Covered' : 'Not Covered'}
                </Box>
            </Box>
            {details && (
                <Typography variant="body2" color="text.secondary">
                    {details}
                </Typography>
            )}
        </CardContent>
    </Card>
);

export default function InsurancePage() {
    const { data: insurance, isLoading, error } = useGetInsuranceQuery();
    const [updateInsurance] = useUpdateInsuranceMutation();

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center min-h-[400px]">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-4">
                <Alert severity="error">
                    Error loading insurance information. Please try again later.
                </Alert>
            </Box>
        );
    }

    const { provider, policyNumber, groupNumber, coverageDetails } = insurance || {};

    return (
        <Box className="container mx-auto px-4 py-8">
            <PageHeader
                title="Insurance Information"
                description="View and manage your insurance details"
            />

            {/* Insurance Details */}
            <Box className="mb-8">
                <Typography variant="h5" component="h2" className="mb-4">
                    Insurance Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <InsuranceInfoCard
                            title="Insurance Provider"
                            value={provider}
                            icon={Shield}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InsuranceInfoCard
                            title="Policy Number"
                            value={policyNumber}
                            icon={CreditCard}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InsuranceInfoCard
                            title="Group Number"
                            value={groupNumber}
                            icon={FileText}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InsuranceInfoCard
                            title="Last Updated"
                            value={insurance?.lastUpdated ? new Date(insurance.lastUpdated).toLocaleDateString() : null}
                            icon={Calendar}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Coverage Details */}
            <Box className="mb-8">
                <Typography variant="h5" component="h2" className="mb-4">
                    Coverage Details
                </Typography>
                <Grid container spacing={3}>
                    {coverageDetails?.map((coverage, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <CoverageCard
                                title={coverage.type}
                                covered={coverage.covered}
                                details={coverage.details}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box className="flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        // TODO: Implement edit functionality
                    }}
                >
                    Update Insurance Information
                </Button>
            </Box>
        </Box>
    );
} 