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
    root.classList.remove('theme-hopeCare', 'theme-pureCare', 'theme-syriaWarm', 'theme-safeNight', 'dark');
    root.classList.add(`theme-${currentTheme}`);
    if (currentTheme === 'safeNight') {
      root.classList.add('dark');
    }
    const bg = themeVars['--color-background'] || '#fff';
    root.style.backgroundColor = bg;
    if (document.body) document.body.style.backgroundColor = bg;
    const requiredVars = ['--color-background', '--color-foreground', '--color-primary'];
    requiredVars.forEach(key => {
      if (!themeVars[key]) {
        console.warn(`Theme '${currentTheme}' is missing variable: ${key}`);
      }
    });
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 