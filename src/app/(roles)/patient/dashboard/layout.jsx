'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AUTH_CONSTANTS } from '@/config/constants';
import { getToken } from '@/utils/tokenUtils';

export default function PatientDashboardLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            if (!token) {
                console.log('No token found, redirecting to login');
                router.push('/login');
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            fetch(`${apiUrl}/api/v1/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Token verification failed');
                }
                return response.json();
            })
            .then(data => {
                if (!data.success) {
                    throw new Error('Token verification failed');
                }
            })
            .catch(error => {
                console.error('Auth error:', error);
                router.push('/login');
            });
        };

        checkAuth();
    }, [router, dispatch]);

    return <>{children}</>;
} 