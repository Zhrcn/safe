'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import { NotificationProvider } from '@/components/ui/Notification';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProviderWrapper>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProviderWrapper>
      </LocalizationProvider>
    </Provider>
  );
}