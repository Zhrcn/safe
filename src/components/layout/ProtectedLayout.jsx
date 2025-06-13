'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useVerifyTokenQuery } from '@/store/services/user/authApi';
import { logout } from '@/store/slices/user/authSlice';
import { getToken, removeToken } from '@/utils/tokenUtils';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProtectedLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const hasToken = !!getToken();

  const { data: verifyData, isLoading: isVerifying, error: verifyError } = useVerifyTokenQuery(undefined, {
    skip: !hasToken,
  });

  // Log state for debugging
  useEffect(() => {
    console.log('ProtectedLayout state:', {
      isAuthenticated: !!user,
      user,
      verifyData,
      isVerifying,
      verifyError,
      pathname,
      hasToken
    });
  }, [user, verifyData, isVerifying, verifyError, pathname, hasToken]);

  useEffect(() => {
    const handleAuthorization = async () => {
      if (!hasToken) {
        console.log('No token found, redirecting to login');
        router.replace('/login');
        return;
      }

      if (isVerifying) {
        console.log('Verifying token...');
        return;
      }

      if (verifyError) {
        console.error('Token verification failed:', verifyError);
        removeToken();
        dispatch(logout());
        router.replace('/login');
        return;
      }

      if (verifyData?.success && verifyData?.user) {
        console.log('Token verified successfully');
        
        // Get user role from verification data or token
        let userRole = verifyData.user.role?.toLowerCase();
        if (!userRole) {
          try {
            const token = getToken();
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              userRole = payload.role?.toLowerCase();
            }
          } catch (error) {
            console.error('Error parsing token:', error);
          }
        }

        if (!userRole) {
          console.error('No user role found');
          removeToken();
          dispatch(logout());
          router.replace('/login');
          return;
        }

        const pathRole = pathname.split('/')[1]?.toLowerCase();
        if (pathRole && pathRole !== userRole) {
          console.log(`User role (${userRole}) does not match path role (${pathRole})`);
          router.replace(`/${userRole}/dashboard`);
          return;
        }

        setIsAuthorized(true);
      } else {
        console.log('Token verification unsuccessful');
        removeToken();
        dispatch(logout());
        router.replace('/login');
      }
    };

    handleAuthorization();
  }, [verifyData, isVerifying, verifyError, pathname, hasToken, router, dispatch]);

  if (isVerifying) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6" color="error">
          Unauthorized access. Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return children;
} 