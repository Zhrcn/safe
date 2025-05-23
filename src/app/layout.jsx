import '../../styles/globals.css';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/lib/redux/provider';
import { Box, Typography, Container } from '@mui/material';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-100 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100`}>
        <ReduxProvider>
          <ThemeProviderWrapper>
            {/* Header */}
            <Box component="header" className="bg-blue-600 text-white p-4 shadow-md">
              <Container maxWidth="lg">
                <Typography variant="h6" component="div" className="font-bold">
                  Safe E-Health Platform
                </Typography>
              </Container>
            </Box>
            {/* Main Content Area */}
            <Box component="main" className="flex-grow">
              {children}
            </Box>
            {/* Footer */}
            <Box component="footer" className="bg-gray-800 text-white p-4  h-16 shadow-inner">
              <Container maxWidth="lg" className="text-center">
                <Typography variant="body2" component="p">
                  &copy; {new Date().getFullYear()} Safe E-Health Platform. All rights reserved.
                </Typography>
              </Container>
            </Box>
          </ThemeProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
} 