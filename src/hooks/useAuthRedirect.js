import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectAuthChecked } from '@/store/slices/auth/authSlice';

export const useAuthRedirect = () => {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authChecked = useSelector(selectAuthChecked);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (authChecked && isAuthenticated && user?.role) {
            setIsRedirecting(true);
            const dashboardPath = `/${user.role}/dashboard`;
            router.replace(dashboardPath);
        }
    }, [authChecked, isAuthenticated, user?.role, router]);

    return { isAuthenticated, user, isRedirecting, authChecked };
}; 