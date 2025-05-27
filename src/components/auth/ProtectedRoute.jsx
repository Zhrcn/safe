'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '@/lib/auth/AuthContext';
import { useNotification } from '@/components/ui/Notification';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const notification = useNotification();

    useEffect(() => {
        // Skip checks if still loading
        if (isLoading) return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            notification.showNotification('Please log in to access this page', 'warning');
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        // If role restrictions and user doesn't have an allowed role
        if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
            notification.showNotification('You do not have permission to access this page', 'error');

            // Redirect to appropriate dashboard based on role
            switch (user.role) {
                case 'patient':
                    router.push('/patient/dashboard');
                    break;
                case 'doctor':
                    router.push('/doctor/dashboard');
                    break;
                case 'pharmacist':
                    router.push('/pharmacist/dashboard');
                    break;
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isLoading, isAuthenticated, user, router, pathname, notification, allowedRoles]);

    // Show loading state
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    // Show unauthorized message if not authenticated or not allowed
    if (!isAuthenticated || (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role))) {
        return null; // This will be redirected in the useEffect
    }

    // If authenticated and authorized, render children
    return <>{children}</>;
} 