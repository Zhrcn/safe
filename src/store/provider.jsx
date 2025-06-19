'use client';
import { Provider } from 'react-redux';
import { store } from './index';
import { ThemeProvider } from '@/components/ThemeProviderWrapper';
import { NotificationProvider } from '@/components/ui/Notification';
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
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  );
}