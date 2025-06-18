'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { lightColors, darkColors, themes } from '@/styles/themes';

// This is the canonical ThemeContext for the app. Do not use ThemeProviderWrapper or any other theme context.
const ThemeContext = createContext(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convert hex to HSL
function hexToHSL(hex) {
  // Remove the hash if it exists
  hex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

const applyTheme = (theme, isDark) => {
  // First apply the base light/dark theme
  const baseTheme = isDark ? darkColors : lightColors;
  for (const [key, value] of Object.entries(baseTheme)) {
    document.documentElement.style.setProperty(key, value);
  }

  // Then apply the custom theme colors
  if (theme) {
    const themeColors = themes[theme];
    if (themeColors) {
      // Convert hex colors to HSL and apply them
      for (const [key, value] of Object.entries(themeColors)) {
        const hslValue = hexToHSL(value);
        let cssVar = `--${key}`;

        // If the key is 'base-100', map it to --background
        if (key === 'base-100') {
          cssVar = '--background';
        }

        document.documentElement.style.setProperty(cssVar, hslValue);
      }
    }
  }
};

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('light');
  const [currentTheme, setCurrentTheme] = useState('hopeCare');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const savedMode = localStorage.getItem('mode');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  useEffect(() => {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    applyTheme(currentTheme, isDark);
  }, [mode, currentTheme]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('theme', themeName);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}