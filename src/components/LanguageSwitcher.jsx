import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    localStorage.setItem('lang', lng);
  };

  return (
    <button
      onClick={() => changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
      className="px-3 py-1 rounded-full border border-primary bg-background text-primary hover:bg-primary hover:text-white transition-colors duration-200"
      aria-label={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
} 