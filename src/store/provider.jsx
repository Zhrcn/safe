'use client';
import { Provider } from 'react-redux';
import { store } from './index';
import { NotificationProvider } from '@/components/ui/Notification';
import AuthProvider from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Provider store={store}>
      <NotificationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NotificationProvider>
    </Provider>
  );
}