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
import GlobalMessageListener from '@/components/messaging/GlobalMessageListener';
import '@/utils/consoleFilter';

const inter = Inter({ subsets: ['latin'] });

function SessionWrapper({ children }) {
  useSession();
  return children;
}

function RootLayout({ children }) {
  const { i18n, ready } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    setMounted(true);
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, dir]);

  if (!ready) return null;

  return (
    <html lang={i18n.language} dir={dir} suppressHydrationWarning>
      <head>
        <title>SAFE Health - Secure Medical Platform</title>
        <meta name="description" content="A comprehensive and secure medical platform connecting patients, doctors, and pharmacists for better healthcare management" />
        <link rel="icon" href="/logo(1).png" />
        <link rel="shortcut icon" href="/logo(1).png" />
        <link rel="apple-touch-icon" href="/logo(1).png" />
        {process.env.NODE_ENV === 'development' && (
          <script src="/suppress-warnings.js" defer></script>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ErrorBoundary>
            <SessionWrapper>
              <GlobalMessageListener />
              {mounted ? children : null}
            </SessionWrapper>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

export default appWithTranslation(RootLayout); 