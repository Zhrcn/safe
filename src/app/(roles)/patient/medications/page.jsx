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
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNotification } from '@/components/ui/Notification';
import {
    useGetMedicationsQuery,
    useAddMedicationMutation,
    useUpdateMedicationMutation,
    useDeleteMedicationMutation,
} from '@/store/services/patient/patientApi';

const MedicationCard = ({ medication, onEdit, onDelete }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                {medication.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                Dosage: {medication.dosage}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                Frequency: {medication.frequency}
            </Typography>
            <Typography variant="body2" gutterBottom>
                Start Date: {medication.startDate}
            </Typography>
            {medication.endDate && (
                <Typography variant="body2" gutterBottom>
                    End Date: {medication.endDate}
                </Typography>
            )}
            <Typography variant="body2">
                Instructions: {medication.instructions}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton onClick={() => onEdit(medication)} size="small">
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(medication.id)} size="small" color="error">
                <DeleteIcon />
            </IconButton>
        </CardActions>
    </Card>
);

const MedicationDialog = ({ open, onClose, medication, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: medication?.name || '',
        dosage: medication?.dosage || '',
        frequency: medication?.frequency || '',
        startDate: medication?.startDate || '',
        endDate: medication?.endDate || '',
        instructions: medication?.instructions || '',
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
                    {medication ? 'Edit Medication' : 'New Medication'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="name"
                            label="Medication Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="dosage"
                            label="Dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="frequency"
                            label="Frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="startDate"
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                            fullWidth
                        />
                        <TextField
                            name="endDate"
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            name="instructions"
                            label="Instructions"
                            multiline
                            rows={4}
                            value={formData.instructions}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {medication ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const MedicationsPage = () => {
    const { showNotification } = useNotification();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);

    const { data: medications, isLoading, error } = useGetMedicationsQuery();
    const [addMedication] = useAddMedicationMutation();
    const [updateMedication] = useUpdateMedicationMutation();
    const [deleteMedication] = useDeleteMedicationMutation();

    const handleCreate = async (formData) => {
        try {
            await addMedication(formData).unwrap();
            showNotification('Medication added successfully', 'success');
            setDialogOpen(false);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to add medication', 'error');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateMedication({
                id: selectedMedication.id,
                ...formData,
            }).unwrap();
            showNotification('Medication updated successfully', 'success');
            setDialogOpen(false);
            setSelectedMedication(null);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to update medication', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMedication(id).unwrap();
            showNotification('Medication deleted successfully', 'success');
        } catch (error) {
            showNotification(error.data?.message || 'Failed to delete medication', 'error');
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
                    {error.data?.message || 'Failed to load medications'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Medications</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    Add Medication
                </Button>
            </Box>

            <Grid container spacing={3}>
                {medications?.map((medication) => (
                    <Grid item xs={12} sm={6} md={4} key={medication.id}>
                        <MedicationCard
                            medication={medication}
                            onEdit={(medication) => {
                                setSelectedMedication(medication);
                                setDialogOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    </Grid>
                ))}
                {(!medications || medications.length === 0) && (
                    <Grid item xs={12}>
                        <Alert severity="info">No medications found</Alert>
                    </Grid>
                )}
            </Grid>

            <MedicationDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedMedication(null);
                }}
                medication={selectedMedication}
                onSubmit={selectedMedication ? handleUpdate : handleCreate}
            />
        </Box>
    );
};

export default MedicationsPage; 