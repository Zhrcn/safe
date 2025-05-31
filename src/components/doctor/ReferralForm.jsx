'use client';

import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Grid, 
    Autocomplete, 
    Alert, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRound, Send, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getAvailableDoctors, createReferral } from '@/services/doctorService';

const referralSchema = z.object({
    doctorId: z.string().min(1, 'Doctor is required'),
    reason: z.string().min(5, 'Reason must be at least 5 characters'),
    notes: z.string().optional(),
    urgency: z.enum(['Low', 'Medium', 'High', 'Emergency'])
});

export default function ReferralForm({ patientId, patientName, previousReferrals = [], onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(referralSchema),
        defaultValues: {
            doctorId: '',
            reason: '',
            notes: '',
            urgency: 'Medium'
        }
    });

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setLoading(true);
                const data = await getAvailableDoctors();
                setDoctors(data);
            } catch (err) {
                console.error('Failed to load doctors:', err);
                setError('Failed to load available doctors');
            } finally {
                setLoading(false);
            }
        };
        
        loadDoctors();
    }, []);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'error';
            case 'completed':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'pending':
                return <Clock size={16} className="text-amber-500" />;
            case 'accepted':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'rejected':
                return <XCircle size={16} className="text-red-500" />;
            case 'completed':
                return <CheckCircle2 size={16} className="text-blue-500" />;
            default:
                return <AlertCircle size={16} className="text-gray-500" />;
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            
            const doctor = doctors.find(d => d.id === data.doctorId);
            if (!doctor) {
                setError('Selected doctor not found');
                return;
            }
            
            const referralData = {
                doctorId: data.doctorId,
                doctorName: doctor.name,
                doctorSpecialty: doctor.specialty,
                reason: data.reason,
                notes: data.notes || '',
                urgency: data.urgency
            };
            
            const result = await createReferral(patientId, referralData);
            
            if (result.success) {
                setSuccess('Referral created successfully');
                reset();
                
                if (onSuccess) {
                    onSuccess(result.referral);
                }
                
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to create referral');
            }
        } catch (err) {
            setError('An error occurred while creating the referral');
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
                        Create Referral
                    </Typography>
                    {patientName && (
                        <Typography variant="subtitle1" className="text-muted-foreground">
                            for {patientName}
                        </Typography>
                    )}
                </Box>
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

            {previousReferrals && previousReferrals.length > 0 && (
                <Box className="mb-6">
                    <Typography variant="subtitle1" className="text-foreground font-medium mb-2">
                        Previous Referrals
                    </Typography>
                    <Grid container spacing={2}>
                        {previousReferrals.map((referral, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card className="border border-border">
                                    <CardContent>
                                        <Box className="flex items-center justify-between mb-2">
                                            <Typography variant="subtitle1" className="font-medium text-foreground">
                                                {referral.doctorName}
                                            </Typography>
                                            <Chip 
                                                label={referral.status} 
                                                size="small" 
                                                color={getStatusColor(referral.status)}
                                                icon={getStatusIcon(referral.status)}
                                            />
                                        </Box>
                                        <Typography variant="body2" className="text-muted-foreground mb-2">
                                            {referral.doctorSpecialty} • {referral.date}
                                        </Typography>
                                        <Typography variant="body2" className="text-foreground">
                                            <span className="font-medium">Reason:</span> {referral.reason}
                                        </Typography>
                                        {referral.notes && (
                                            <Typography variant="body2" className="text-foreground mt-1">
                                                <span className="font-medium">Notes:</span> {referral.notes}
                                            </Typography>
                                        )}
                                        <Box className="mt-2">
                                            <Chip 
                                                label={`Urgency: ${referral.urgency}`} 
                                                size="small" 
                                                color={
                                                    referral.urgency === 'High' || referral.urgency === 'Emergency' 
                                                        ? 'error' 
                                                        : referral.urgency === 'Medium' ? 'warning' : 'default'
                                                }
                                                variant="outlined"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Divider className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Controller
                            name="doctorId"
                            control={control}
                            render={({ field }) => (
                                <FormControl 
                                    fullWidth 
                                    variant="outlined" 
                                    error={!!errors.doctorId}
                                    disabled={isSubmitting || loading}
                                >
                                    <InputLabel className="text-muted-foreground">Refer to Doctor</InputLabel>
                                    <Select
                                        {...field}
                                        label="Refer to Doctor"
                                        className="text-foreground bg-background"
                                    >
                                        {loading ? (
                                            <MenuItem disabled>Loading doctors...</MenuItem>
                                        ) : doctors.length === 0 ? (
                                            <MenuItem disabled>No doctors available</MenuItem>
                                        ) : (
                                            doctors.map(doctor => (
                                                <MenuItem key={doctor.id} value={doctor.id}>
                                                    {doctor.name} - {doctor.specialty}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.doctorId && (
                                        <Typography variant="caption" color="error">
                                            {errors.doctorId.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="reason"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Reason for Referral"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.reason}
                                    helperText={errors.reason?.message}
                                    disabled={isSubmitting}
                                    placeholder="Please describe the reason for this referral"
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
                            name="urgency"
                            control={control}
                            render={({ field }) => (
                                <FormControl 
                                    fullWidth 
                                    variant="outlined" 
                                    error={!!errors.urgency}
                                    disabled={isSubmitting}
                                >
                                    <InputLabel className="text-muted-foreground">Urgency</InputLabel>
                                    <Select
                                        {...field}
                                        label="Urgency"
                                        className="text-foreground bg-background"
                                    >
                                        <MenuItem value="Low">Low</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="High">High</MenuItem>
                                        <MenuItem value="Emergency">Emergency</MenuItem>
                                    </Select>
                                    {errors.urgency && (
                                        <Typography variant="caption" color="error">
                                            {errors.urgency.message}
                                        </Typography>
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
                            disabled={isSubmitting || loading}
                            startIcon={<Send size={16} />}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Referral'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
} 