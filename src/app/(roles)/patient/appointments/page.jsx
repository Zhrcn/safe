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
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNotification } from '@/components/ui/Notification';
import {
    useGetAppointmentsQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
} from '@/store/services/patient/patientApi';

const AppointmentCard = ({ appointment, onEdit, onDelete }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                {appointment.doctorName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                {appointment.date} at {appointment.time}
            </Typography>
            <Typography variant="body2">
                Reason: {appointment.reason}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton onClick={() => onEdit(appointment)} size="small">
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(appointment.id)} size="small" color="error">
                <DeleteIcon />
            </IconButton>
        </CardActions>
    </Card>
);

const AppointmentDialog = ({ open, onClose, appointment, onSubmit }) => {
    const [formData, setFormData] = useState({
        date: appointment?.date || '',
        time: appointment?.time || '',
        doctorId: appointment?.doctorId || '',
        reason: appointment?.reason || '',
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
                    {appointment ? 'Edit Appointment' : 'New Appointment'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                            name="reason"
                            label="Reason"
                            multiline
                            rows={4}
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {appointment ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const AppointmentsPage = () => {
    const { showNotification } = useNotification();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const { data: appointments, isLoading, error } = useGetAppointmentsQuery();
    const [createAppointment] = useCreateAppointmentMutation();
    const [updateAppointment] = useUpdateAppointmentMutation();
    const [deleteAppointment] = useDeleteAppointmentMutation();

    const handleCreate = async (formData) => {
        try {
            await createAppointment(formData).unwrap();
            showNotification('Appointment created successfully', 'success');
            setDialogOpen(false);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to create appointment', 'error');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateAppointment({
                id: selectedAppointment.id,
                ...formData,
            }).unwrap();
            showNotification('Appointment updated successfully', 'success');
            setDialogOpen(false);
            setSelectedAppointment(null);
        } catch (error) {
            showNotification(error.data?.message || 'Failed to update appointment', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAppointment(id).unwrap();
            showNotification('Appointment deleted successfully', 'success');
        } catch (error) {
            showNotification(error.data?.message || 'Failed to delete appointment', 'error');
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
                    {error.data?.message || 'Failed to load appointments'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Appointments</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    New Appointment
                </Button>
            </Box>

            <Grid container spacing={3}>
                {appointments?.map((appointment) => (
                    <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                        <AppointmentCard
                            appointment={appointment}
                            onEdit={(appointment) => {
                                setSelectedAppointment(appointment);
                                setDialogOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    </Grid>
                ))}
                {(!appointments || appointments.length === 0) && (
                    <Grid item xs={12}>
                        <Alert severity="info">No appointments found</Alert>
                    </Grid>
                )}
            </Grid>

            <AppointmentDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
                onSubmit={selectedAppointment ? handleUpdate : handleCreate}
            />
        </Box>
    );
};

export default AppointmentsPage;
