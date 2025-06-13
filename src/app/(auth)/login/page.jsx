'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useLoginMutation } from '@/store/services/user/authApi';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient' // Default role
  });
  const [error, setError] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // Get role from URL if present
  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      setFormData(prev => ({ ...prev, role }));
    }
  }, [searchParams]);

  const navigateToDashboard = useCallback((role) => {
    console.log('Navigating to dashboard for role:', role);
    const path = `/${role.toLowerCase()}/dashboard`;
    console.log('Navigation path:', path);
    router.push(path);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      return;
    }

    setError('');
    setIsNavigating(false);

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Attempting login with:', { email: formData.email, role: formData.role });
      const response = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      }).unwrap();
      
      console.log('Login response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      // Ensure we have a valid role from the response
      const userRole = response.user?.role?.toLowerCase();
      if (!userRole) {
        throw new Error('Invalid user role received');
      }

      console.log('Login successful, navigating to:', userRole);
      navigateToDashboard(userRole);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    }
  };

  const isLoading = isLoginLoading || isNavigating;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login to S.A.F.E
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          noValidate
          name="login-form"
          autoComplete="on"
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            error={!!error && error.includes('email')}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            error={!!error && error.includes('password')}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 