'use client';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { useSession } from '@/hooks/useSession';

const inter = Inter({ subsets: ['latin'] });

// Client component for theme handling
function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

// Client component for session management
function SessionWrapper({ children }) {
  useSession();
  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ErrorBoundary>
            <SessionWrapper>
              <ThemeWrapper>{children}</ThemeWrapper>
            </SessionWrapper>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}