'use client';
import { Provider } from 'react-redux';
import { store } from './index';
import { NotificationProvider } from '@/components/ui/Notification';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </Provider>
  );
}