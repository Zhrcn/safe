import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/lib/redux/provider';
import { Box, Typography, Container } from '@mui/material';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300`}>
        <ReduxProvider>
          <ThemeProviderWrapper>
            {/* Header */}
            <Box component="header" className="bg-primary text-primary-foreground p-4 shadow-md transition-colors duration-300">
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
            <Box component="footer" className="bg-muted text-muted-foreground p-4 h-16 shadow-inner transition-colors duration-300">
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