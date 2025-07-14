import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    useLoginMutation,
    useLogoutMutation,
    useGetCurrentUserQuery
} from '@/store/api/authApi';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectAuthToken,
    selectAuthLoading,
    selectAuthError,
    selectAuthChecked,
    logout,
    setCredentials
} from '@/store/slices/auth/authSlice';
import { ROLES, ROLE_ROUTES } from '@/config/app-config';

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectAuthToken);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const authChecked = useSelector(selectAuthChecked);

    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const { refetch: verifyToken } = useGetCurrentUserQuery(undefined, {
        skip: !token
    });

    const login = async (credentials) => {
        try {
            const result = await loginMutation(credentials).unwrap();
            if (result.success) {
                const roleRoute = ROLE_ROUTES[result.user.role] || '/';
                router.push(roleRoute);
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    };

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logout());
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            dispatch(logout());
            router.push('/login');
        }
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    const getUserRole = () => {
        return user?.role;
    };

    const getUserName = () => {
        return user?.name || user?.username || 'User';
    };

    const getUserEmail = () => {
        return user?.email;
    };

    const isAdmin = () => {
        return user?.role === ROLES.ADMIN;
    };

    const isDoctor = () => {
        return user?.role === ROLES.DOCTOR;
    };

    const isPatient = () => {
        return user?.role === ROLES.PATIENT;
    };

    return {
        user,
        isAuthenticated,
        token,
        loading,
        error,
        authChecked,
        login,
        logout: handleLogout,
        verifyToken,
        hasRole,
        hasAnyRole,
        getUserRole,
        getUserName,
        getUserEmail,
        isAdmin,
        isDoctor,
        isPatient
    };
}; 