'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  // Render children only if authenticated, or render null while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {/* You can add shared layout elements here, like a header or sidebar */}
      {children}
    </div>
  );
} 