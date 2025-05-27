import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/lib/redux/provider';
import { AuthProvider } from '@/lib/auth/AuthContext';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';
import { NotificationProvider } from '@/components/ui/Notification';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ReduxProvider>
            <NotificationProvider>
              <AuthProvider>
                <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
              </AuthProvider>
            </NotificationProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 