 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useLogoutMutation } from '@/store/services/user/authApi';
import { logout } from '@/store/slices/user/authSlice';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LogoutPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [logoutMutation] = useLogoutMutation();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logoutMutation().unwrap();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Clear local state regardless of API success
                dispatch(logout());
                router.push('/');
            }
        };

        performLogout();
    }, [dispatch, router, logoutMutation]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 2
            }}
        >
            <CircularProgress />
            <Typography variant="h6">
                Logging out...
            </Typography>
        </Box>
    );
}