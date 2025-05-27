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
    Paper
} from '@mui/material';
import { useAuth } from '@/lib/auth/AuthContext';
import { motion } from 'framer-motion';
import { ROLE_ROUTES } from '@/lib/config';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm({ role, redirectUrl }) {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Attempt to login
            const success = await login(data.email, data.password, role);

            if (success) {
                if (redirectUrl) {
                    console.log(`Login successful! Redirecting to ${redirectUrl}`);
                    router.push(redirectUrl);
                } else {
                    console.log(`Login successful! Redirecting to ${ROLE_ROUTES[role].dashboard}`);
                    // Redirect to the appropriate dashboard based on role
                    router.push(ROLE_ROUTES[role].dashboard);
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={3} className="p-8 max-w-md mx-auto">
                <Typography variant="h5" component="h1" gutterBottom className="text-center">
                    Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isSubmitting}
                    />

                    {error && (
                        <Alert severity="error" className="mt-4">
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting}
                        className="mt-6"
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>
            </Paper>
        </motion.div>
    );
} 