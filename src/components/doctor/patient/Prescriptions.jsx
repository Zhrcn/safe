import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import { fetchPrescriptionsByPatient } from '../../../store/slices/doctor/doctorPrescriptionsSlice';
import { createPrescription, updatePrescription } from '../../../store/slices/doctor/doctorPrescriptionsSlice';

const PrescriptionPaper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius
}));

const Prescriptions = ({ patientId }) => {
    const dispatch = useDispatch();
    const { prescriptions, loading } = useSelector((state) => state.doctorPrescriptions);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedPrescription, setSelectedPrescription] = React.useState(null);
    const [formData, setFormData] = React.useState({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        status: 'active'
    });

    useEffect(() => {
        dispatch(fetchPrescriptionsByPatient(patientId));
    }, [dispatch, patientId]);

    const handleOpenDialog = (prescription = null) => {
        if (prescription) {
            setSelectedPrescription(prescription);
            setFormData({
                medication: prescription.medication,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
                duration: prescription.duration,
                instructions: prescription.instructions,
                status: prescription.status
            });
        } else {
            setSelectedPrescription(null);
            setFormData({
                medication: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: '',
                status: 'active'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPrescription(null);
        setFormData({
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: '',
            status: 'active'
        });
    };

    const handleSubmit = () => {
        const prescriptionData = {
            ...formData,
            patientId,
            date: new Date().toISOString()
        };

        if (selectedPrescription) {
            dispatch(updatePrescription({
                id: selectedPrescription.id,
                ...prescriptionData
            }));
        } else {
            dispatch(createPrescription(prescriptionData));
        }
        handleCloseDialog();
    };

    const handlePrint = (prescription) => {
        // Implement print functionality
        console.log('Printing prescription:', prescription);
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'info';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography>Loading prescriptions...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Prescriptions</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    New Prescription
                </Button>
            </Box>

            <List>
                {prescriptions.map((prescription, index) => (
                    <React.Fragment key={prescription.id}>
                        <PrescriptionPaper>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1">
                                        {prescription.medication}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Prescribed on: {formatDate(prescription.date)}
                                    </Typography>
                                    <Box display="flex" gap={1} mt={1}>
                                        <Chip
                                            label={prescription.status}
                                            color={getStatusColor(prescription.status)}
                                            size="small"
                                        />
                                        <Chip
                                            label={`${prescription.dosage} - ${prescription.frequency}`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(prescription)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handlePrint(prescription)}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Duration: {prescription.duration}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Instructions: {prescription.instructions}
                            </Typography>
                        </PrescriptionPaper>
                        {index < prescriptions.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Medication"
                                value={formData.medication}
                                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dosage"
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Frequency"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Duration"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Status"
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Instructions"
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedPrescription ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Prescriptions; 