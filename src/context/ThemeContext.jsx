'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '@/styles/themes';
import { useTranslation } from 'react-i18next';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('hopeCare');
  const { t } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = `theme-${currentTheme}`;
    const isDarkTheme = currentTheme === 'safeNight';
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const { t } = useTranslation();
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(t('themeContext.useThemeError', 'useTheme must be used within a ThemeProvider'));
  }
  return context;
}