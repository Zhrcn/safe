'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useVerifyTokenQuery } from '@/store/services/user/authApi';
import { setCredentials, logout } from '@/store/slices/user/authSlice';
import { Box, CircularProgress, Alert } from '@mui/material';

export default function ProtectedLayout({ children, allowedRoles = [] }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const { user, token } = useAppSelector((state) => state.auth);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authError, setAuthError] = useState(null);

    console.log('ProtectedLayout - Current state:', {
        hasToken: !!token,
        hasUser: !!user,
        isAuthorized,
        pathname,
        allowedRoles,
        userRole: user?.role
    });

    const { data: verifyResult, error: verifyError, isLoading } = useVerifyTokenQuery(
        undefined,
        {
            skip: !token,
            refetchOnMountOrArgChange: true
        }
    );

    console.log('Token verification status:', {
        isLoading,
        hasVerifyResult: !!verifyResult,
        hasVerifyError: !!verifyError,
        verifyResult,
        verifyError
    });

    useEffect(() => {
        console.log('Auth effect running with:', {
            hasToken: !!token,
            hasVerifyResult: !!verifyResult,
            hasVerifyError: !!verifyError,
            pathname,
            userRole: user?.role
        });

        if (!token) {
            console.log('No token found, redirecting to login');
            setAuthError('No authentication token found');
            router.push('/');
            return;
        }

        if (verifyError) {
            console.error('Token verification failed:', verifyError);
            setAuthError('Token verification failed');
            dispatch(logout());
            router.push('/');
            return;
        }

        if (verifyResult?.success && verifyResult?.data) {
            console.log('Token verification successful:', verifyResult);
            const userData = verifyResult.data.user;
            
            // Ensure user data has required fields
            if (!userData || !userData.role) {
                console.error('Invalid user data:', userData);
                setAuthError('Invalid user data');
                dispatch(logout());
                router.push('/');
                return;
            }

            const userRole = userData.role.toLowerCase();
            console.log('User role:', userRole);

            dispatch(setCredentials({
                user: userData,
                token: verifyResult.data.token || token
            }));

            // Check role-based access
            const pathRole = pathname.split('/')[1]?.toLowerCase();
            console.log('Checking role access:', { pathRole, userRole, allowedRoles });

            // If specific roles are provided, check against those
            if (allowedRoles.length > 0) {
                if (!allowedRoles.includes(userRole)) {
                    console.log('User role not in allowed roles');
                    setAuthError('Unauthorized access');
                    router.push('/unauthorized');
                    return;
                }
            }
            // Otherwise, check against the path role
            else if (pathRole && pathRole !== userRole) {
                console.log('Path role does not match user role');
                setAuthError('Unauthorized access');
                router.push('/unauthorized');
                return;
            }

            console.log('Authorization successful');
            setIsAuthorized(true);
            setAuthError(null);
        }
    }, [token, verifyResult, verifyError, dispatch, router, pathname, allowedRoles, user?.role]);

    if (isLoading) {
        console.log('Showing loading state');
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (authError) {
        console.log('Showing auth error:', authError);
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    p: 2
                }}
            >
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    {authError}
                </Alert>
            </Box>
        );
    }

    if (!isAuthorized || !user || !token) {
        console.log('Not authorized or missing user/token');
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    console.log('Rendering protected content');
    return children;
} 