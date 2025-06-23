import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '@/store/slices/auth/authSlice';
import { AUTH_CONSTANTS } from '@/config/constants';
import { getToken } from '@/utils/tokenUtils';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const token = getToken();
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Token verification failed');
                }

                const data = await response.json();
                if (!data.success) {
                    throw new Error('Token verification failed');
                }

                const currentRole = pathname.split('/')[1];
                if (currentRole && currentRole !== userRole) {
                    throw new Error('Unauthorized access');
                }

            } catch (error) {
                console.error('Auth error:', error);
                setError(error.message);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, dispatch, pathname, userRole]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}