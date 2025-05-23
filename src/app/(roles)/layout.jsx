'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks'; // Adjust import path if necessary

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Render children only if authenticated, or render null/loading state while checking
  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div>
      {/* You can add shared layout elements here, like a header or sidebar */}
      {children}
    </div>
  );
} 