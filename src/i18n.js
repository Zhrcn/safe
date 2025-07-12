import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Only initialize i18n on the client side
if (typeof window !== 'undefined') {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'ar',
      debug: process.env.NODE_ENV === 'development',
      supportedLngs: ['ar', 'en'],
      ns: ['common'],
      defaultNS: 'common',
      returnObjects: true,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: {
        useSuspense: false,
      },
      missingKeyHandler: function(lng, ns, key, fallbackValue) {
        // Only log missing translation keys in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[i18n] Missing translation for key: '${key}' in namespace: '${ns}' and language: '${lng}'`);
        }
      },
    });
} else {
  // Server-side fallback
  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: 'ar',
      supportedLngs: ['ar', 'en'],
      ns: ['common'],
      defaultNS: 'common',
      returnObjects: true,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n; 