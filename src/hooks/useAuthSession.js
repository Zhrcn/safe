import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import {
    selectIsAuthenticated,
    selectLastActivity,
    selectAuthChecked,
    updateLastActivity,
    logout
} from '@/store/slices/authSlice';
import { useGetCurrentUserQuery } from '@/store/services/user/userApi';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute

export const useAuthSession = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const lastActivity = useAppSelector(selectLastActivity);
    const authChecked = useAppSelector(selectAuthChecked);

    // Fetch current user data
    const { data: user, isLoading: userLoading } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated || !authChecked
    });

    // Update last activity on user interaction
    const updateActivity = useCallback(() => {
        if (isAuthenticated) {
            dispatch(updateLastActivity());
        }
    }, [isAuthenticated, dispatch]);

    // Check session timeout
    useEffect(() => {
        if (!isAuthenticated) return;

        const checkSessionTimeout = () => {
            const now = Date.now();
            if (lastActivity && now - lastActivity > SESSION_TIMEOUT) {
                dispatch(logout());
                router.push('/');
            }
        };

        // Add event listeners for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        // Check session timeout periodically
        const interval = setInterval(checkSessionTimeout, ACTIVITY_CHECK_INTERVAL);

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
            clearInterval(interval);
        };
    }, [isAuthenticated, lastActivity, dispatch, router, updateActivity]);

    return {
        isAuthenticated,
        user,
        isLoading: userLoading,
        authChecked
    };
}; 