'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/redux/userSlice'; // Updated import path
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
// Import Lucid Icons
import { Lock } from 'lucide-react';
import Avatar from '@mui/material/Avatar';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const role = searchParams.get('role');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if role is not specified (optional, could default)
  useEffect(() => {
    if (!role) {
      router.push('/'); // Redirect to home if no role is selected
    }
  }, [role, router]);

  const handleLogin = (event) => {
    event.preventDefault();
    // Here you would typically send a request to your backend for authentication
    // For this example, we'll simulate a successful login and dispatch the action

    // In a real app, validate credentials and get JWT/user data from backend
    const mockUser = { username, role }; // Replace with actual user data from API
    const mockToken = 'fake-jwt-token'; // Replace with actual JWT from API

    // Dispatch action to update Redux state
    dispatch(setUser({ user: mockUser, role }));

    // Store token (e.g., in localStorage or cookies) - handle securely in production
    localStorage.setItem('jwtToken', mockToken);

    // Redirect to role-specific dashboard
    router.push(`/${role}/dashboard`); // Corrected redirect path: removed '(roles)'
  };

  if (!role) {
    return null; // Or a loading spinner, while redirecting
  }

  // Capitalize the first letter of the role for display
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Container component="main" maxWidth="xs" className="flex items-center justify-center min-h-screen">
      <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="w-full">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          {/* Using Lock icon from Lucid */}
          <Lock size={24} />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Login as {displayRole}
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }} className="w-full">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 