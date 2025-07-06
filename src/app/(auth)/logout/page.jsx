'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser, selectIsAuthenticated } from '@/store/slices/auth/authSlice';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { t } = useTranslation();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logoutUser());
    } else {
      router.push('/');
    }
  }, [isAuthenticated, dispatch, router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <h2 className="mt-4 text-lg font-medium text-foreground">
          {t('logout.loggingOut', 'Logging out...')}
        </h2>
      </div>
    </div>
  );
} 