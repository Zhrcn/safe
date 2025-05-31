import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stepper,
    Step,
    StepLabel,
    Divider,
    FormHelperText,
    InputAdornment,
    IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/lib/auth/AuthContext';
import { motion } from 'framer-motion';
import { ROLES, ROLE_ROUTES } from '@/lib/config';

const baseSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(Object.values(ROLES)),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const patientSchema = z.object({
    ...baseSchema.shape,
    profile: z.object({
        phoneNumber: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(['Male', 'Female', 'Other']).optional(),
        address: z.string().optional()
    }).optional(),
    patientProfile: z.object({
        emergencyContact: z.object({
            name: z.string().optional(),
            relationship: z.string().optional(),
            phoneNumber: z.string().optional()
        }).optional(),
        insurance: z.object({
            provider: z.string().optional(),
            policyNumber: z.string().optional()
        }).optional()
    }).optional()
});

const doctorSchema = z.object({
    ...baseSchema.shape,
    profile: z.object({
        phoneNumber: z.string().optional(),
        address: z.string().optional()
    }).optional(),
    doctorProfile: z.object({
        specialization: z.string().optional(),
        licenseNumber: z.string().optional(),
        yearsOfExperience: z.string().optional().transform(val => val ? parseInt(val) : undefined)
    }).optional()
});

const pharmacistSchema = z.object({
    ...baseSchema.shape,
    profile: z.object({
        phoneNumber: z.string().optional(),
        address: z.string().optional()
    }).optional(),
    pharmacistProfile: z.object({
        licenseNumber: z.string().optional(),
        pharmacy: z.object({
            name: z.string().optional(),
            address: z.string().optional(),
            phoneNumber: z.string().optional()
        }).optional()
    }).optional()
});

const steps = ['Account Information', 'Personal Details', 'Role-Specific Information'];

