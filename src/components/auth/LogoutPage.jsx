'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useLogoutMutation } from '@/store/services/user/authApi';
import { logoutUser } from '@/store/slices/auth/authSlice';
import { Loader2 } from 'lucide-react';
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
                dispatch(logoutUser());
                router.push('/');
            }
        };
        performLogout();
    }, [dispatch, router, logoutMutation]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
                Logging out...
            </h2>
        </div>
    );
}