'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, setCurrentUser, setIsLoading, logoutUser } from '../../store/userSlice';
import { getPatientData } from '../../store/patientSlice'; // Import for fetching patient details
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from '@/components/ui/Notification';
import { ROLES, ROLE_ROUTES } from '@/app-config';
import { authApi } from '../../lib/redux/services/authApi'; // Import authApi for RTK Query

const TOKEN_STORAGE_KEY = 'safe_auth_token';
const USER_STORAGE_KEY = 'safe_user_data';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error: authError } = useSelector(state => state.user);
  const { data: patientProfileData } = useSelector(state => state.patient); // To check if patient data exists
  const router = useRouter();
  const notification = useNotification();
  const authCheckRef = useRef(false); 

  useEffect(() => {
    if (isAuthenticated && user && !patientProfileData) {
      dispatch(getPatientData());
    }
  }, [isAuthenticated, user, patientProfileData, dispatch]);


  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      dispatch(setCurrentUser(null));
      dispatch(setIsLoading(false)); 
      router.push('/');
      notification.showNotification('Logged out successfully', 'info');
    }
  }, [dispatch, router, notification, setCurrentUser, setIsLoading]);

  const checkAuth = useCallback(async () => {
    if (authCheckRef.current) {
      console.log('AuthContext: Auth check already in progress, skipping this run.');
      return;
    }
    authCheckRef.current = true;
    dispatch(setIsLoading(true));

    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const userDataString = localStorage.getItem(USER_STORAGE_KEY);

      if (token && userDataString) {
        let userFromStorage;
        try {
          userFromStorage = JSON.parse(userDataString);
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
          console.log('AuthContext: Triggering logout due to localStorage parsing error.');
          await handleLogout();
          return;
        }

        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp < currentTime) {
            console.log('AuthContext: Token expired based on local check, logging out.');
            console.log('AuthContext: Triggering logout due to expired token.');
            await handleLogout();
            return;
          }

          dispatch(setCurrentUser({ user: userFromStorage, token })); 
          console.log('AuthContext: User provisionally authenticated from localStorage:', userFromStorage.email);

          await new Promise(resolve => setTimeout(resolve, 0));

          console.log('AuthContext: Attempting token verification...');
          const verifyResultAction = await dispatch(authApi.endpoints.verifyToken.initiate(null, { forceRefetch: true }));
          console.log('AuthContext: Token verification result:', verifyResultAction);

          if (verifyResultAction.isError) {
            const status = verifyResultAction.error?.status;
            const errorName = verifyResultAction.error?.name;
            const errorMessage = verifyResultAction.error?.message;

            console.log('AuthContext: Token verification details:', {
              status,
              errorName,
              errorMessage,
              fullError: verifyResultAction.error
            });

            // Only logout for specific error conditions
            if (status === 401 || status === 403) {
              console.warn('AuthContext: Token verification failed with 401/403, logging out.');
              await handleLogout();
              return;
            } else {
              // For other errors (network, server down, parsing), keep the user logged in with local data
              console.warn('AuthContext: Non-critical error during token verification, keeping local auth:', errorMessage);
              // Keep the user logged in with local data
              dispatch(setCurrentUser({ user: userFromStorage, token }));
              return;
            }
          } else if (verifyResultAction.isSuccess) {
            // Handle both direct data and nested data structure
            const verifiedData = verifyResultAction.data?.data || verifyResultAction.data;
            console.log('AuthContext: Verified data:', verifiedData);

            if (verifiedData && verifiedData.user) {
              // Update Redux state and localStorage with potentially newer data from server
              dispatch(setCurrentUser({ user: verifiedData.user, token })); 
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verifiedData.user));
              console.log('AuthContext: Token successfully verified with server. User updated.', verifiedData.user);
              
              // Ensure we're on the correct route for the user's role
              const currentPath = window.location.pathname;
              const dashboardPath = ROLE_ROUTES[verifiedData.user.role]?.dashboard;
              
              if (dashboardPath && !currentPath.startsWith(dashboardPath)) {
                console.log(`AuthContext: Redirecting to correct dashboard path: ${dashboardPath}`);
                try {
                  await router.push(dashboardPath);
                  console.log('AuthContext: Successfully redirected to dashboard');
                } catch (navError) {
                  console.error('AuthContext: Navigation error during redirect:', navError);
                }
              }
            } else {
              // Token valid, but no new user data from server, keep local user data
              console.log('AuthContext: Token verified with server, but user data in response was not as expected. Keeping local data.');
              dispatch(setCurrentUser({ user: userFromStorage, token }));
            }
          } else {
            // Handle cases where the query might not be an error but also not a success with data
            console.log('AuthContext: Token verification returned unexpected response format. Keeping local auth.');
            dispatch(setCurrentUser({ user: userFromStorage, token }));
          }
        } catch (error) { // Catches jwtDecode errors or fetch errors during verification
          console.error('AuthContext: Error during token processing or server verification:', error.message, error.stack);
          console.log('AuthContext: Triggering logout due to general error during token processing/verification.');
          await handleLogout();
        }
      } else {
        // No token or user data in localStorage
        if (isAuthenticated) { // Only dispatch if Redux state is out of sync
            dispatch(setCurrentUser(null));
        }
        console.log('AuthContext: No token/user found in localStorage. User needs to login.');
      }
    } catch (error) { // Outer catch for any unexpected errors in checkAuth logic
      console.error('AuthContext: Unexpected error in checkAuth logic:', error.message, error.stack);
      console.log('AuthContext: Triggering logout due to unexpected error in checkAuth logic.');
      await handleLogout(); // Ensure logout on unexpected error
    } finally {
      dispatch(setIsLoading(false));
      authCheckRef.current = false; // Reset the ref once check is complete
    }
  }, [dispatch, handleLogout, isAuthenticated, setIsLoading, setCurrentUser, jwtDecode]); // Added dependencies

  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Dependency is the memoized checkAuth function

    const handleLogin = useCallback(async (email, password, role) => {
        dispatch(setIsLoading(true));
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
            
            const resultAction = await dispatch(loginUser({ email, password, role }));

            if (loginUser.fulfilled.match(resultAction)) {
                const responsePayload = resultAction.payload; // Contains { message, token, user, source }

                if (process.env.NODE_ENV !== 'production') {
                    console.log('Login successful, received payload:', responsePayload);
                }

                if (responsePayload && responsePayload.token && responsePayload.user) {
                    try {
                        localStorage.setItem(TOKEN_STORAGE_KEY, responsePayload.token);
                        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(responsePayload.user));
                        if (process.env.NODE_ENV !== 'production') {
                            console.log('Saved token and user data to localStorage');
                        }
                        dispatch(setCurrentUser(responsePayload)); // responsePayload is { token, user }
                        notification.showNotification('Login successful', 'success');

                        // ---- START NAVIGATION LOGIC ----
                        const currentUser = responsePayload.user;
                        if (currentUser && currentUser.role) {
                            const dashboardPath = ROLE_ROUTES[currentUser.role]?.dashboard;
                            if (dashboardPath) {
                                console.log(`AuthContext: Attempting navigation to ${dashboardPath} for role ${currentUser.role}`);
                                try {
                                    await router.push(dashboardPath);
                                    console.log(`AuthContext: Successfully navigated to ${dashboardPath}`);
                                } catch (navError) {
                                    console.error('AuthContext: Navigation error:', navError);
                                    // Fallback to home if navigation fails
                                    await router.push('/');
                                }
                            } else {
                                console.error(`No dashboard route defined for role: ${currentUser.role}. Navigating to home.`);
                                await router.push('/');
                            }
                        } else {
                            console.error('User data or role missing after login, cannot navigate.');
                            await router.push('/'); // Fallback to home
                        }
                        // ---- END NAVIGATION LOGIC ----
                    } // THIS IS THE CLOSING BRACE FOR THE TRY BLOCK (started line ~157)
                    catch (error) { // Catch for the try block that started at line ~157
                        console.error('Error during login success handling (payload processing/navigation):', error);
                        notification.showNotification('An error occurred while processing login.', 'error');
                        dispatch(setCurrentUser(null));
                        localStorage.removeItem(TOKEN_STORAGE_KEY);
                        localStorage.removeItem(USER_STORAGE_KEY);
                        router.push('/'); // Fallback to home or login page
                    }
                } else { // This 'else' corresponds to 'if (responsePayload && responsePayload.token && responsePayload.user)'
                    console.error('Login successful, but token or user details are missing in the response payload.');
                    notification.showNotification('Login error: Essential authentication data not received.', 'error');
                    dispatch(setCurrentUser(null)); // Clear any partial user state
                    // Optionally, clear localStorage items if partially set
                    localStorage.removeItem(TOKEN_STORAGE_KEY);
                    localStorage.removeItem(USER_STORAGE_KEY);
                }
                dispatch(setIsLoading(false));
                return true; // Still true because loginUser thunk was fulfilled
            } else {
                // Handle login failure (rejected thunk)
                let errorMessage = 'Login failed. Please try again.';
                if (resultAction.payload) { // Error message from rejectWithValue
                    errorMessage = resultAction.payload;
                } else if (resultAction.error && resultAction.error.message) {
                    errorMessage = resultAction.error.message;
                }
                console.error('Login error in AuthContext:', errorMessage);
                notification.showNotification(errorMessage, 'error');
                dispatch(setCurrentUser(null));
                dispatch(setIsLoading(false));
                throw new Error(errorMessage);
            }
        } catch (error) {
            // This catch block handles errors from dispatching or other synchronous errors before/after dispatch
            console.error('Login error in handleLogin catch block:', error.message);
            dispatch(setCurrentUser(null));
            dispatch(setIsLoading(false));
            // Show notification for errors not caught by the thunk's rejection
            if (!loginUser.rejected.match(error)) { // Avoid double notification if thunk already handled it
                 notification.showNotification(error.message || 'An unexpected login error occurred.', 'error');
            }
            throw error; // Re-throw to allow LoginForm to handle it if needed
        // The 'Enhanced error handling' part below is unreachable and can be removed.
        } 
    }, [dispatch, router, notification, setIsLoading, setCurrentUser, loginUser]);

    const handleRegister = useCallback(async (userData) => {
        dispatch(setIsLoading(true));
        try {
            const response = await dispatch(registerUser(userData));
            const { token, user } = response.payload;

            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

            dispatch(setCurrentUser(response.payload)); // response.payload should be { token, user }
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
            dispatch(setIsLoading(false));
        } // Closing the 'finally' block
    }, [dispatch, notification, router, setIsLoading, setCurrentUser, registerUser]); // Closing useCallback with dependencies

    // handleLogout is now defined before checkAuth, so this definition will be replaced by the first chunk.


    const updateUserData = useCallback((data) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            dispatch(setCurrentUser(updatedUser));
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
    }, [dispatch, user, setCurrentUser]);

    const contextValue = {
        user,
        isAuthenticated,
        isLoading,
        authError,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        checkAuthStatus: checkAuth, // Renamed for clarity in context
        updateCurrentUserData: updateUserData
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}; 