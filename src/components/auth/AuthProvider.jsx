import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreAuth, selectAuthChecked } from '@/store/slices/auth/authSlice';

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const authChecked = useSelector(selectAuthChecked);

    useEffect(() => {
        if (!authChecked) {
            dispatch(restoreAuth());
        }
    }, [dispatch, authChecked]);

    if (!authChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return children;
} 