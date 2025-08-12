'use client';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from '@/components/ui/Toaster';

function SessionWrapper({ children }) {
  useSession();
  return children;
}

export default function ClientLayout({ children }) {
  const { i18n, ready } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language, dir]);

  if (typeof window !== 'undefined' && (!ready || !mounted)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <SessionWrapper>
      {children}
      <Toaster />
    </SessionWrapper>
  );
} 