'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectAuthToken,
    selectAuthLoading,
    selectAuthError,
    selectAuthChecked,
    setCredentials,
    logout,
    setLoading,
    setError,
    clearError,
    updateUser,
    setAuthChecked
} from '@/store/slices/user/authSlice';
import {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery
} from '@/store/services/user/userApi';
import { ROLE_ROUTES } from '@/config/app-config';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    // Selectors
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const token = useAppSelector(selectAuthToken);
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const authChecked = useAppSelector(selectAuthChecked);

    // API mutations and queries
    const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
    const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();
    const [logoutMutation] = useLogoutMutation();
    const { data: userData, isLoading: userLoading } = useGetCurrentUserQuery(undefined, {
        skip: !token || !authChecked
    });

    // Combined loading state
    const isLoading = loading || loginLoading || registerLoading || userLoading;

    // Initialize auth state
    useEffect(() => {
        if (!authChecked) {
            dispatch(setAuthChecked(true));
        }
    }, [authChecked, dispatch]);

    // Update user data when fetched
    useEffect(() => {
        if (userData) {
            dispatch(updateUser(userData));
        }
    }, [userData, dispatch]);

    // Login handler
    const handleLogin = async (credentials) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const result = await loginMutation(credentials).unwrap();
            
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));

            // Navigate based on role
            const role = result.user.role.toLowerCase();
            router.push(ROLE_ROUTES[role]?.dashboard || '/dashboard');
            
            return { success: true };
        } catch (err) {
            const errorMessage = err.data?.message || err.message || 'Login failed';
            dispatch(setError(errorMessage));
            return { success: false, error: errorMessage };
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Register handler
    const handleRegister = async (userData) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const result = await registerMutation(userData).unwrap();
            
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));

            // Navigate based on role
            const role = result.user.role.toLowerCase();
            router.push(ROLE_ROUTES[role]?.dashboard || '/dashboard');
            
            return { success: true };
        } catch (err) {
            const errorMessage = err.data?.message || err.message || 'Registration failed';
            dispatch(setError(errorMessage));
            return { success: false, error: errorMessage };
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            dispatch(logout());
            router.push('/');
        }
    };

    // Update user profile
    const handleUpdateProfile = useCallback((userData) => {
        dispatch(updateUser(userData));
    }, [dispatch]);

    // Role check functions
    const isAdmin = () => user?.role === 'admin';
    const isDoctor = () => user?.role === 'doctor';
    const isPatient = () => user?.role === 'patient';
    const hasRole = (role) => user?.role === role;

    return {
        // State
        user,
        isAuthenticated,
        token,
        loading: isLoading,
        error,
        authChecked,

        // Actions
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
        clearError: () => dispatch(clearError()),

        // Role checks
        isAdmin,
        isDoctor,
        isPatient,
        hasRole
    };
}; 