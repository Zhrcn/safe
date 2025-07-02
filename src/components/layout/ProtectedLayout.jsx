'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { useVerifyTokenQuery } from '@/store/services/user/authApi';
import { logout } from '@/store/slices/auth/authSlice';
import { getToken, removeToken } from '@/utils/tokenUtils';
import { ROLES } from '@/config/app-config';

export default function ProtectedLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const hasToken = !!getToken();
  const { data: verifyData, isLoading: isVerifying, error: verifyError } = useVerifyTokenQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    const handleAuthorization = async () => {
      if (!hasToken) {
        router.replace('/login');
        return;
      }

      if (isVerifying) {
        return;
      }

      if (verifyError) {
        removeToken();
        dispatch(logout());
        router.replace('/login');
        return;
      }

      if (verifyData?.success && verifyData?.user) {
        let userRole = verifyData.user.role?.toUpperCase();
        if (!userRole) {
          try {
            const token = getToken();
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              userRole = payload.role?.toUpperCase();
            }
          } catch (error) {
          }
        }

        if (!userRole) {
          removeToken();
          dispatch(logout());
          router.replace('/login');
          return;
        }

        const pathRole = pathname.split('/')[1]?.toUpperCase();
        if (pathRole && pathRole !== userRole) {
          router.replace(`/${userRole.toLowerCase()}/dashboard`);
          return;
        }

        setIsAuthorized(true);
      } else {
        removeToken();
        dispatch(logout());
        router.replace('/login');
      }
    };

    handleAuthorization();
  }, [verifyData, isVerifying, verifyError, pathname, hasToken, router, dispatch]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-destructive">
          Unauthorized access. Redirecting to login...
        </p>
      </div>
    );
  }

  return children;
} 