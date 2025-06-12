import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import { addMedication } from '@/store/slices/patient/profileSlice';

const AddMedicationDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        prescribedBy: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Medication name is required';
        }
        if (!formData.dosage.trim()) {
            newErrors.dosage = 'Dosage is required';
        }
        if (!formData.frequency) {
            newErrors.frequency = 'Frequency is required';
        }
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }
        if (!formData.prescribedBy.trim()) {
            newErrors.prescribedBy = 'Prescribing doctor is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await dispatch(addMedication(formData)).unwrap();
                onClose();
                setFormData({
                    name: '',
                    dosage: '',
                    frequency: '',
                    startDate: '',
                    endDate: '',
                    prescribedBy: '',
                    notes: ''
                });
            } catch (error) {
                setErrors({
                    submit: error
                });
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Medication</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            name="name"
                            label="Medication Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />

                        <TextField
                            name="dosage"
                            label="Dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            error={!!errors.dosage}
                            helperText={errors.dosage}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth error={!!errors.frequency} required>
                            <InputLabel>Frequency</InputLabel>
                            <Select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                label="Frequency"
                            >
                                <MenuItem value="once_daily">Once Daily</MenuItem>
                                <MenuItem value="twice_daily">Twice Daily</MenuItem>
                                <MenuItem value="three_times_daily">Three Times Daily</MenuItem>
                                <MenuItem value="four_times_daily">Four Times Daily</MenuItem>
                                <MenuItem value="as_needed">As Needed</MenuItem>
                            </Select>
                            {errors.frequency && (
                                <Box color="error.main" fontSize="0.75rem" mt={1}>
                                    {errors.frequency}
                                </Box>
                            )}
                        </FormControl>

                        <TextField
                            name="startDate"
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            name="endDate"
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            name="prescribedBy"
                            label="Prescribed By"
                            value={formData.prescribedBy}
                            onChange={handleChange}
                            error={!!errors.prescribedBy}
                            helperText={errors.prescribedBy}
                            fullWidth
                            required
                        />

                        <TextField
                            name="notes"
                            label="Additional Notes"
                            value={formData.notes}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />

                        {errors.submit && (
                            <Box color="error.main" fontSize="0.75rem">
                                {errors.submit}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Add Medication
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddMedicationDialog; 