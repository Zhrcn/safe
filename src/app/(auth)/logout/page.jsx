'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LogoutPage() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // If the user is authenticated, log them out
    if (isAuthenticated) {
      logout();
    } else {
      // If the user is already logged out, redirect to home page
      router.push('/');
    }
  }, [isAuthenticated, logout, router]);

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen">
      <CircularProgress size={40} />
      <Typography variant="h6" className="mt-4">
        Logging out...
      </Typography>
    </Box>
  );
} 