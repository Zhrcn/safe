'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/services/user/authApi';
import { setCredentials, setError, clearError } from '@/store/slices/auth/authSlice';
import { motion } from 'framer-motion';
import { ROLE_ROUTES } from '@/config/app-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm({ role, redirectUrl }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const userRole = useAppSelector(state => state.auth.role);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated && userRole) {
            const dashboardPath = ROLE_ROUTES[userRole.toLowerCase()]?.dashboard;
            if (dashboardPath) {
                console.log('Navigating to:', dashboardPath);
                router.push(dashboardPath);
            } else {
                console.error('No dashboard path found for role:', userRole);
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, userRole, router]);

    const handleLogin = async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await login(credentials);
            if (result.success && result.data) {
                const userRole = result.data.user?.role?.toLowerCase() || 'patient';
                dispatch(setCredentials({
                    user: {
                        ...result.data.user,
                        role: userRole
                    },
                    token: result.data.token
                }));
                const dashboardPath = ROLE_ROUTES[userRole]?.dashboard;
                if (dashboardPath) {
                    console.log('Navigating to:', dashboardPath);
                    router.push(dashboardPath);
                } else {
                    console.error('No dashboard path found for role:', userRole);
                    router.push('/dashboard');
                }
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.data?.message || err.message || 'An error occurred during login';
            setError(errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            dispatch(clearError());
            await handleLogin({
                ...data,
                role: role?.toLowerCase()
            });
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.data?.message || err.message || 'An error occurred during login';
            setError(errorMessage);
            dispatch(setError(errorMessage));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-md mx-auto p-6"
        >
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold">
                        Welcome Back
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    {...register('password')}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                <Button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}