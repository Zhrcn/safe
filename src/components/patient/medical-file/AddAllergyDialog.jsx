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
import { addAllergy } from '@/store/slices/patient/profileSlice';

const AddAllergyDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        severity: '',
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
            newErrors.name = 'Allergy name is required';
        }
        if (!formData.severity) {
            newErrors.severity = 'Severity level is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await dispatch(addAllergy(formData)).unwrap();
                onClose();
                setFormData({
                    name: '',
                    severity: '',
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
            <DialogTitle>Add New Allergy</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            name="name"
                            label="Allergy Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />

                        <FormControl fullWidth error={!!errors.severity} required>
                            <InputLabel>Severity</InputLabel>
                            <Select
                                name="severity"
                                value={formData.severity}
                                onChange={handleChange}
                                label="Severity"
                            >
                                <MenuItem value="mild">Mild</MenuItem>
                                <MenuItem value="moderate">Moderate</MenuItem>
                                <MenuItem value="severe">Severe</MenuItem>
                            </Select>
                            {errors.severity && (
                                <Box color="error.main" fontSize="0.75rem" mt={1}>
                                    {errors.severity}
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
                        Add Allergy
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddAllergyDialog; 