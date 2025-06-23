'use client';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

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
      <head>
        <title>SAFE Health - Secure Medical Platform</title>
        <meta name="description" content="A comprehensive and secure medical platform connecting patients, doctors, and pharmacists for better healthcare management" />
        <link rel="icon" href="/logo(1).png" />
        <link rel="shortcut icon" href="/logo(1).png" />
        <link rel="apple-touch-icon" href="/logo(1).png" />
      </head>
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