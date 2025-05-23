import '../../styles/globals.css';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '../../lib/redux/provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
} 