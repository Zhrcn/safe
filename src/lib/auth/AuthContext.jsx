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

// Function to ensure the auth cookie is set
const ensureAuthCookieIsSet = async (token) => {
    try {
        // This is a client-side only function, so we need to check if we're in a browser
        if (typeof window !== 'undefined') {
            // Only log in development environment
            if (process.env.NODE_ENV !== 'production') {
                console.log('Setting auth cookie...');
            }
            // The actual cookie is set by the server in the response
            // This is just a helper to ensure the cookie is set
            await authService.setCookie(token);
            
            // Only log in development environment
            if (process.env.NODE_ENV !== 'production') {
                console.log('Auth cookie set successfully');
            }
        }
    } catch (error) {
        // Always log errors, but with less detail in production
        if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to set auth cookie:', error);
        } else {
            console.error('Failed to set auth cookie');
        }
        // Continue even if cookie setting fails, as we have localStorage as a backup
    }
};

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

    useEffect(() => {
        try {
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

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                // Check for token in localStorage
                const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                const userData = localStorage.getItem(USER_STORAGE_KEY);

                if (token && userData) {
                    try {
                        const decoded = jwtDecode(token);
                        const currentTime = Date.now() / 1000;

                        if (decoded.exp && decoded.exp < currentTime) {
                            console.log('Token expired, logging out');
                            await handleLogout();
                            return;
                        }

                        const user = JSON.parse(userData);
                        setUser(user);
                        console.log('User authenticated from localStorage:', user.email);

                        // Verify the token with the server
                        try {
                            const verifyResponse = await fetch('/api/auth/verify', {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (!verifyResponse.ok) {
                                // Only log out if it's a 401 (Unauthorized) or 403 (Forbidden)
                                if (verifyResponse.status === 401 || verifyResponse.status === 403) {
                                    console.warn('Token verification failed with status:', verifyResponse.status);
                                    await handleLogout();
                                    return;
                                } else {
                                    // For other errors (like 500), continue with local auth
                                    console.warn('Token verification had server error:', verifyResponse.status);
                                    // Continue with local auth
                                }
                            }
                        } catch (verifyError) {
                            console.error('Error verifying token:', verifyError);
                            // Continue with local auth if server is unreachable
                        }
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        await handleLogout();
                    }
                } else {
                    try {
                        const data = await authService.checkAuth();
                        if (data.authenticated && data.user) {
                            console.log('User authenticated from cookie:', data.user.email);
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
            // Only log in development environment
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Logging in as ${email} with role ${role}...`);
            }
            
            // Add specific validation for patient role
            if (role === 'patient') {
                // Convert email to lowercase for case-insensitive comparison
                const emailLower = email.toLowerCase();
                
                // Check if email matches expected format for patients (either @safe.com or @example.com)
                if (!emailLower.includes('@safe.com') && !emailLower.includes('@example.com')) {
                    throw new Error('Patient email must be from safe.com or example.com domain');
                }
                
                // Check if email matches the expected pattern for patients
                const patientExamplePattern = /^patient\d+@example\.com$/;
                const patientSafePattern = /^patient\d+@safe\.com$/;
                
                if (!patientExamplePattern.test(emailLower) && 
                    !patientSafePattern.test(emailLower) && 
                    emailLower !== 'patient@example.com' && 
                    emailLower !== 'patient@safe.com') {
                    throw new Error('Invalid patient email format. Use patient1@safe.com or similar format.');
                }
            }
            
            const response = await authService.login(email, password, role);
            const { token, user } = response;

            // Only log in development environment
            if (process.env.NODE_ENV !== 'production') {
                console.log('Login successful, received token and user data');
            }

            try {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
                
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Saved auth data to localStorage');
                }
            } catch (storageError) {
                console.error('Failed to save to localStorage:', storageError);
            }
        
            // Multi-layered approach to ensure cookie is set
            await ensureAuthCookieIsSet(token);

            setUser(user);
            notification.showNotification('Login successful', 'success');
            return true;
        } catch (error) {
            console.error('Login error:', error);
        
            // Enhanced error handling with specific messages
            let errorMessage = 'Login failed. Please try again.';
        
            if (error.message) {
                // Use custom error messages we defined above
                errorMessage = error.message;
            } else if (error.response?.data) {
                // Extract error details from API response
                const { error: apiError, message, type } = error.response.data;
            
                if (message) {
                    errorMessage = message;
                } else if (apiError) {
                    errorMessage = apiError;
                }
            
                // Add specific context for different error types
                if (type === 'INVALID_CREDENTIALS' && role === 'patient') {
                    errorMessage = 'Invalid patient credentials. For testing, try using "patient123" as the password.';
                } else if (type === 'USER_NOT_FOUND' && role === 'patient') {
                    errorMessage = 'Patient account not found. For testing, use patient1@safe.com with password patient123.';
                } else if (type === 'INVALID_PATIENT_EMAIL_DOMAIN') {
                    errorMessage = 'Patient email must be from safe.com or example.com domain. Try patient1@safe.com.';
                } else if (type === 'INVALID_PATIENT_EMAIL_FORMAT') {
                    errorMessage = 'Invalid patient email format. Use patient1@safe.com or similar format.';
                }
            }
            
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
            await authService.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);

            setUser(null);

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