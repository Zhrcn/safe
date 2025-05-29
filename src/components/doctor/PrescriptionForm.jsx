'use client';

import { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Grid, 
    Typography, 
    Paper,
    Alert,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Autocomplete,
    FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { createPrescription, queryMedicineAvailability } from '@/services/doctorService';

// Common medications for autocomplete
const commonMedications = [
    'Lisinopril 10mg',
    'Lisinopril 20mg',
    'Metformin 500mg',
    'Metformin 1000mg',
    'Atorvastatin 10mg',
    'Atorvastatin 20mg',
    'Levothyroxine 50mcg',
    'Levothyroxine 100mcg',
    'Amlodipine 5mg',
    'Amlodipine 10mg',
    'Omeprazole 20mg',
    'Simvastatin 20mg',
    'Metoprolol 25mg',
    'Metoprolol 50mg',
    'Albuterol 90mcg inhaler',
    'Fluticasone 110mcg inhaler',
    'Sertraline 50mg',
    'Sertraline 100mg',
    'Gabapentin 300mg',
    'Hydrochlorothiazide 25mg'
];

// Validation schema
const prescriptionSchema = z.object({
    medications: z.array(z.string()).min(1, 'At least one medication is required'),
    instructions: z.string().min(5, 'Instructions must be at least 5 characters'),
    duration: z.string().min(1, 'Duration is required'),
    notes: z.string().optional()
});

export default function PrescriptionForm({ patientId, patientName, onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [medications, setMedications] = useState([]);
    const [newMedication, setNewMedication] = useState('');
    const [medicationError, setMedicationError] = useState('');
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityResult, setAvailabilityResult] = useState(null);

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(prescriptionSchema),
        defaultValues: {
            medications: [],
            instructions: '',
            duration: '',
            notes: ''
        }
    });

    // Watch medications field
    const watchedMedications = watch('medications');

    // Add medication to the list
    const handleAddMedication = () => {
        if (!newMedication || newMedication.trim() === '') {
            setMedicationError('Please enter a medication');
            return;
        }

        const updatedMedications = [...medications, newMedication];
        setMedications(updatedMedications);
        setValue('medications', updatedMedications);
        setNewMedication('');
        setMedicationError('');
    };

    // Remove medication from the list
    const handleRemoveMedication = (index) => {
        const updatedMedications = medications.filter((_, i) => i !== index);
        setMedications(updatedMedications);
        setValue('medications', updatedMedications);
    };

    // Check medication availability
    const handleCheckAvailability = async () => {
        if (!newMedication || newMedication.trim() === '') {
            setMedicationError('Please enter a medication to check');
            return;
        }

        try {
            setCheckingAvailability(true);
            setAvailabilityResult(null);
            
            // Extract just the medication name without dosage
            const medicationName = newMedication.split(' ')[0];
            
            const result = await queryMedicineAvailability(medicationName);
            setAvailabilityResult(result);
        } catch (err) {
            console.error('Error checking medication availability:', err);
            setAvailabilityResult({
                success: false,
                message: 'Error checking availability'
            });
        } finally {
            setCheckingAvailability(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            
            if (data.medications.length === 0) {
                setError('At least one medication is required');
                return;
            }
            
            // Create prescription data
            const prescriptionData = {
                medications: data.medications,
                instructions: data.instructions,
                duration: data.duration,
                notes: data.notes || ''
            };
            
            // Call the API to create prescription
            const result = await createPrescription(patientId, prescriptionData);
            
            if (result.success) {
                setSuccess('Prescription created successfully');
                reset();
                setMedications([]);
                
                // Notify parent component
                if (onSuccess) {
                    onSuccess(result.prescription);
                }
                
                // Close form after a short delay
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to create prescription');
            }
        } catch (err) {
            setError('An error occurred while creating the prescription');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper className="p-6 bg-card border border-border rounded-lg">
            <Box className="flex justify-between items-center mb-6">
                <Box>
                    <Typography variant="h5" component="h2" className="text-foreground font-bold">
                        Create Prescription
                    </Typography>
                    {patientName && (
                        <Typography variant="subtitle1" className="text-muted-foreground">
                            for {patientName}
                        </Typography>
                    )}
                </Box>
                {onClose && (
                    <IconButton onClick={onClose} size="small" className="text-muted-foreground">
                        <X size={20} />
                    </IconButton>
                )}
            </Box>

            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" className="mb-4">
                    {success}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" className="text-foreground font-medium mb-2">
                            Medications
                        </Typography>
                        
                        <Box className="flex items-end gap-2 mb-2">
                            <Autocomplete
                                freeSolo
                                options={commonMedications}
                                value={newMedication}
                                onChange={(_, value) => setNewMedication(value || '')}
                                onInputChange={(_, value) => setNewMedication(value || '')}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params}
                                        label="Add Medication"
                                        variant="outlined"
                                        fullWidth
                                        error={!!medicationError}
                                        helperText={medicationError}
                                        className="bg-background"
                                        InputProps={{
                                            ...params.InputProps,
                                            className: "text-foreground"
                                        }}
                                        InputLabelProps={{
                                            className: "text-muted-foreground"
                                        }}
                                    />
                                )}
                                className="flex-grow"
                            />
                            <Button
                                variant="outlined"
                                onClick={handleCheckAvailability}
                                disabled={checkingAvailability || !newMedication}
                                className="whitespace-nowrap"
                            >
                                {checkingAvailability ? 'Checking...' : 'Check Availability'}
                            </Button>
                            <IconButton 
                                color="primary"
                                onClick={handleAddMedication}
                                disabled={!newMedication}
                            >
                                <Plus size={24} />
                            </IconButton>
                        </Box>
                        
                        {availabilityResult && (
                            <Alert 
                                severity={availabilityResult.availability ? "success" : "warning"}
                                className="mb-3"
                            >
                                {availabilityResult.message}
                                {!availabilityResult.availability && availabilityResult.alternatives?.length > 0 && (
                                    <Box className="mt-1">
                                        <Typography variant="body2" className="font-medium">
                                            Available alternatives:
                                        </Typography>
                                        <Box className="flex flex-wrap gap-1 mt-1">
                                            {availabilityResult.alternatives.map((alt, i) => (
                                                <Chip 
                                                    key={i} 
                                                    label={alt} 
                                                    size="small" 
                                                    color="primary" 
                                                    variant="outlined"
                                                    onClick={() => setNewMedication(alt)}
                                                    className="cursor-pointer"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Alert>
                        )}
                        
                        <Box className="mb-3">
                            {medications.length > 0 ? (
                                <Box className="flex flex-wrap gap-2 mt-2">
                                    {medications.map((med, index) => (
                                        <Chip
                                            key={index}
                                            label={med}
                                            onDelete={() => handleRemoveMedication(index)}
                                            color="primary"
                                            className="bg-primary text-primary-foreground"
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" className="text-muted-foreground italic">
                                    No medications added yet
                                </Typography>
                            )}
                        </Box>
                        
                        {errors.medications && (
                            <FormHelperText error>
                                {errors.medications.message}
                            </FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="instructions"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Instructions"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.instructions}
                                    helperText={errors.instructions?.message}
                                    disabled={isSubmitting}
                                    placeholder="e.g., Take one tablet by mouth twice daily with food"
                                    className="bg-background"
                                    InputProps={{
                                        className: "text-foreground"
                                    }}
                                    InputLabelProps={{
                                        className: "text-muted-foreground"
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                                <FormControl 
                                    fullWidth 
                                    variant="outlined" 
                                    error={!!errors.duration}
                                    disabled={isSubmitting}
                                >
                                    <InputLabel className="text-muted-foreground">Duration</InputLabel>
                                    <Select
                                        {...field}
                                        label="Duration"
                                        className="text-foreground bg-background"
                                    >
                                        <MenuItem value="7 days">7 days</MenuItem>
                                        <MenuItem value="14 days">14 days</MenuItem>
                                        <MenuItem value="30 days">30 days</MenuItem>
                                        <MenuItem value="60 days">60 days</MenuItem>
                                        <MenuItem value="90 days">90 days</MenuItem>
                                        <MenuItem value="As needed">As needed</MenuItem>
                                        <MenuItem value="Until finished">Until finished</MenuItem>
                                        <MenuItem value="Indefinitely">Indefinitely</MenuItem>
                                    </Select>
                                    {errors.duration && (
                                        <FormHelperText>{errors.duration.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Additional Notes (Optional)"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    error={!!errors.notes}
                                    helperText={errors.notes?.message}
                                    disabled={isSubmitting}
                                    className="bg-background"
                                    InputProps={{
                                        className: "text-foreground"
                                    }}
                                    InputLabelProps={{
                                        className: "text-muted-foreground"
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} className="flex justify-end gap-2 mt-4">
                        {onClose && (
                            <Button 
                                variant="outlined" 
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="text-muted-foreground border-muted-foreground hover:bg-muted/50"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={isSubmitting || medications.length === 0}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Prescription'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
} 