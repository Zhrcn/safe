'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectIsAuthenticated } from '@/store/slices/auth/authSlice';
import { Loader2 } from 'lucide-react';
export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logout());
    } else {
      router.push('/');
    }
  }, [isAuthenticated, dispatch, router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <h2 className="mt-4 text-lg font-medium text-foreground">
          Logging out...
        </h2>
      </div>
    </div>
  );
} 