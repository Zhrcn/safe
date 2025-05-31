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
        if (isLoading) return;

        if (!isAuthenticated) {
            notification.showNotification('Please log in to access this page', 'warning');
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
            notification.showNotification('You do not have permission to access this page', 'error');

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

    if (!isAuthenticated || (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
} 