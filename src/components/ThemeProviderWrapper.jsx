'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { themes } from '@/styles/themes';

const defaultTheme = 'hopeCare';

export const ThemeContext = createContext({
  currentTheme: defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const toggleTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme') || defaultTheme;
    setCurrentTheme(saved);
  }, []);

  useEffect(() => {
    let themeVars = themes[currentTheme];
    if (!themeVars) {
      themeVars = themes[defaultTheme];
      setCurrentTheme(defaultTheme);
    }
    console.log('Applying theme:', currentTheme, themeVars);
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 