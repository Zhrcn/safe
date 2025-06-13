'use client';

import React, { useState, useEffect } from 'react';
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
    Tabs,
    Tab,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Tooltip,
    Divider,
    Paper,
    Fade,
    Zoom,
    useTheme,
    alpha,
    InputAdornment,
    Badge,
    Avatar,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Notifications as NotificationsIcon,
    NotificationsOff as NotificationsOffIcon,
    AccessTime as AccessTimeIcon,
    CalendarToday as CalendarIcon,
    Repeat as RepeatIcon,
    LocalPharmacy as PharmacyIcon,
    Medication as MedicationIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useNotification } from '@/components/ui/Notification';
import { useDispatch } from 'react-redux';
import { medications } from '@/mockdata/medications';
import {
    setActiveMedications,
    setMedicationsLoading,
    setMedicationsError,
} from '@/store/slices/patient/dashboardSlice';
import { Pill } from 'lucide-react';

const FREQUENCY_OPTIONS = [
    { value: 'four', label: 'Four times a day' },
    { value: 'six', label: 'Every 6 hours' },
    { value: 'eight', label: 'Every 8 hours' },
    { value: 'twelve', label: 'Every 12 hours' },
];

const DAYS_OF_WEEK = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
];

const MedicationCard = ({ medication, onEdit, onDelete, onToggleReminder }) => {
    const theme = useTheme();
    const isExpiringSoon = medication.endDate && 
        new Date(medication.endDate) - new Date() < 7 * 24 * 60 * 60 * 1000;
    const isExpired = medication.endDate && 
        new Date(medication.endDate) - new Date() < 0;

    return (
        <Zoom in={true}>
            <Card 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        '& .MuiCardContent-root': {
                            bgcolor: alpha(theme.palette.background.default, 0.8),
                        },
                    },
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                {isExpired && (
                    <Chip
                        icon={<WarningIcon />}
                        label="Expired"
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: -12,
                            right: 16,
                            zIndex: 1,
                            boxShadow: theme.shadows[2],
                        }}
                    />
                )}
                {isExpiringSoon && !isExpired && (
                    <Chip
                        icon={<WarningIcon />}
                        label="Expiring Soon"
                        color="warning"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: -12,
                            right: 16,
                            zIndex: 1,
                            boxShadow: theme.shadows[2],
                        }}
                    />
                )}
                <CardContent sx={{ 
                    flexGrow: 1, 
                    pb: 1,
                    transition: 'background-color 0.3s ease-in-out',
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                                sx={{
                                    bgcolor: isExpired 
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : alpha(theme.palette.primary.main, 0.1),
                                    color: isExpired 
                                        ? theme.palette.error.main
                                        : theme.palette.primary.main,
                                    width: 48,
                                    height: 48,
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <MedicationIcon />
                            </Avatar>
                            <Box>
                                <Typography 
                                    variant="h6" 
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        color: isExpired 
                                            ? theme.palette.error.main
                                            : theme.palette.text.primary,
                                    }}
                                >
                                    {medication.name}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}
                                >
                                    <Pill size={14} />
                                    {medication.dosage}
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label={medication.status}
                            color={isExpired ? 'error' : (medication.status === 'active' ? 'success' : 'default')}
                            size="small"
                            sx={{
                                bgcolor: alpha(
                                    isExpired 
                                        ? theme.palette.error.main 
                                        : (medication.status === 'active' 
                                            ? theme.palette.success.main 
                                            : theme.palette.grey[500]),
                                    0.1
                                ),
                                color: isExpired 
                                    ? theme.palette.error.main 
                                    : (medication.status === 'active' 
                                        ? theme.palette.success.main 
                                        : theme.palette.grey[700]),
                                fontWeight: 500,
                            }}
                        />
                    </Box>

                    <Stack spacing={2}>
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                            sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                            }}
                        >
                            <RepeatIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                                {medication.frequency}
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                    Start: {new Date(medication.startDate).toLocaleDateString()}
                                </Typography>
                            </Box>

                            {medication.endDate && (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CalendarIcon color="action" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">
                                        End: {new Date(medication.endDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {medication.instructions && (
                            <Box 
                                display="flex" 
                                alignItems="flex-start" 
                                gap={1}
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: alpha(theme.palette.info.main, 0.05),
                                }}
                            >
                                <InfoIcon color="info" fontSize="small" sx={{ mt: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {medication.instructions}
                                </Typography>
                            </Box>
                        )}

                        {medication.reminderEnabled && (
                            <Box 
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: alpha(theme.palette.success.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                                }}
                            >
                                <Typography 
                                    variant="subtitle2" 
                                    color="success" 
                                    gutterBottom
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 0.5,
                                        fontWeight: 600,
                                    }}
                                >
                                    <ScheduleIcon fontSize="small" />
                                    Reminder Schedule
                                </Typography>

                                <Stack spacing={2}>
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary" 
                                            display="block" 
                                            gutterBottom
                                            sx={{ 
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            <AccessTimeIcon fontSize="small" />
                                            Times:
                                        </Typography>
                                        <Chip
                                            label={medication.reminderTimes?.join(', ')}
                                            size="small"
                                            sx={{ 
                                                m: 0.5,
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                color: theme.palette.success.main,
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary" 
                                            display="block" 
                                            gutterBottom
                                            sx={{ 
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            <CalendarIcon fontSize="small" />
                                            Days:
                                        </Typography>
                                        <Chip
                                            label={
                                                medication.reminderDays?.length === 7 
                                                    ? 'Everyday' 
                                                    : medication.reminderDays?.join(', ')
                                            }
                                            size="small"
                                            sx={{ 
                                                m: 0.5,
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                color: theme.palette.success.main,
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </CardContent>
                <CardActions sx={{ 
                    pt: 1, 
                    pb: 2, 
                    px: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(medication)}
                        sx={{ 
                            mr: 1,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete(medication.id)}
                        color="error"
                        sx={{
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                            },
                        }}
                    >
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </Zoom>
    );
};

const ReminderDialog = ({ open, onClose, medication, onSubmit }) => {
    const [formData, setFormData] = useState({
        reminderEnabled: medication?.reminderEnabled || false,
        frequency: medication?.reminderFrequency || 'once',
        firstTime: medication?.reminderTimes?.[0] || '08:00',
        reminderDays: medication?.reminderDays || DAYS_OF_WEEK.map(day => day.value),
    });

    const calculateReminderTimes = (frequency, firstTime) => {
        const times = [firstTime];
        const [hours, minutes] = firstTime.split(':').map(Number);
        
        switch (frequency) {
            case 'twice':
                times.push(`${(hours + 12) % 24}:${minutes.toString().padStart(2, '0')}`);
                break;
            case 'three':
                times.push(`${(hours + 8) % 24}:${minutes.toString().padStart(2, '0')}`);
                times.push(`${(hours + 16) % 24}:${minutes.toString().padStart(2, '0')}`);
                break;
            case 'four':
                times.push(`${(hours + 6) % 24}:${minutes.toString().padStart(2, '0')}`);
                times.push(`${(hours + 12) % 24}:${minutes.toString().padStart(2, '0')}`);
                times.push(`${(hours + 18) % 24}:${minutes.toString().padStart(2, '0')}`);
                break;
            case 'six':
                times.push(`${(hours + 6) % 24}:${minutes.toString().padStart(2, '0')}`);
                times.push(`${(hours + 12) % 24}:${minutes.toString().padStart(2, '0')}`);
                times.push(`${(hours + 18) % 24}:${minutes.toString().padStart(2, '0')}`);
                break;
            case 'eight':
                times.push(`${(hours + 8) % 24}:${minutes.toString().padStart(2, '0')}`);
                times.push(`${(hours + 16) % 24}:${minutes.toString().padStart(2, '0')}`);
                break;
            case 'twelve':
                times.push(`${(hours + 12) % 24}:${minutes.toString().padStart(2, '0')}`);
                break;
            default:
                break;
        }
        
        return times.sort((a, b) => {
            const [hoursA, minutesA] = a.split(':').map(Number);
            const [hoursB, minutesB] = b.split(':').map(Number);
            return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            reminderTimes: name === 'frequency' || name === 'firstTime' 
                ? calculateReminderTimes(
                    name === 'frequency' ? value : prev.frequency,
                    name === 'firstTime' ? value : prev.firstTime
                )
                : prev.reminderTimes
        }));
    };

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            reminderDays: prev.reminderDays.includes(day)
                ? prev.reminderDays.filter(d => d !== day)
                : [...prev.reminderDays, day]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            reminderTimes: calculateReminderTimes(formData.frequency, formData.firstTime)
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Set Reminder for {medication?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.reminderEnabled}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        reminderEnabled: e.target.checked
                                    }))}
                                />
                            }
                            label="Enable Reminder"
                        />
                        
                        {formData.reminderEnabled && (
                            <>
                                <FormControl fullWidth>
                                    <InputLabel>Frequency</InputLabel>
                                    <Select
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleChange}
                                        label="Frequency"
                                    >
                                        {FREQUENCY_OPTIONS.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    name="firstTime"
                                    label="First Reminder Time"
                                    type="time"
                                    value={formData.firstTime}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Days of Week
                                    </Typography>
                                    <FormGroup row>
                                        {DAYS_OF_WEEK.map(day => (
                                            <FormControlLabel
                                                key={day.value}
                                                control={
                                                    <Checkbox
                                                        checked={formData.reminderDays.includes(day.value)}
                                                        onChange={() => handleDayToggle(day.value)}
                                                    />
                                                }
                                                label={day.label}
                                            />
                                        ))}
                                    </FormGroup>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Reminder Times
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        {calculateReminderTimes(formData.frequency, formData.firstTime).map((time, index) => (
                                            <Chip
                                                key={index}
                                                icon={<AccessTimeIcon />}
                                                label={time}
                                                sx={{ m: 0.5 }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Save Reminder
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const MedicationDialog = ({ open, onClose, medication, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: medication?.name || '',
        dosage: medication?.dosage || '',
        frequency: medication?.frequency || '',
        startDate: medication?.startDate ? new Date(medication.startDate).toISOString().split('T')[0] : '',
        endDate: medication?.endDate ? new Date(medication.endDate).toISOString().split('T')[0] : '',
        instructions: medication?.instructions || '',
        reminderEnabled: medication?.reminderEnabled || false,
        reminderFrequency: medication?.reminderFrequency || 'once',
        reminderTimes: medication?.reminderTimes || [],
        reminderDays: medication?.reminderDays || DAYS_OF_WEEK.map(day => day.value),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [localMedications, setLocalMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        try {
            const mockMedications = medications.filter(med => 
                med.status === 'active'
            ).map(med => ({
                ...med,
                reminderEnabled: false,
                reminderTimes: [],
                reminderDays: [],
            }));
            setLocalMedications(mockMedications);
            dispatch(setActiveMedications(mockMedications));
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            dispatch(setMedicationsError(err.message));
            setIsLoading(false);
        }
    }, [dispatch]);

    const handleCreate = async (formData) => {
        try {
            const newMedication = {
                id: Date.now().toString(),
                ...formData,
                status: 'active',
                prescribedBy: 'Dr. John Doe',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setLocalMedications(prev => [...prev, newMedication]);
            dispatch(setActiveMedications([...localMedications, newMedication]));
            showNotification('Medication added successfully', 'success');
            setDialogOpen(false);
        } catch (error) {
            showNotification(error.message || 'Failed to add medication', 'error');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const updatedMedication = {
                ...selectedMedication,
                ...formData,
                updatedAt: new Date().toISOString(),
            };
            setLocalMedications(prev =>
                prev.map(med => (med.id === selectedMedication.id ? updatedMedication : med))
            );
            dispatch(setActiveMedications(
                localMedications.map(med => (med.id === selectedMedication.id ? updatedMedication : med))
            ));
            showNotification('Medication updated successfully', 'success');
            setDialogOpen(false);
            setSelectedMedication(null);
        } catch (error) {
            showNotification(error.message || 'Failed to update medication', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            setLocalMedications(prev => prev.filter(med => med.id !== id));
            dispatch(setActiveMedications(localMedications.filter(med => med.id !== id)));
            showNotification('Medication deleted successfully', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to delete medication', 'error');
        }
    };

    const handleToggleReminder = (id) => {
        const medication = localMedications.find(med => med.id === id);
        setSelectedMedication(medication);
        setReminderDialogOpen(true);
    };

    const handleReminderUpdate = (formData) => {
        try {
            const updatedMedication = {
                ...selectedMedication,
                ...formData,
                updatedAt: new Date().toISOString(),
            };
            setLocalMedications(prev =>
                prev.map(med => (med.id === selectedMedication.id ? updatedMedication : med))
            );
            dispatch(setActiveMedications(
                localMedications.map(med => (med.id === selectedMedication.id ? updatedMedication : med))
            ));
            showNotification('Reminder settings updated successfully', 'success');
            setReminderDialogOpen(false);
            setSelectedMedication(null);
        } catch (error) {
            showNotification(error.message || 'Failed to update reminder settings', 'error');
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
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Medications" />
                    <Tab label="Reminders" />
                </Tabs>
            </Box>

            {activeTab === 0 ? (
                <>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setSelectedMedication(null);
                                setDialogOpen(true);
                            }}
                        >
                            Add Medication
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {localMedications.map((medication) => (
                            <Grid item xs={12} sm={6} md={4} key={medication.id}>
                                <MedicationCard
                                    medication={medication}
                                    onEdit={(med) => {
                                        setSelectedMedication(med);
                                        setDialogOpen(true);
                                    }}
                                    onDelete={handleDelete}
                                    onToggleReminder={handleToggleReminder}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        Medication Reminders
                    </Typography>
                    <Grid container spacing={3}>
                        {localMedications
                            .filter(medication => {
                                const isExpired = medication.endDate && 
                                    new Date(medication.endDate) - new Date() < 0;
                                return !isExpired;
                            })
                            .map((medication) => (
                                <Grid item xs={12} sm={6} md={4} key={medication.id}>
                                    <Card 
                                        sx={{ 
                                            height: '100%',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: theme.shadows[8],
                                            },
                                            position: 'relative',
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        }}
                                    >
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main,
                                                            width: 48,
                                                            height: 48,
                                                        }}
                                                    >
                                                        <MedicationIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography 
                                                            variant="h6" 
                                                            sx={{ 
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {medication.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {medication.dosage}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={medication.reminderEnabled ? 'Reminders On' : 'Reminders Off'}
                                                    color={medication.reminderEnabled ? 'success' : 'default'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(
                                                            medication.reminderEnabled 
                                                                ? theme.palette.success.main 
                                                                : theme.palette.grey[500],
                                                            0.1
                                                        ),
                                                        color: medication.reminderEnabled 
                                                            ? theme.palette.success.main 
                                                            : theme.palette.grey[700],
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </Box>

                                            {medication.reminderEnabled ? (
                                                <Box 
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        bgcolor: alpha(theme.palette.success.main, 0.05),
                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        color="success" 
                                                        gutterBottom
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: 0.5,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        <ScheduleIcon fontSize="small" />
                                                        Reminder Schedule
                                                    </Typography>

                                                    <Stack spacing={2}>
                                                        <Box>
                                                            <Typography 
                                                                variant="caption" 
                                                                color="text.secondary" 
                                                                display="block" 
                                                                gutterBottom
                                                                sx={{ 
                                                                    fontWeight: 500,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                }}
                                                            >
                                                                <AccessTimeIcon fontSize="small" />
                                                                Times:
                                                            </Typography>
                                                            <Chip
                                                                label={medication.reminderTimes?.join(', ')}
                                                                size="small"
                                                                sx={{ 
                                                                    m: 0.5,
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    color: theme.palette.success.main,
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        </Box>

                                                        <Box>
                                                            <Typography 
                                                                variant="caption" 
                                                                color="text.secondary" 
                                                                display="block" 
                                                                gutterBottom
                                                                sx={{ 
                                                                    fontWeight: 500,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                }}
                                                            >
                                                                <CalendarIcon fontSize="small" />
                                                                Days:
                                                            </Typography>
                                                            <Chip
                                                                label={
                                                                    medication.reminderDays?.length === 7 
                                                                        ? 'Everyday' 
                                                                        : medication.reminderDays?.join(', ')
                                                                }
                                                                size="small"
                                                                sx={{ 
                                                                    m: 0.5,
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    color: theme.palette.success.main,
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            ) : (
                                                <Box 
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        bgcolor: alpha(theme.palette.grey[500], 0.05),
                                                        border: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                        No reminders set
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        startIcon={<ScheduleIcon />}
                                                        onClick={() => {
                                                            setSelectedMedication(medication);
                                                            setReminderDialogOpen(true);
                                                        }}
                                                        sx={{ 
                                                            mt: 1,
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            },
                                                        }}
                                                    >
                                                        Set Reminders
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ 
                                            pt: 1, 
                                            pb: 2, 
                                            px: 2,
                                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}>
                                            <Button
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => {
                                                    setSelectedMedication(medication);
                                                    setReminderDialogOpen(true);
                                                }}
                                                sx={{ 
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                }}
                                            >
                                                Edit Reminders
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            )}

            <MedicationDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedMedication(null);
                }}
                medication={selectedMedication}
                onSubmit={selectedMedication ? handleUpdate : handleCreate}
            />

            <ReminderDialog
                open={reminderDialogOpen}
                onClose={() => {
                    setReminderDialogOpen(false);
                    setSelectedMedication(null);
                }}
                medication={selectedMedication}
                onSubmit={handleReminderUpdate}
            />
        </Box>
    );
};

export default MedicationsPage; 