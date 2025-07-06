import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '@/store/api/authApi';
import { logoutUser, setCredentials, selectCurrentUser, selectIsAuthenticated } from '@/store/slices/auth/authSlice';
import { removeToken } from '@/utils/tokenUtils';
import { getToken } from '@/utils/tokenUtils';

export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { data, error, isLoading } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated || !getToken()
    });

    useEffect(() => {
        // If we have a current user from Redux state, use that for routing
        if (currentUser && isAuthenticated) {
            const userRole = currentUser.role?.toLowerCase();
            const pathRole = pathname.split('/')[1]?.toLowerCase();
            if (pathRole && pathRole !== userRole) {
                router.replace(`/${userRole}/dashboard`);
            }
            return;
        }

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        // Only check API if we don't have current user but are authenticated
        if (isLoading) return;
        if (error || !data?.success || !data?.data?.user) {
            console.log('Logging out due to error or missing user:', { error, data });
            dispatch(logoutUser());
            router.replace('/login');
            return;
        }
        
        // Only update credentials if we don't already have them
        if (!currentUser) {
            dispatch(setCredentials({ user: data.data.user, token: getToken() }));
        }
    }, [isLoading, error, data, pathname, dispatch, router, currentUser, isAuthenticated]);

    // Only show loading if we're making an API call and don't have current user
    if (isLoading && !currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Only show error if we don't have current user and API call failed
    if (!currentUser && (error || !data?.success || !data?.data?.user)) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-destructive">
                    Unauthorized access. Redirecting to login...
                </p>
            </div>
        );
    }

    return children;
}