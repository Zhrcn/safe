import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/lib/redux/provider';
import { AuthProvider } from '@/lib/auth/AuthContext';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ErrorBoundary>
                    <ReduxProvider>
                        <AuthProvider>
                            <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
                        </AuthProvider>
                    </ReduxProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
} 