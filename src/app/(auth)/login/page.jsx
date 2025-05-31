'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import LoginForm from '@/components/auth/LoginForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    if (!role) {
      router.push('/');
    }
  }, [role, router]);

  if (!role) {
    return null;
  }

  return (
    <Container component="main" maxWidth="sm" className="mt-16">
      <Box className="text-center mb-8">
        <Typography component="h1" variant="h4" className="font-bold text-foreground">
          Welcome to S.A.F.E
        </Typography>
        <Typography variant="body1" className="mt-2 text-muted-foreground">
          Please login to continue
        </Typography>
      </Box>
      <LoginForm role={role} redirectUrl={redirectUrl} />
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Container className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Container>
    }>
      <LoginContent />
    </Suspense>
  );
} 