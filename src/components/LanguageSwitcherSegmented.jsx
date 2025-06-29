import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl'
  }
];

export default function LanguageSwitcherSegmented() {
  const { i18n, t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    if (isAnimating || lng === i18n.language) return;
    
    setIsAnimating(true);
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    localStorage.setItem('lang', lng);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="relative inline-flex items-center rounded-xl bg-primary/20 p-1 backdrop-blur-sm">
      <div 
        className={`
          absolute top-1 bottom-1 rounded-lg bg-primary shadow-sm
          transition-all duration-300 ease-out z-0
          ${i18n.language === 'en' ? 'left-1 w-[calc(50%-4px)]' : 'right-1 w-[calc(50%-4px)]'}
        `}
      />
      
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          disabled={isAnimating}
          className={`
            relative z-10 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 ease-out min-w-[80px] justify-center
            ${i18n.language === language.code
              ? 'text-primary-foreground'
              : 'text-primary/80 hover:text-primary-foreground'
            }
            ${isAnimating ? 'pointer-events-none' : 'cursor-pointer'}
            ${language.code === 'ar' ? 'font-arabic' : 'font-english'}
          `}
          aria-label={`${t('language')} - ${language.nativeName}`}
          aria-pressed={i18n.language === language.code}
        >
          <span className="text-base drop-shadow-sm">{language.flag}</span>
          <span className="hidden sm:inline">{language.nativeName}</span>
          <span className="sm:hidden">{language.code.toUpperCase()}</span>
          
          {i18n.language === language.code && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full animate-pulse shadow-sm" />
          )}
        </button>
      ))}
      
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
        <Globe className="w-3 h-3 text-primary-foreground" />
      </div>
    </div>
  );
} 