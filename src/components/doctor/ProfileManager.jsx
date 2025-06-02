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
    ListItemSecondaryAction,
    Input
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

const personalInfoSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    specialty: z.string().min(2, 'Specialty is required'),
    licenseNumber: z.string().min(2, 'License number is required'),
    experience: z.string().min(1, 'Experience is required'),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone number must be at least 10 characters')
    }),
    profileImage: z.string().optional()
});

const educationSchema = z.object({
    degree: z.string().min(2, 'Degree is required'),
    institution: z.string().min(2, 'Institution is required'),
    year: z.string().min(4, 'Year is required')
});

const achievementSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    year: z.string().min(4, 'Year is required'),
    issuer: z.string().min(2, 'Issuer is required')
});

function PersonalInfoForm({ profile, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset,
        setValue
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
            },
            profileImage: profile?.profileImage || ''
        }
    });

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                specialty: profile.specialty,
                licenseNumber: profile.licenseNumber,
                experience: profile.experience,
                contact: {
                    email: profile.contact?.email,
                    phone: profile.contact?.phone
                },
                profileImage: profile.profileImage || ''
            });
            if (profile.profileImage) {
                setPreviewUrl(profile.profileImage);
            }
        }
    }, [profile, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await onSave(data);
            setSuccess('Personal information updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update personal information');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
        setPreviewUrl(profile?.profileImage || '');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setValue('profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Paper className="p-6 bg-card border border-border rounded-lg mb-6">
            <Typography variant="h5" component="h2" className="font-bold text-foreground mb-6">
                Personal Information
            </Typography>
            
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
            
            {!isEditing ? (
                <div>
                    <div className="flex items-center mb-6">
                        <Avatar 
                            src={profile?.profileImage} 
                            sx={{ width: 100, height: 100, mr: 3 }}
                            className="bg-primary text-primary-foreground"
                        />
                        <Box>
                            <Typography variant="h5" className="text-foreground font-bold">
                                {profile?.name}
                            </Typography>
                            <Typography variant="body1" className="text-muted-foreground">
                                {profile?.specialty}
                            </Typography>
                        </Box>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Typography variant="subtitle1" className="text-muted-foreground">Name</Typography>
                            <Typography variant="body1" className="text-foreground">{profile?.name}</Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle1" className="text-muted-foreground">Specialty</Typography>
                            <Typography variant="body1" className="text-foreground">{profile?.specialty}</Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle1" className="text-muted-foreground">Email</Typography>
                            <Typography variant="body1" className="text-foreground">{profile?.contact?.email}</Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle1" className="text-muted-foreground">Phone</Typography>
                            <Typography variant="body1" className="text-foreground">{profile?.contact?.phone}</Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle1" className="text-muted-foreground">License Number</Typography>
                            <Typography variant="body1" className="text-foreground">{profile?.licenseNumber}</Typography>
                        </div>
                        <div>
                            <Typography variant="subtitle1" className="text-muted-foreground">Experience (Years)</Typography>
                            <Typography variant="body1" className="text-foreground">{profile?.experience}</Typography>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <Button 
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center mb-6">
                        <Avatar 
                            src={previewUrl || profile?.profileImage} 
                            sx={{ width: 100, height: 100, mr: 3 }}
                            className="bg-primary text-primary-foreground"
                        />
                        <div>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                            <Input type="hidden" {...field} />
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
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
                        
                        <Controller
                            name="contact.email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.contact?.email}
                                    helperText={errors.contact?.email?.message}
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
                        
                        <Controller
                            name="contact.phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.contact?.phone}
                                    helperText={errors.contact?.phone?.message}
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
                        
                        <Controller
                            name="experience"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Experience (Years)"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    error={!!errors.experience}
                                    helperText={errors.experience?.message}
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
                    </div>
                    
                    <div className="mt-6 flex space-x-4">
                        <Button 
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </Paper>
    );
}

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

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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