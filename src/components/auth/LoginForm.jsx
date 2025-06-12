'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
    InputAdornment,
    IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAppDispatch } from '@/store/hooks';
import { useLoginMutation } from '@/store/services/user/authApi';
import { setCredentials, setError, clearError } from '@/store/slices/user/authSlice';
import { motion } from 'framer-motion';
import { ROLE_ROUTES } from '@/config/app-config';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm({ role, redirectUrl }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [error, setLocalError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            setLocalError(null);
            dispatch(clearError());

            const result = await login({
                ...data,
                role
            }).unwrap();

            if (result.success && result.data) {
                dispatch(setCredentials({
                    user: result.data.user,
                    token: result.data.token
                }));

                // Navigate based on role
                const userRole = result.data.user.role.toLowerCase();
                router.push(redirectUrl || ROLE_ROUTES[userRole]?.dashboard || '/dashboard');
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.data?.message || err.message || 'An error occurred during login';
            setLocalError(errorMessage);
            dispatch(setError(errorMessage));
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                p: 3
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Welcome Back
                </Typography>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 2 }}
                        onClose={() => {
                            setLocalError(null);
                            dispatch(clearError());
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register('email')}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        {...register('password')}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isLoading}
                        sx={{ mt: 3 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
} 