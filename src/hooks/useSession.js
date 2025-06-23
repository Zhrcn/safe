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

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleUserActivity);
        });

        const intervalId = setInterval(checkSession, 60000);

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUserActivity);
            });
            clearInterval(intervalId);
        };
    }, [dispatch, sessionTimeout]);

    return null;
}; 