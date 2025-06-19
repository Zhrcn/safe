'use client';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Client component for session management
function SessionWrapper({ children }) {
  useSession();
  return children;
}

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {mounted && (
          <Providers>
            <ErrorBoundary>
              <SessionWrapper>
                {children}
              </SessionWrapper>
            </ErrorBoundary>
          </Providers>
        )}
      </body>
    </html>
  );
} 