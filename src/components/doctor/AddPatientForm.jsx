'use client';

import { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Grid, 
    Typography, 
    Paper,
    FormHelperText,
    Alert,
    IconButton,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Search } from 'lucide-react';

const patientSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    age: z.number().int().positive().min(1).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    condition: z.string().min(3, 'Condition description required'),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone number must be at least 10 characters')
    })
});

const patientIdSchema = z.object({
    patientId: z.string().min(1, 'Patient ID is required')
});

export default function AddPatientForm({ onClose, onSuccess }) {
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [patientId, setPatientId] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            name: '',
            age: '',
            gender: '',
            condition: '',
            contact: {
                email: '',
                phone: ''
            }
        }
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setSuccess('');
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            
            data.age = Number(data.age);
            
            // Use local state and mock data for addPatient and getPatientById logic.
            
            if (result.success) {
                setSuccess('Patient added successfully');
                reset();
                
                if (onSuccess) {
                    onSuccess(result.patient);
                }
                
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to add patient');
            }
        } catch (err) {
            setError('An error occurred while adding the patient');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearchById = async () => {
        if (!patientId.trim()) {
            setError('Please enter a patient ID');
            return;
        }
        
        try {
            setIsSearching(true);
            setError('');
            
            // Use local state and mock data for addPatient and getPatientById logic.
            
            if (result.success) {
                setSuccess('Patient found and added successfully');
                
                if (onSuccess) {
                    onSuccess(result.patient);
                }
                
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Patient not found');
            }
        } catch (err) {
            setError('An error occurred while searching for the patient');
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Paper className="p-6 bg-card border border-border rounded-lg">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" component="h2" className="text-foreground font-bold">
                    Add Patient
                </Typography>
                {onClose && (
                    <IconButton onClick={onClose} size="small" className="text-muted-foreground">
                        <X size={20} />
                    </IconButton>
                )}
            </Box>

            <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                className="mb-4"
                variant="fullWidth"
                TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
            >
                <Tab 
                    label="New Patient" 
                    className={activeTab === 0 ? 'text-primary' : 'text-muted-foreground'}
                />
                <Tab 
                    label="Add by ID" 
                    className={activeTab === 1 ? 'text-primary' : 'text-muted-foreground'}
                />
            </Tabs>

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

            {activeTab === 0 ? (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Full Name"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
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

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Age"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        error={!!errors.age}
                                        helperText={errors.age?.message}
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

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <FormControl 
                                        fullWidth 
                                        variant="outlined" 
                                        error={!!errors.gender}
                                        disabled={isSubmitting}
                                    >
                                        <InputLabel className="text-muted-foreground">Gender</InputLabel>
                                        <Select
                                            {...field}
                                            label="Gender"
                                            className="text-foreground bg-background"
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                        {errors.gender && (
                                            <FormHelperText>{errors.gender.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="condition"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Medical Condition"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.condition}
                                        helperText={errors.condition?.message}
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

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="contact.email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        type="email"
                                        error={!!errors.contact?.email}
                                        helperText={errors.contact?.email?.message}
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

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="contact.phone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Phone Number"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.contact?.phone}
                                        helperText={errors.contact?.phone?.message}
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
                    </Grid>
                </form>
            ) : (
                <Box>
                    <Typography variant="body2" className="text-muted-foreground mb-4">
                        Add an existing patient to your patient list by entering their ID.
                    </Typography>
                    <Box className="flex gap-2 mb-4">
                        <TextField
                            label="Patient ID"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            variant="outlined"
                            fullWidth
                            className="bg-background"
                            InputProps={{
                                className: "text-foreground"
                            }}
                            InputLabelProps={{
                                className: "text-muted-foreground"
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearchById}
                            disabled={isSearching || !patientId.trim()}
                            startIcon={<Search size={18} />}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                        >
                            {isSearching ? 'Searching...' : 'Find Patient'}
                        </Button>
                    </Box>
                </Box>
            )}

            <Box className="flex justify-end gap-2 mt-4">
                {onClose && (
                    <Button 
                        variant="outlined" 
                        onClick={onClose}
                        disabled={isSubmitting || isSearching}
                        className="text-muted-foreground border-muted-foreground hover:bg-muted/50"
                    >
                        Cancel
                    </Button>
                )}
                {activeTab === 0 && (
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isSubmitting ? 'Adding...' : 'Add Patient'}
                    </Button>
                )}
            </Box>
        </Paper>
    );
} 