'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from '@/components/ui/Notification';
import { ROLES, ROLE_ROUTES } from '@/lib/config';
import { authService } from '@/services';

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

    // Synchronous initial check to prevent flash of unauthenticated content
    useEffect(() => {
        try {
            // Immediately try to get user from localStorage to prevent flashing
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            const userData = localStorage.getItem(USER_STORAGE_KEY);

            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    setUser(user);
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        } catch (e) {
            console.error('Error in sync auth check:', e);
        }
    }, []);

    // Async check for full validation
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check for token in localStorage
                const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                const userData = localStorage.getItem(USER_STORAGE_KEY);

                if (token && userData) {
                    try {
                        // Decode and validate token
                        const decoded = jwtDecode(token);
                        const currentTime = Date.now() / 1000;

                        // Check if token is expired
                        if (decoded.exp && decoded.exp < currentTime) {
                            console.log('Token expired, logging out');
                            await handleLogout();
                            return;
                        }

                        // If token is valid, set the user
                        const user = JSON.parse(userData);
                        setUser(user);
                        console.log('User authenticated from localStorage:', user.email);
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        await handleLogout();
                    }
                } else {
                    // No token in localStorage, check if there's a cookie-based session
                    try {
                        const data = await authService.checkAuth();
                        if (data.authenticated && data.user) {
                            console.log('User authenticated from cookie:', data.user.email);
                            // Save to localStorage for future use
                            const token = data.token || 'cookie-auth';
                            localStorage.setItem(TOKEN_STORAGE_KEY, token);
                            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
                            setUser(data.user);
                        } else {
                            setUser(null);
                        }
                    } catch (error) {
                        console.error('Error checking cookie auth:', error);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (email, password, role) => {
        setIsLoading(true);
        try {
            const response = await authService.login(email, password, role);
            const { token, user } = response;

            // Store in localStorage for client-side auth
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

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
            const response = await authService.register(userData);
            const { token, user } = response;

            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

            setUser(user);
            notification.showNotification('Registration successful', 'success');
            return true;
        } catch (error) {
            console.error('Registration error:', error);

            let errorMessage = 'Registration failed. Please try again.';

            if (error.response?.data) {
                const { error: errorText, details } = error.response.data;

                if (errorText) {
                    errorMessage = errorText;
                }

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

    const handleLogout = async () => {
        try {
            // Call the logout API to clear server-side cookies
            await authService.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear localStorage
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);

            // Clear user state
            setUser(null);

            // Redirect to home page
            router.push('/');
            notification.showNotification('Logged out successfully', 'info');
        }
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