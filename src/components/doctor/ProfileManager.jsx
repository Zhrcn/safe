'use client';

import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Grid, 
    Avatar, 
    Tabs, 
    Tab, 
    Divider, 
    Card, 
    CardContent, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import { 
    User, 
    Mail, 
    Phone, 
    Award, 
    GraduationCap, 
    Edit3, 
    Plus, 
    X, 
    Trash2 
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getDoctorProfile, updateDoctorProfile, addProfileItem } from '@/services/doctorService';

// Validation schema for personal info
const personalInfoSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    specialty: z.string().min(2, 'Specialty is required'),
    licenseNumber: z.string().min(2, 'License number is required'),
    experience: z.string().min(1, 'Experience is required'),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone number must be at least 10 characters')
    })
});

// Validation schema for education
const educationSchema = z.object({
    degree: z.string().min(2, 'Degree is required'),
    institution: z.string().min(2, 'Institution is required'),
    year: z.string().min(4, 'Year is required')
});

// Validation schema for achievement
const achievementSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    year: z.string().min(4, 'Year is required'),
    issuer: z.string().min(2, 'Issuer is required')
});

// Personal Information Form Component
function PersonalInfoForm({ profile, onSave }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: profile?.name || '',
            specialty: profile?.specialty || '',
            licenseNumber: profile?.licenseNumber || '',
            experience: profile?.experience || '',
            contact: {
                email: profile?.contact?.email || '',
                phone: profile?.contact?.phone || ''
            }
        }
    });

    // Update form when profile changes
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                specialty: profile.specialty || '',
                licenseNumber: profile.licenseNumber || '',
                experience: profile.experience || '',
                contact: {
                    email: profile.contact?.email || '',
                    phone: profile.contact?.phone || ''
                }
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            
            const result = await updateDoctorProfile(data);
            
            if (result.success) {
                setSuccess('Profile updated successfully');
                if (onSave) onSave(result.profile);
            } else {
                setError(result.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred while updating profile');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

            <Grid container spacing={3}>
                <Grid item xs={12} className="flex items-center">
                    <Avatar 
                        sx={{ width: 100, height: 100, mr: 3 }}
                        className="bg-primary text-primary-foreground"
                    >
                        {profile?.name?.charAt(0) || 'D'}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" className="text-foreground font-bold">
                            {profile?.name || 'Doctor Profile'}
                        </Typography>
                        <Typography variant="body1" className="text-muted-foreground">
                            {profile?.specialty || 'Specialty'} • {profile?.licenseNumber || 'License #'}
                        </Typography>
                    </Box>
                </Grid>

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
                                    className: "text-foreground",
                                    startAdornment: <User size={18} className="mr-2 text-muted-foreground" />
                                }}
                                InputLabelProps={{
                                    className: "text-muted-foreground"
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name="specialty"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Specialty"
                                variant="outlined"
                                fullWidth
                                error={!!errors.specialty}
                                helperText={errors.specialty?.message}
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

                <Grid item xs={12} md={6}>
                    <Controller
                        name="licenseNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="License Number"
                                variant="outlined"
                                fullWidth
                                error={!!errors.licenseNumber}
                                helperText={errors.licenseNumber?.message}
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

                <Grid item xs={12}>
                    <Controller
                        name="experience"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Years of Experience"
                                variant="outlined"
                                fullWidth
                                error={!!errors.experience}
                                helperText={errors.experience?.message}
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

                <Grid item xs={12}>
                    <Typography variant="h6" className="text-foreground font-medium mb-2">
                        Contact Information
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
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
                                    className: "text-foreground",
                                    startAdornment: <Mail size={18} className="mr-2 text-muted-foreground" />
                                }}
                                InputLabelProps={{
                                    className: "text-muted-foreground"
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
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
                                    className: "text-foreground",
                                    startAdornment: <Phone size={18} className="mr-2 text-muted-foreground" />
                                }}
                                InputLabelProps={{
                                    className: "text-muted-foreground"
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} className="flex justify-end mt-4">
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

// Add Education Dialog
function AddEducationDialog({ open, onClose, onAdd }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            degree: '',
            institution: '',
            year: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            
            const result = await addProfileItem('education', data);
            
            if (result.success) {
                reset();
                if (onAdd) onAdd(result.profile);
                onClose();
            } else {
                setError(result.message || 'Failed to add education');
            }
        } catch (err) {
            setError('An error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                <Box className="flex items-center">
                    <GraduationCap size={24} className="mr-2 text-primary" />
                    Add Education
                </Box>
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}
                
                <form id="education-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="degree"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Degree"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.degree}
                                        helperText={errors.degree?.message}
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
                        <Grid item xs={12}>
                            <Controller
                                name="institution"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Institution"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.institution}
                                        helperText={errors.institution?.message}
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
                        <Grid item xs={12}>
                            <Controller
                                name="year"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Year"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.year}
                                        helperText={errors.year?.message}
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
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:bg-muted/50"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="education-form"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? 'Adding...' : 'Add Education'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Add Achievement Dialog
function AddAchievementDialog({ open, onClose, onAdd }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(achievementSchema),
        defaultValues: {
            title: '',
            year: '',
            issuer: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            
            const result = await addProfileItem('achievement', data);
            
            if (result.success) {
                reset();
                if (onAdd) onAdd(result.profile);
                onClose();
            } else {
                setError(result.message || 'Failed to add achievement');
            }
        } catch (err) {
            setError('An error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "bg-card"
            }}
        >
            <DialogTitle className="bg-card border-b border-border text-foreground font-bold">
                <Box className="flex items-center">
                    <Award size={24} className="mr-2 text-primary" />
                    Add Achievement
                </Box>
            </DialogTitle>
            <DialogContent className="bg-card mt-4">
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}
                
                <form id="achievement-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Title"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
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
                        <Grid item xs={12}>
                            <Controller
                                name="year"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Year"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.year}
                                        helperText={errors.year?.message}
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
                        <Grid item xs={12}>
                            <Controller
                                name="issuer"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Issuer"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.issuer}
                                        helperText={errors.issuer?.message}
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
            </DialogContent>
            <DialogActions className="bg-card border-t border-border p-3">
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:bg-muted/50"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="achievement-form"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? 'Adding...' : 'Add Achievement'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ProfileManager() {
    const [activeTab, setActiveTab] = useState('personal');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);

    // Load doctor profile
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError('');
            
            const data = await getDoctorProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Handle profile update
    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    return (
        <Box>
            <Paper className="p-6 bg-card border border-border rounded-lg">
                <Typography variant="h5" component="h1" className="font-bold text-foreground mb-6">
                    Profile Management
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Typography className="text-muted-foreground text-center py-8">
                        Loading profile...
                    </Typography>
                ) : (
                    <>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            className="mb-6"
                            TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
                        >
                            <Tab 
                                label="Personal Information" 
                                value="personal" 
                                className={activeTab === 'personal' ? 'text-primary' : 'text-muted-foreground'}
                            />
                            <Tab 
                                label="Education & Achievements" 
                                value="education" 
                                className={activeTab === 'education' ? 'text-primary' : 'text-muted-foreground'}
                            />
                        </Tabs>

                        {activeTab === 'personal' && (
                            <PersonalInfoForm profile={profile} onSave={handleProfileUpdate} />
                        )}

                        {activeTab === 'education' && (
                            <Box>
                                <Box className="mb-6">
                                    <Box className="flex justify-between items-center mb-4">
                                        <Typography variant="h6" className="text-foreground font-medium">
                                            Education
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Plus size={18} />}
                                            onClick={() => setEducationDialogOpen(true)}
                                            className="text-primary border-primary hover:bg-primary/10"
                                        >
                                            Add Education
                                        </Button>
                                    </Box>
                                    
                                    {profile?.education?.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {profile.education.map((edu, index) => (
                                                <Grid item xs={12} md={6} key={index}>
                                                    <Card className="border border-border">
                                                        <CardContent>
                                                            <Box className="flex items-center mb-2">
                                                                <GraduationCap size={20} className="mr-2 text-primary" />
                                                                <Typography variant="h6" className="text-foreground font-medium">
                                                                    {edu.degree}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body1" className="text-foreground">
                                                                {edu.institution}
                                                            </Typography>
                                                            <Typography variant="body2" className="text-muted-foreground">
                                                                {edu.year}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Typography className="text-muted-foreground text-center py-4">
                                            No education records found
                                        </Typography>
                                    )}
                                </Box>

                                <Divider className="my-6" />

                                <Box>
                                    <Box className="flex justify-between items-center mb-4">
                                        <Typography variant="h6" className="text-foreground font-medium">
                                            Achievements
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Plus size={18} />}
                                            onClick={() => setAchievementDialogOpen(true)}
                                            className="text-primary border-primary hover:bg-primary/10"
                                        >
                                            Add Achievement
                                        </Button>
                                    </Box>
                                    
                                    {profile?.achievements?.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {profile.achievements.map((achievement, index) => (
                                                <Grid item xs={12} md={6} key={index}>
                                                    <Card className="border border-border">
                                                        <CardContent>
                                                            <Box className="flex items-center mb-2">
                                                                <Award size={20} className="mr-2 text-primary" />
                                                                <Typography variant="h6" className="text-foreground font-medium">
                                                                    {achievement.title}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body1" className="text-foreground">
                                                                {achievement.issuer}
                                                            </Typography>
                                                            <Typography variant="body2" className="text-muted-foreground">
                                                                {achievement.year}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Typography className="text-muted-foreground text-center py-4">
                                            No achievements found
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* Add Education Dialog */}
            <AddEducationDialog
                open={educationDialogOpen}
                onClose={() => setEducationDialogOpen(false)}
                onAdd={handleProfileUpdate}
            />

            {/* Add Achievement Dialog */}
            <AddAchievementDialog
                open={achievementDialogOpen}
                onClose={() => setAchievementDialogOpen(false)}
                onAdd={handleProfileUpdate}
            />
        </Box>
    );
} 