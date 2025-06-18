import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLastActivity, checkSessionTimeout, selectSessionTimeout } from '@/store/slices/auth/authSlice';

export const useSession = () => {
    const dispatch = useDispatch();
    const sessionTimeout = useSelector(selectSessionTimeout);

    useEffect(() => {
        const handleUserActivity = () => {
            dispatch(updateLastActivity());
        };

        const checkSession = () => {
            dispatch(checkSessionTimeout());
        };

        // Add event listeners for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleUserActivity);
        });

        // Check session timeout periodically
        const intervalId = setInterval(checkSession, 60000); // Check every minute

        // Cleanup
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUserActivity);
            });
            clearInterval(intervalId);
        };
    }, [dispatch, sessionTimeout]);

    return null;
}; 