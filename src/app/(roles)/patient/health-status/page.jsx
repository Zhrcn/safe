'use client';

import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { useGetHealthStatusQuery, useUpdateHealthStatusMutation } from '@/store/services/patient/patientApi';
import { HeartPulse, Activity, Thermometer, Droplet, Scale } from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';

const VitalSignCard = ({ title, value, unit, icon: Icon }) => (
    <Card>
        <CardContent>
            <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" component="h3">
                    {title}
                </Typography>
                <Icon className="text-primary" size={24} />
            </Box>
            <Typography variant="h4" component="p" className="mb-1">
                {value || '--'} {unit}
            </Typography>
        </CardContent>
    </Card>
);

const ConditionCard = ({ condition }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" component="h3" className="mb-2">
                {condition.name}
            </Typography>
            <Box className="flex items-center gap-2">
                <Typography variant="body2" color="text.secondary">
                    Status: {condition.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Severity: {condition.severity}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const AllergyCard = ({ allergy }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" component="h3" className="mb-2">
                {allergy.name}
            </Typography>
            <Box className="flex items-center gap-2">
                <Typography variant="body2" color="text.secondary">
                    Severity: {allergy.severity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Reaction: {allergy.reaction}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export default function HealthStatusPage() {
    const { data: healthStatus, isLoading, error } = useGetHealthStatusQuery();
    const [updateHealthStatus] = useUpdateHealthStatusMutation();

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
                    Error loading health status. Please try again later.
                </Alert>
            </Box>
        );
    }

    const { vitalSigns, medicalConditions, allergies } = healthStatus || {};

    return (
        <Box className="container mx-auto px-4 py-8">
            <PageHeader
                title="Health Status"
                description="View and manage your health information"
            />

            {/* Vital Signs */}
            <Box className="mb-8">
                <Typography variant="h5" component="h2" className="mb-4">
                    Vital Signs
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <VitalSignCard
                            title="Blood Pressure"
                            value={vitalSigns?.bloodPressure}
                            unit="mmHg"
                            icon={Activity}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <VitalSignCard
                            title="Heart Rate"
                            value={vitalSigns?.heartRate}
                            unit="bpm"
                            icon={HeartPulse}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <VitalSignCard
                            title="Temperature"
                            value={vitalSigns?.temperature}
                            unit="°F"
                            icon={Thermometer}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <VitalSignCard
                            title="Blood Oxygen"
                            value={vitalSigns?.bloodOxygen}
                            unit="%"
                            icon={Droplet}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <VitalSignCard
                            title="Weight"
                            value={vitalSigns?.weight}
                            unit="kg"
                            icon={Scale}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Medical Conditions */}
            <Box className="mb-8">
                <Typography variant="h5" component="h2" className="mb-4">
                    Medical Conditions
                </Typography>
                <Grid container spacing={3}>
                    {medicalConditions?.map((condition) => (
                        <Grid item xs={12} sm={6} md={4} key={condition._id}>
                            <ConditionCard condition={condition} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Allergies */}
            <Box className="mb-8">
                <Typography variant="h5" component="h2" className="mb-4">
                    Allergies
                </Typography>
                <Grid container spacing={3}>
                    {allergies?.map((allergy) => (
                        <Grid item xs={12} sm={6} md={4} key={allergy._id}>
                            <AllergyCard allergy={allergy} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
} 