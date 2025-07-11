'use client';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from 'react-i18next';
import '../i18n';
import GlobalMessageListener from '@/components/messaging/GlobalMessageListener';
import '@/utils/consoleFilter';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

function SessionWrapper({ children }) {
  useSession();
  return children;
}

export default function RootLayout({ children }) {
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
      <body suppressHydrationWarning>
        {!ready ? (
          <div>Loading...</div>
        ) : (
          <Providers>
            <ErrorBoundary>
              <SessionWrapper>
                <ThemeProvider>
                  <GlobalMessageListener />
                  {mounted ? children : null}
                </ThemeProvider>
              </SessionWrapper>
            </ErrorBoundary>
          </Providers>
        )}
      </body>
    </html>
  );
}