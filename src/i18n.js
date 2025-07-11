import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

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
      // Log missing translation keys to the console
      console.warn(`[i18n] Missing translation for key: '${key}' in namespace: '${ns}' and language: '${lng}'`);
    },
  });

export default i18n; 