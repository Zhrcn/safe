'use client';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from 'react-i18next';
import '../i18n';

const inter = Inter({ subsets: ['latin'] });

function SessionWrapper({ children }) {
  useSession();
  return children;
}

function RootLayout({ children }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    setMounted(true);
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, dir]);

  return (
    <html lang={i18n.language} dir={dir} suppressHydrationWarning>
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

export default appWithTranslation(RootLayout); 