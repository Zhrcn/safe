'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function useSafeTranslation() {
  const [isReady, setIsReady] = useState(false);
  const translation = useTranslation();

  useEffect(() => {
    if (translation.i18n && translation.i18n.isInitialized) {
      setIsReady(true);
    } else if (translation.i18n) {
      const handleInitialized = () => setIsReady(true);
      translation.i18n.on('initialized', handleInitialized);
      return () => translation.i18n.off('initialized', handleInitialized);
    }
  }, [translation.i18n]);

  if (!isReady) {
    return {
      t: (key, options) => key,
      i18n: translation.i18n,
      ready: false
    };
  }

  return {
    ...translation,
    ready: true
  };
} 