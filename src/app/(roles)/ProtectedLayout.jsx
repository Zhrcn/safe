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
        if (currentUser && isAuthenticated) {
            const userRole = currentUser.role?.toLowerCase();
            const pathRole = pathname.split('/')[1]?.toLowerCase();
            if (pathRole && pathRole !== userRole) {
                router.replace(`/${userRole}/dashboard`);
            }
            return;
        }

        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        if (isLoading) return;
        if (error || !data?.success || !data?.data?.user) {
            console.log('Logging out due to error or missing user:', { error, data });
            dispatch(logoutUser());
            router.replace('/login');
            return;
        }
        
        if (!currentUser) {
            dispatch(setCredentials({ user: data.data.user, token: getToken() }));
        }
    }, [isLoading, error, data, pathname, dispatch, router, currentUser, isAuthenticated]);

    if (isLoading && !currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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