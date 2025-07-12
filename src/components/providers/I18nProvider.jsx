'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

export default function I18nProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Wait for i18n to be ready
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      const handleInitialized = () => {
        setIsI18nReady(true);
      };
      
      i18n.on('initialized', handleInitialized);
      
      // Cleanup
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, []);

  // Show children immediately on server-side, but wait for i18n on client-side
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  if (!isClient || !isI18nReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 