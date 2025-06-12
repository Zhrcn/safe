'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useNotification } from '@/components/ui/Notification';
import {
    useGetConsultationsQuery,
    useCreateConsultationMutation,
    useUpdateConsultationMutation,
} from '@/store/services/patient/patientApi';

const ConsultationCard = ({ consultation, onEdit }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                {consultation.doctorName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                Type: {consultation.type}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                Date: {consultation.date} at {consultation.time}
            </Typography>
            <Typography variant="body2">
                Notes: {consultation.notes}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton onClick={() => onEdit(consultation)} size="small">
                <EditIcon />
            </IconButton>
        </CardActions>
    </Card>
);

const ConsultationDialog = ({ open, onClose, consultation, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: consultation?.type || '',
        doctorId: consultation?.doctorId || '',
        date: consultation?.date || '',
        time: consultation?.time || '',
        notes: consultation?.notes || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {consultation ? 'Edit Consultation' : 'New Consultation'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="type"
                            label="Consultation Type"
                            select
                            value={formData.type}
                            onChange={handleChange}
                            required
                            fullWidth
                        >
                            <MenuItem value="general">General Checkup</MenuItem>
                            <MenuItem value="follow-up">Follow-up</MenuItem>
                            <MenuItem value="specialist">Specialist</MenuItem>
                            <MenuItem value="emergency">Emergency</MenuItem>
                        </TextField>
                        <TextField
                            name="doctorId"
                            label="Doctor"
                            select
                            value={formData.doctorId}
                            onChange={handleChange}
                            required
                            fullWidth
                        >
                            <MenuItem value="1">Dr. John Doe</MenuItem>
                            <MenuItem value="2">Dr. Jane Smith</MenuItem>
                        </TextField>
                        <TextField
                            name="date"
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                            fullWidth
                        />
                        <TextField
                            name="time"
                            label="Time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                            fullWidth
                        />
                        <TextField
                            name="notes"
                            label="Notes"
                            multiline
                            rows={4}
                            value={formData.notes}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {consultation ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const ConsultationsPage = () => {
    const { showNotification } = useNotification();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    const { data: consultations, isLoading, error } = useGetConsultationsQuery();
    const [createConsultation] = useCreateConsultationMutation();
    const [updateConsultation] = useUpdateConsultationMutation();

    const handleCreate = async (formData) => {
        try {
            await createConsultation(formData).unwrap();
            showNotification('Consultation created successfully', 'success');
            setDialogOpen(false);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to create consultation', 'error');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateConsultation({
                id: selectedConsultation.id,
                ...formData,
            }).unwrap();
            showNotification('Consultation updated successfully', 'success');
            setDialogOpen(false);
            setSelectedConsultation(null);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to update consultation', 'error');
        }
    };

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
                    {error.data?.message || 'Failed to load consultations'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Consultations</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    New Consultation
                </Button>
            </Box>

            <Grid container spacing={3}>
                {consultations?.map((consultation) => (
                    <Grid item xs={12} sm={6} md={4} key={consultation.id}>
                        <ConsultationCard
                            consultation={consultation}
                            onEdit={(consultation) => {
                                setSelectedConsultation(consultation);
                                setDialogOpen(true);
                            }}
                        />
                    </Grid>
                ))}
                {(!consultations || consultations.length === 0) && (
                    <Grid item xs={12}>
                        <Alert severity="info">No consultations found</Alert>
                    </Grid>
                )}
            </Grid>

            <ConsultationDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedConsultation(null);
                }}
                consultation={selectedConsultation}
                onSubmit={selectedConsultation ? handleUpdate : handleCreate}
            />
        </Box>
    );
};

export default ConsultationsPage;
