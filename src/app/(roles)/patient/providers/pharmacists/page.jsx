'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Chip, Button, CircularProgress, Alert } from '@mui/material';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { useGetPharmacistsQuery } from '@/store/services/patient/patientApi';

export default function PharmacistsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: pharmacists, isLoading, error } = useGetPharmacistsQuery();

    const filteredPharmacists = pharmacists?.filter(pharmacist =>
        pharmacist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacist.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacist.address.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <Box className="flex justify-center items-center h-64">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" className="mb-4">
                Failed to load pharmacists. Please try again later.
            </Alert>
        );
    }

    return (
        <Box>
            <Box className="mb-6">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search pharmacists by name or pharmacy..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <MapPin className="h-5 w-5 text-gray-400 mr-2" />,
                    }}
                />
            </Box>

            {filteredPharmacists.length === 0 ? (
                <Box className="text-center py-8">
                    <Typography variant="h6" color="text.secondary">
                        No pharmacists found
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredPharmacists.map((pharmacist) => (
                        <Grid item xs={12} md={6} lg={4} key={pharmacist.id}>
                            <Card className="h-full flex flex-col border border-border bg-card hover:shadow-md transition-shadow">
                                <CardContent className="flex-1">
                                    <Box className="flex items-start justify-between mb-4">
                                        <Box>
                                            <Typography variant="h6" className="font-semibold">
                                                {pharmacist.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {pharmacist.pharmacy}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={`${pharmacist.rating} ★`}
                                            size="small"
                                            className="bg-primary/10 text-primary"
                                        />
                                    </Box>

                                    <Box className="space-y-2">
                                        <Box className="flex items-center text-sm">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                            <Typography variant="body2">
                                                {pharmacist.address}
                                            </Typography>
                                        </Box>
                                        <Box className="flex items-center text-sm">
                                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                            <Typography variant="body2">
                                                {pharmacist.phone}
                                            </Typography>
                                        </Box>
                                        <Box className="flex items-center text-sm">
                                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                            <Typography variant="body2">
                                                {pharmacist.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box className="mt-4 pt-4 border-t border-border">
                                        <Typography variant="body2" color="text.secondary" className="mb-2">
                                            Business Hours:
                                        </Typography>
                                        <Box className="flex flex-wrap gap-2">
                                            {pharmacist.businessHours.map((hours, index) => (
                                                <Chip
                                                    key={index}
                                                    label={hours}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box className="mt-4 pt-4 border-t border-border">
                                        <Typography variant="body2" color="text.secondary" className="mb-2">
                                            Services:
                                        </Typography>
                                        <Box className="flex flex-wrap gap-2">
                                            {pharmacist.services.map((service, index) => (
                                                <Chip
                                                    key={index}
                                                    label={service}
                                                    size="small"
                                                    variant="outlined"
                                                    className="bg-primary/5"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>
                                <Box className="p-4 border-t border-border">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<Clock className="h-4 w-4" />}
                                    >
                                        Check Prescription Status
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
} 