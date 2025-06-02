'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Create timeout reference that can be cleared in cleanup
    let redirectTimeout;
    let authCheckTimeout;

    const initAuth = () => {
      // Only proceed if initial authentication check is complete
      if (!loading) {
        // Set initial check done regardless of auth state
        setInitialCheckDone(true);

        if (!isAuthenticated && !redirecting) {
          console.log('Not authenticated, preparing to redirect to login');
          setRedirecting(true);

          // Small delay to prevent redirect loops
          redirectTimeout = setTimeout(() => {
            console.log('Redirecting to login page...');
            router.push('/login');
          }, 300);
        } else if (isAuthenticated) {
          console.log(`Authenticated as ${user?.role} (${user?.email})`);
          setRedirecting(false);
        }
      } else if (!initialCheckDone && !authCheckTimeout) {
        // Set a timeout to avoid hanging if auth check takes too long
        authCheckTimeout = setTimeout(() => {
          console.log('Auth check taking too long, forcing initial check done');
          setInitialCheckDone(true);
          setRedirecting(true);
          router.push('/login');
        }, 5000);
      }
    };

    // Call the initialization function
    initAuth();

    // Single cleanup function that handles all cases
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
      if (authCheckTimeout) {
        clearTimeout(authCheckTimeout);
      }
    };
  }, [isAuthenticated, loading, router, user, redirecting]);

  // Determine what to render based on authentication state
  const renderContent = () => {
    // Show loading state while checking authentication
    if (loading && !initialCheckDone) {
      return (
        <Box className="flex items-center justify-center min-h-screen">
          <CircularProgress />
        </Box>
      );
    }

    // Don't render anything if not authenticated (will redirect)
    if (!isAuthenticated && (redirecting || initialCheckDone)) {
      return (
        <Box className="flex items-center justify-center min-h-screen">
          <CircularProgress />
          <Box ml={2}>Redirecting to login...</Box>
        </Box>
      );
    }

    // Render children if authenticated
    return (
      <div>
        {children}
      </div>
    );
  };

  return renderContent();
}