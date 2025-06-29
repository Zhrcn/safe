import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

export default function LanguageSwitcherToggle() {
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

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const nextLanguage = languages.find(lang => lang.code !== i18n.language) || languages[1];

  return (
    <div className="relative">
      <Button
        onClick={() => changeLanguage(nextLanguage.code)}
        variant="ghost"
        disabled={isAnimating}
        className={`
          relative flex items-center gap-2 px-4 py-2.5 rounded-full 
          bg-gradient-to-r from-primary/20 to-primary/30
          hover:from-primary/30 hover:to-primary/40
          transition-all duration-300 ease-out min-w-[140px] justify-center
          text-primary-foreground font-semibold border-0 shadow-none
          ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
          ${i18n.language === 'ar' ? 'font-arabic' : 'font-english'}
        `}
        aria-label={`${t('language')} - ${t('switchTo')} ${nextLanguage.nativeName}`}
      >
        <div 
          className={`
            absolute inset-1 rounded-full bg-primary/40 transition-all duration-300 ease-out
            ${i18n.language === 'ar' ? 'translate-x-full' : 'translate-x-0'}
          `}
        />
        
        <div className="relative flex items-center gap-2 z-10">
          <span className="text-lg drop-shadow-sm">{currentLanguage.flag}</span>
          <span className="font-semibold text-sm text-primary-foreground">
            {currentLanguage.nativeName}
          </span>
        </div>
        
        <Globe 
          className={`
            w-4 h-4 text-primary-foreground/80 transition-all duration-300 ease-out
            ${isAnimating ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
          `} 
        />
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {t('switchTo')} {nextLanguage.nativeName}
          </div>
        </div>
      </Button>
      
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
      )}
    </div>
  );
} 