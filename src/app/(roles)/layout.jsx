'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      console.log('ProtectedLayout: Auth loading complete, user not found. Redirecting to /login.');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    console.log('ProtectedLayout: Authentication in progress...');
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    console.log('ProtectedLayout: Auth loading complete, user not found. Rendering redirect screen.');
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
        <Box ml={2}>Redirecting to login...</Box>
      </Box>
    );
  }

  console.log(`ProtectedLayout: Authenticated as ${user.role} (${user.email}). Rendering protected content.`);
  return <>{children}</>;
}