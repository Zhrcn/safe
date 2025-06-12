'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Chip, Button, CircularProgress, Alert } from '@mui/material';
import { Award, MapPin, Phone, Mail, Calendar, Star } from 'lucide-react';
import { useGetDoctorsQuery } from '@/store/services/patient/patientApi';

export default function DoctorsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: doctors, isLoading, error } = useGetDoctorsQuery();

    const filteredDoctors = doctors?.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
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
                Failed to load doctors. Please try again later.
            </Alert>
        );
    }

    return (
        <Box>
            <Box className="mb-6">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search doctors by name, specialty, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Award className="h-5 w-5 text-gray-400 mr-2" />,
                    }}
                />
            </Box>

            {filteredDoctors.length === 0 ? (
                <Box className="text-center py-8">
                    <Typography variant="h6" color="text.secondary">
                        No doctors found
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredDoctors.map((doctor) => (
                        <Grid item xs={12} md={6} lg={4} key={doctor.id}>
                            <Card className="h-full flex flex-col border border-border bg-card hover:shadow-md transition-shadow">
                                <CardContent className="flex-1">
                                    <Box className="flex items-start justify-between mb-4">
                                        <Box>
                                            <Typography variant="h6" className="font-semibold">
                                                {doctor.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {doctor.specialty}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={`${doctor.rating} ★`}
                                            size="small"
                                            className="bg-primary/10 text-primary"
                                        />
                                    </Box>

                                    <Box className="space-y-2">
                                        <Box className="flex items-center text-sm">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                            <Typography variant="body2">
                                                {doctor.hospital}
                                            </Typography>
                                        </Box>
                                        <Box className="flex items-center text-sm">
                                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                            <Typography variant="body2">
                                                {doctor.phone}
                                            </Typography>
                                        </Box>
                                        <Box className="flex items-center text-sm">
                                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                            <Typography variant="body2">
                                                {doctor.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box className="mt-4 pt-4 border-t border-border">
                                        <Typography variant="body2" color="text.secondary" className="mb-2">
                                            Available Hours:
                                        </Typography>
                                        <Box className="flex flex-wrap gap-2">
                                            {doctor.availableHours.map((hours, index) => (
                                                <Chip
                                                    key={index}
                                                    label={hours}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>
                                <Box className="p-4 border-t border-border">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<Calendar className="h-4 w-4" />}
                                    >
                                        Book Appointment
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