export default function RegisterForm() {
    const { register: registerUser } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(ROLES.PATIENT);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ROLES.PATIENT
    });
    const router = useRouter();

    const getDefaultValues = (role) => {
        const common = {
            role: role,
            name: formValues.name || '',
            email: formValues.email || '',
            password: formValues.password || '',
            confirmPassword: formValues.confirmPassword || '',
            profile: {
                phoneNumber: '',
                address: '',
            }
        };

        if (role === ROLES.PATIENT) {
            return {
                ...common,
                profile: {
                    ...common.profile,
                    dateOfBirth: '',
                    gender: 'Male' 
                },
                patientProfile: {
                    emergencyContact: {
                        name: '',
                        relationship: '',
                        phoneNumber: ''
                    },
                    insurance: {
                        provider: '',
                        policyNumber: ''
                    }
                }
            };
        } else if (role === ROLES.DOCTOR) {
            return {
                ...common,
                doctorProfile: {
                    specialization: '',
                    licenseNumber: '',
                    yearsOfExperience: ''
                }
            };
        } else if (role === ROLES.PHARMACIST) {
            return {
                ...common,
                pharmacistProfile: {
                    licenseNumber: '',
                    pharmacy: {
                        name: '',
                        address: '',
                        phoneNumber: ''
                    }
                }
            };
        }

        return common;
    };
    const getSchemaForRole = () => {
        switch (selectedRole) {
            case ROLES.PATIENT:
                return patientSchema;
            case ROLES.DOCTOR:
                return doctorSchema;
            case ROLES.PHARMACIST:
                return pharmacistSchema;
            default:
                return baseSchema;
        }
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isValid },
        setValue,
        reset,
        getValues
    } = useForm({
        resolver: zodResolver(getSchemaForRole()),
        mode: 'onChange',
        defaultValues: getDefaultValues(ROLES.PATIENT)
    });

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (['name', 'email', 'password', 'confirmPassword', 'role'].includes(name)) {
                setFormValues(prev => ({
                    ...prev,
                    [name]: value[name]
                }));
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const watchedRole = watch('role');

    useEffect(() => {
        if (watchedRole !== selectedRole) {
            console.log(`Role changed from ${selectedRole} to ${watchedRole}`);
            setSelectedRole(watchedRole);
            setFormValues(prev => ({
                ...prev,
                role: watchedRole
            }));

            const newDefaults = getDefaultValues(watchedRole);
            console.log('Setting new default values:', newDefaults);
            reset(newDefaults);
        }
    }, [watchedRole, selectedRole, reset]);

    const validateStep1 = () => {
        const currentValues = getValues();

        const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'role'];
        const missingFields = requiredFields.filter(field =>
            !currentValues[field] || currentValues[field].trim() === '');

        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return false;
        }

        if (currentValues.password !== currentValues.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(currentValues.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        setFormValues({
            name: currentValues.name,
            email: currentValues.email,
            password: currentValues.password,
            confirmPassword: currentValues.confirmPassword,
            role: currentValues.role
        });

        console.log('Step 1 validated with values:', {
            name: currentValues.name,
            email: currentValues.email,
            password: '******',
            role: currentValues.role
        });

        return true;
    };

    const handleNext = () => {
        let canProceed = true;

        if (activeStep === 0) {
            canProceed = validateStep1();

            if (canProceed) {
                const values = getValues();
                setFormValues(prev => ({
                    ...prev,
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    role: values.role
                }));
            }
        }

        if (canProceed) {
            setError(null); 
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const registrationData = {
                name: formValues.name,
                email: formValues.email,
                password: formValues.password,
                role: formValues.role || selectedRole,
                ...data
            };

            delete registrationData.confirmPassword;

            const requiredFields = ['name', 'email', 'password', 'role'];
            const missingFields = requiredFields.filter(field => !registrationData[field]);

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            if (registrationData.profile) {
                Object.keys(registrationData.profile).forEach(key => {
                    if (registrationData.profile[key] === '') {
                        registrationData.profile[key] = undefined;
                    }
                });

                if (Object.keys(registrationData.profile).every(key =>
                    registrationData.profile[key] === undefined)) {
                    delete registrationData.profile;
                }
            }

            const roleProfileKey = `${selectedRole.toLowerCase()}Profile`;
            if (registrationData[roleProfileKey]) {
                const cleanObject = (obj) => {
                    if (obj && typeof obj === 'object') {
                        Object.keys(obj).forEach(key => {
                            if (typeof obj[key] === 'object') {
                                cleanObject(obj[key]);
                                if (obj[key] && Object.keys(obj[key]).length === 0) {
                                    delete obj[key];
                                }
                            } else if (obj[key] === '') {
                                obj[key] = undefined;
                            }
                        });
                    }
                };

                cleanObject(registrationData[roleProfileKey]);

                if (Object.keys(registrationData[roleProfileKey]).length === 0) {
                    delete registrationData[roleProfileKey];
                }
            }

            console.log('Final registration data:', JSON.stringify(registrationData, null, 2));

            const success = await registerUser(registrationData);

            if (success) {
                console.log(`Registration successful! Redirecting to ${ROLE_ROUTES[registrationData.role].dashboard}`);
                router.push(ROLE_ROUTES[registrationData.role].dashboard);
            } else {
                setActiveStep(0);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.details) {
                console.error('Validation details:', JSON.stringify(err.response.data.details, null, 2));
            }
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box className="space-y-4">
                        <TextField
                            {...register('name')}
                            label="Full Name"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            disabled={isSubmitting}
                        />
                        <TextField
                            {...register('email')}
                            label="Email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            disabled={isSubmitting}
                        />
                        <TextField
                            {...register('password')}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            disabled={isSubmitting}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            {...register('confirmPassword')}
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            disabled={isSubmitting}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={toggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel>Role</InputLabel>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Role"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setSelectedRole(e.target.value);
                                            reset(getDefaultValues(e.target.value));
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        <MenuItem value={ROLES.PATIENT}>Patient</MenuItem>
                                        <MenuItem value={ROLES.DOCTOR}>Doctor</MenuItem>
                                        <MenuItem value={ROLES.PHARMACIST}>Pharmacist</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.role && (
                                <FormHelperText>{errors.role.message}</FormHelperText>
                            )}
                        </FormControl>
                    </Box>
                );

            case 1:
                return (
                    <>
                        <TextField
                            {...register('profile.phoneNumber')}
                            label="Phone Number"
                            fullWidth
                            margin="normal"
                            error={!!errors.profile?.phoneNumber}
                            helperText={errors.profile?.phoneNumber?.message?.toString()}
                        />

                        <TextField
                            {...register('profile.address')}
                            label="Address"
                            fullWidth
                            margin="normal"
                            error={!!errors.profile?.address}
                            helperText={errors.profile?.address?.message?.toString()}
                        />

                        {selectedRole === ROLES.PATIENT && (
                            <>
                                <TextField
                                    {...register('profile.dateOfBirth')}
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.profile?.dateOfBirth}
                                    helperText={errors.profile?.dateOfBirth?.message?.toString()}
                                />

                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Controller
                                        name="profile.gender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="gender-label"
                                                label="Gender"
                                                error={!!errors.profile?.gender}
                                            >
                                                <MenuItem value="Male">Male</MenuItem>
                                                <MenuItem value="Female">Female</MenuItem>
                                                <MenuItem value="Other">Other</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.profile?.gender && <FormHelperText error>{errors.profile.gender.message?.toString()}</FormHelperText>}
                                </FormControl>
                            </>
                        )}
                    </>
                );

            case 2:
                switch (selectedRole) {
                    case ROLES.PATIENT:
                        return (
                            <>
                                <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
                                <TextField
                                    {...register('patientProfile.emergencyContact.name')}
                                    label="Emergency Contact Name"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.patientProfile?.emergencyContact?.name}
                                    helperText={errors.patientProfile?.emergencyContact?.name?.message?.toString()}
                                />
                                <TextField
                                    {...register('patientProfile.emergencyContact.relationship')}
                                    label="Relationship"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.patientProfile?.emergencyContact?.relationship}
                                    helperText={errors.patientProfile?.emergencyContact?.relationship?.message?.toString()}
                                />
                                <TextField
                                    {...register('patientProfile.emergencyContact.phoneNumber')}
                                    label="Emergency Contact Phone"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.patientProfile?.emergencyContact?.phoneNumber}
                                    helperText={errors.patientProfile?.emergencyContact?.phoneNumber?.message?.toString()}
                                />

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" gutterBottom>Insurance Information</Typography>
                                <TextField
                                    {...register('patientProfile.insurance.provider')}
                                    label="Insurance Provider"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.patientProfile?.insurance?.provider}
                                    helperText={errors.patientProfile?.insurance?.provider?.message?.toString()}
                                />
                                <TextField
                                    {...register('patientProfile.insurance.policyNumber')}
                                    label="Policy Number"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.patientProfile?.insurance?.policyNumber}
                                    helperText={errors.patientProfile?.insurance?.policyNumber?.message?.toString()}
                                />
                            </>
                        );

                    case ROLES.DOCTOR:
                        return (
                            <>
                                <TextField
                                    {...register('doctorProfile.specialization')}
                                    label="Specialization"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.doctorProfile?.specialization}
                                    helperText={errors.doctorProfile?.specialization?.message?.toString()}
                                />
                                <TextField
                                    {...register('doctorProfile.licenseNumber')}
                                    label="License Number"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.doctorProfile?.licenseNumber}
                                    helperText={errors.doctorProfile?.licenseNumber?.message?.toString()}
                                />
                                <TextField
                                    {...register('doctorProfile.yearsOfExperience')}
                                    label="Years of Experience"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.doctorProfile?.yearsOfExperience}
                                    helperText={errors.doctorProfile?.yearsOfExperience?.message?.toString()}
                                />
                            </>
                        );

                    case ROLES.PHARMACIST:
                        return (
                            <>
                                <TextField
                                    {...register('pharmacistProfile.licenseNumber')}
                                    label="License Number"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.pharmacistProfile?.licenseNumber}
                                    helperText={errors.pharmacistProfile?.licenseNumber?.message?.toString()}
                                />

                                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Pharmacy Information</Typography>
                                <TextField
                                    {...register('pharmacistProfile.pharmacy.name')}
                                    label="Pharmacy Name"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.pharmacistProfile?.pharmacy?.name}
                                    helperText={errors.pharmacistProfile?.pharmacy?.name?.message?.toString()}
                                />
                                <TextField
                                    {...register('pharmacistProfile.pharmacy.address')}
                                    label="Pharmacy Address"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.pharmacistProfile?.pharmacy?.address}
                                    helperText={errors.pharmacistProfile?.pharmacy?.address?.message?.toString()}
                                />
                                <TextField
                                    {...register('pharmacistProfile.pharmacy.phoneNumber')}
                                    label="Pharmacy Phone Number"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.pharmacistProfile?.pharmacy?.phoneNumber}
                                    helperText={errors.pharmacistProfile?.pharmacy?.phoneNumber?.message?.toString()}
                                />
                            </>
                        );

                    default:
                        return null;
                }

            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Create Account
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {renderStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="outlined"
                        >
                            Back
                        </Button>

                        {activeStep === steps.length - 1 ? (
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !isValid}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                disabled={activeStep === 0 && (
                                    !watch('name') ||
                                    !watch('email') ||
                                    !watch('password') ||
                                    !watch('confirmPassword') ||
                                    watch('password') !== watch('confirmPassword')
                                )}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </form>
            </Paper>
        </motion.div>
    );
} 