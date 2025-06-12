'use client';

import { Box, Card, Typography, Chip, Button } from '@mui/material';
import { Pill, Clock, AlertCircle } from 'lucide-react';

export default function MedicationCard({ medications = [] }) {
    // Add debug logging
    console.log('MedicationCard received medications:', medications);

    if (!medications?.length) {
        return (
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography color="text.secondary" align="center">
                    No active medications
                </Typography>
            </Card>
        );
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'completed':
                return 'info';
            case 'discontinued':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDosage = (dosage, unit) => {
        if (!dosage) return 'Dosage not specified';
        return `${dosage}${unit ? ` ${unit}` : ''}`;
    };

    const formatFrequency = (frequency) => {
        if (!frequency) return 'Frequency not specified';
        return frequency;
    };

    return (
        <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Medications
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {medications.map((medication, index) => (
                    <Box
                        key={medication?.id || index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {medication?.name || 'Unknown Medication'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {medication?.type || 'Prescription'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <Pill size={14} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDosage(medication?.dosage, medication?.unit)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                                <Clock size={14} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatFrequency(medication?.frequency)}
                                </Typography>
                            </Box>
                            {medication?.notes && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                                    <AlertCircle size={14} />
                                    <Typography variant="body2" color="text.secondary">
                                        {medication.notes}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Chip
                                label={medication?.status || 'Unknown'}
                                color={getStatusColor(medication?.status)}
                                size="small"
                            />
                            <Button variant="outlined" size="small">
                                Details
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Card>
    );
} 