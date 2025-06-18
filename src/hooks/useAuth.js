import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    useLoginMutation,
    useLogoutMutation,
    useVerifyTokenQuery
} from '@/store/services/user/authApi';
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

    // Selectors
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectAuthToken);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const authChecked = useSelector(selectAuthChecked);

    // API Hooks
    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const { refetch: verifyToken } = useVerifyTokenQuery(undefined, {
        skip: !token
    });

    // Login function
    const login = async (credentials) => {
        try {
            const result = await loginMutation(credentials).unwrap();
            if (result.success) {
                // Redirect based on role
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

    // Logout function
    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logout());
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            dispatch(logout());
            router.push('/login');
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    // Get user's role
    const getUserRole = () => {
        return user?.role;
    };

    // Get user's name
    const getUserName = () => {
        return user?.name || user?.username || 'User';
    };

    // Get user's email
    const getUserEmail = () => {
        return user?.email;
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === ROLES.ADMIN;
    };

    // Check if user is doctor
    const isDoctor = () => {
        return user?.role === ROLES.DOCTOR;
    };

    // Check if user is patient
    const isPatient = () => {
        return user?.role === ROLES.PATIENT;
    };

    return {
        // State
        user,
        isAuthenticated,
        token,
        loading,
        error,
        authChecked,

        // Actions
        login,
        logout: handleLogout,
        verifyToken,

        // Role checks
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