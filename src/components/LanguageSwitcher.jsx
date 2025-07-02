import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

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

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    localStorage.setItem('lang', lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all duration-200 min-w-[120px] justify-between text-primary-foreground border-0 shadow-none"
          aria-label={t('language')}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="font-medium text-sm hidden sm:inline">
              {currentLanguage.nativeName}
            </span>
            <span className="font-medium text-sm sm:hidden">
              {currentLanguage.code.toUpperCase()}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-primary transition-transform duration-200" 
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 p-2 bg-primary/95 backdrop-blur-sm border-0 shadow-xl"
        sideOffset={8}
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 ${
              i18n.language === language.code
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-primary/20 text-primary-foreground/90 hover:text-primary-foreground'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col flex-1">
              <span className="font-medium text-sm">
                {language.nativeName}
              </span>
              <span className="text-xs opacity-70">
                {language.name}
              </span>
            </div>
            {i18n.language === language.code && (
              <Check className="w-4 h-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 