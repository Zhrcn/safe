import '../../styles/globals.css';
import { Inter } from 'next/font/google';
// Ensure the path is correct and the component is correctly exported as a named export
import { ReduxProvider } from '../../lib/redux/provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ReduxProvider is a Client Component and should wrap the children */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}