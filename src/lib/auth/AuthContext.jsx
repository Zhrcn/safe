'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/lib/services/api';
import { useNotification } from '@/components/ui/Notification';
import { ROLES, ROLE_ROUTES } from '@/lib/config';

const AuthContext = createContext(undefined);

const TOKEN_STORAGE_KEY = 'safe_auth_token';
const USER_STORAGE_KEY = 'safe_user_data';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const notification = useNotification();

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                const userData = localStorage.getItem(USER_STORAGE_KEY);

                if (token && userData) {
                    // Verify token is valid and not expired
                    try {
                        const decoded = jwtDecode(token);
                        const currentTime = Date.now() / 1000;

                        if (decoded.exp && decoded.exp < currentTime) {
                            // Token expired
                            handleLogout();
                            return;
                        }

                        // Token is valid
                        setUser(JSON.parse(userData));
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        handleLogout();
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (email, password, role) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(email, password, role);
            const { token, user } = response.data;

            // Store token and user data in localStorage
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

            // Update state
            setUser(user);
            notification.showNotification('Login successful', 'success');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
            notification.showNotification(errorMessage, 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        setIsLoading(true);
        try {
            const response = await authApi.register(userData);
            const { token, user } = response.data;

            // Store token and user data in localStorage
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

            // Update state
            setUser(user);
            notification.showNotification('Registration successful', 'success');
            return true;
        } catch (error) {
            console.error('Registration error:', error);

            // Extract and format error messages from the API response
            let errorMessage = 'Registration failed. Please try again.';

            if (error.response?.data) {
                const { error: errorText, details } = error.response.data;

                if (errorText) {
                    errorMessage = errorText;
                }

                // If there are validation details, format them for display
                if (details && Array.isArray(details)) {
                    const validationErrors = details
                        .map(err => `${err.path}: ${err.message}`)
                        .join('; ');

                    if (validationErrors) {
                        errorMessage += ` (${validationErrors})`;
                    }
                }
            }

            notification.showNotification(errorMessage, 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear auth data from localStorage
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        // Reset state
        setUser(null);

        // Redirect to home page
        router.push('/');
        notification.showNotification('Logged out successfully', 'info');
    };

    const updateUserData = (data) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                updateUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}; 