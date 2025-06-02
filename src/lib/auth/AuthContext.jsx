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
                setIsLoading(true);
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
            console.log(`Logging in as ${email} with role ${role}...`);
            const response = await authService.login(email, password, role);
            const { token, user } = response;

            console.log('Login successful, received token and user data');

            // Store in localStorage for client-side auth
            try {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
                console.log('Saved auth data to localStorage');
            } catch (storageError) {
                console.error('Failed to save to localStorage:', storageError);
            }

            // Multi-layered approach to ensure cookie is set
            await ensureAuthCookieIsSet(token);

            // Set user state after everything is done
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

    // Helper function to ensure the auth cookie is set using multiple approaches
    const ensureAuthCookieIsSet = async (token) => {
        try {
            console.log('Setting auth cookie...');

            // Approach 1: Direct document.cookie setting
            const cookieOptions = [
                `safe_auth_token=${encodeURIComponent(token)}`,
                'path=/',
                `max-age=${30 * 24 * 60 * 60}`, // 30 days
                'SameSite=Lax'
            ];

            // Don't add secure flag in development
            if (window.location.protocol === 'https:') {
                cookieOptions.push('secure');
            }

            document.cookie = cookieOptions.join('; ');
            console.log('Approach 1: Set cookie via document.cookie');

            // Approach 2: Use server endpoint to set the cookie
            try {
                console.log('Approach 2: Using server endpoint to set cookie');
                const response = await fetch('/api/auth/refresh-cookie', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include', // Important for cookies
                    body: JSON.stringify({ token }) // Also include token in body
                });

                console.log('Cookie refresh response:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Cookie set by server:', data);
                }
            } catch (fetchError) {
                console.error('Failed to set cookie via server:', fetchError);
            }

            // Verify cookie was set
            setTimeout(() => {
                const hasCookie = document.cookie.includes('safe_auth_token');
                console.log('Auth cookie verification:', {
                    'cookie_exists': hasCookie,
                    'localStorage_has_token': !!localStorage.getItem(TOKEN_STORAGE_KEY)
                });
            }, 500);
        } catch (error) {
            console.error('Error setting auth cookie:', error);
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