import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SAFE Medical App',
  description: 'Secure Access For Everyone - Medical Application',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
} 