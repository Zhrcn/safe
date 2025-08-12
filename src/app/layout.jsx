import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import GlobalMessageListener from '@/components/messaging/GlobalMessageListener';
import PrescriptionSocketListener from '@/components/prescriptions/PrescriptionSocketListener';
import '@/utils/consoleFilter';
import { ThemeProvider } from '@/components/ThemeProviderWrapper';
import ClientLayout from '@/components/layout/ClientLayout';
import I18nProvider from '@/components/providers/I18nProvider';



const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SAFE - Healthcare Platform</title>
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ErrorBoundary>
            <ThemeProvider>
              <I18nProvider>
                <ClientLayout>
                  <GlobalMessageListener />
                  <PrescriptionSocketListener />
                  {children}
                </ClientLayout>
              </I18nProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}