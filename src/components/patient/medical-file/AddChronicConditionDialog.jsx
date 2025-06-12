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
import { addChronicCondition } from '@/store/slices/patient/profileSlice';

const AddChronicConditionDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        diagnosisDate: '',
        status: '',
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
            newErrors.name = 'Condition name is required';
        }
        if (!formData.diagnosisDate) {
            newErrors.diagnosisDate = 'Diagnosis date is required';
        }
        if (!formData.status) {
            newErrors.status = 'Status is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await dispatch(addChronicCondition(formData)).unwrap();
                onClose();
                setFormData({
                    name: '',
                    diagnosisDate: '',
                    status: '',
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
            <DialogTitle>Add Chronic Condition</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            name="name"
                            label="Condition Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />

                        <TextField
                            name="diagnosisDate"
                            label="Diagnosis Date"
                            type="date"
                            value={formData.diagnosisDate}
                            onChange={handleChange}
                            error={!!errors.diagnosisDate}
                            helperText={errors.diagnosisDate}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <FormControl fullWidth error={!!errors.status} required>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="in_remission">In Remission</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                            </Select>
                            {errors.status && (
                                <Box color="error.main" fontSize="0.75rem" mt={1}>
                                    {errors.status}
                                </Box>
                            )}
                        </FormControl>

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
                        Add Condition
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddChronicConditionDialog; 