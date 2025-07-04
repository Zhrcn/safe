import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '@/store/api/authApi';
import { logout, setCredentials } from '@/store/slices/auth/authSlice';
import { removeToken } from '@/utils/tokenUtils';
import { getToken } from '@/utils/tokenUtils';
import { setCurrentUser } from '@/store/slices/user/userSlice';

export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { data, error, isLoading } = useGetCurrentUserQuery();

    useEffect(() => {
        console.log('ProtectedLayout:', { isLoading, error, data });
        if (isLoading) return;
        if (error || !data?.success || !data?.data?.user) {
            console.log('Logging out due to error or missing user:', { error, data });
            removeToken();
            dispatch(logout());
            router.replace('/login');
            return;
        }
        dispatch(setCredentials({ user: data.data.user, token: getToken() }));
        dispatch(setCurrentUser({ user: data.data.user, token: getToken() }));

        const userRole = data.data.user.role?.toLowerCase();
        const pathRole = pathname.split('/')[1]?.toLowerCase();
        if (pathRole && pathRole !== userRole) {
            router.replace(`/${userRole}/dashboard`);
        }
    }, [isLoading, error, data, pathname, dispatch, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data?.success || !data?.data?.user) {
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