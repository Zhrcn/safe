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
    // Check if we have auth data in localStorage (for faster initial render)
    const token = localStorage.getItem('safe_auth_token');
    const userData = localStorage.getItem('safe_user_data');
    const hasLocalAuth = !!(token && userData);

    // Only redirect if the initial authentication check is complete
    if (!loading) {
      setInitialCheckDone(true);
      
      if (!isAuthenticated && !redirecting) {
        console.log('Not authenticated, redirecting to login');
        setRedirecting(true);
        
        // Small delay to prevent redirect loops
        const redirectTimeout = setTimeout(() => {
          router.push('/login');
        }, 100);
        
        return () => clearTimeout(redirectTimeout);
      } else if (isAuthenticated) {
        console.log('Authenticated as', user?.role);
        setRedirecting(false);
      }
    }
  }, [isAuthenticated, loading, router, user, redirecting]);

  // Show loading state while checking authentication
  if (loading || !initialCheckDone || redirecting) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return (
    <div>
      {children}
    </div>
  );
} 