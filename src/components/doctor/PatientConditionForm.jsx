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
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Clock, ArrowUp, ArrowDown, Minus, Activity } from 'lucide-react';
import { addConditionUpdate } from '@/services/doctorService';

const conditionSchema = z.object({
    status: z.string().min(1, 'Status is required'),
    notes: z.string().min(5, 'Notes must be at least 5 characters'),
});

export default function PatientConditionForm({ patientId, patientName, previousUpdates = [], onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(conditionSchema),
        defaultValues: {
            status: '',
            notes: ''
        }
    });

    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'improving':
                return <ArrowUp size={16} className="text-green-500" />;
            case 'worsening':
                return <ArrowDown size={16} className="text-red-500" />;
            case 'stable':
                return <Minus size={16} className="text-blue-500" />;
            case 'critical':
                return <Activity size={16} className="text-orange-500" />;
            default:
                return <Clock size={16} className="text-gray-500" />;
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            
            const result = await addConditionUpdate(patientId, data);
            
            if (result.success) {
                setSuccess('Condition update added successfully');
                reset();
                
                if (onSuccess) {
                    onSuccess(result.update);
                }
                
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to add condition update');
            }
        } catch (err) {
            setError('An error occurred while adding the condition update');
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
                        Update Patient Condition
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

            {previousUpdates && previousUpdates.length > 0 && (
                <Box className="mb-6">
                    <Typography variant="subtitle1" className="text-foreground font-medium mb-2">
                        Previous Updates
                    </Typography>
                    <Paper variant="outlined" className="max-h-48 overflow-y-auto">
                        <List dense disablePadding>
                            {previousUpdates.map((update, index) => (
                                <ListItem 
                                    key={index}
                                    divider={index < previousUpdates.length - 1}
                                    className="py-2"
                                >
                                    <ListItemIcon className="min-w-8">
                                        {getStatusIcon(update.status)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box className="flex justify-between">
                                                <Typography variant="body2" className="font-medium">
                                                    {update.status}
                                                </Typography>
                                                <Typography variant="caption" className="text-muted-foreground">
                                                    {update.date}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={update.notes}
                                        secondaryTypographyProps={{ 
                                            variant: 'body2',
                                            className: 'text-muted-foreground'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            )}

            <Divider className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <FormControl 
                                    fullWidth 
                                    variant="outlined" 
                                    error={!!errors.status}
                                    disabled={isSubmitting}
                                >
                                    <InputLabel className="text-muted-foreground">Status</InputLabel>
                                    <Select
                                        {...field}
                                        label="Status"
                                        className="text-foreground bg-background"
                                    >
                                        <MenuItem value="Improving">Improving</MenuItem>
                                        <MenuItem value="Stable">Stable</MenuItem>
                                        <MenuItem value="Worsening">Worsening</MenuItem>
                                        <MenuItem value="Critical">Critical</MenuItem>
                                        <MenuItem value="In Remission">In Remission</MenuItem>
                                        <MenuItem value="Recovered">Recovered</MenuItem>
                                    </Select>
                                    {errors.status && (
                                        <Typography variant="caption" color="error">
                                            {errors.status.message}
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
                                    label="Notes"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.notes}
                                    helperText={errors.notes?.message}
                                    disabled={isSubmitting}
                                    placeholder="Enter detailed notes about the patient's current condition"
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
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Condition'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
} 