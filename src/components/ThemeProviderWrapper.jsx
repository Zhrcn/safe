'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { THEME } from '@/lib/config';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ThemeContext = createContext(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setMode(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  useEffect(() => {
    // Sync Tailwind's dark mode with theme state
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: THEME[mode].primary,
      secondary: THEME[mode].secondary,
      error: THEME[mode].error,
      warning: THEME[mode].warning,
      success: THEME[mode].success,
      background: THEME[mode].background,
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#E5E7EB' : '#1F2937',
            '&.Mui-selected': {
              backgroundColor: THEME[mode].primary.main,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: THEME[mode].primary.dark,
              }
            },
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
            color: mode === 'dark' ? '#E5E7EB' : '#1F2937',
          },
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          header: {
            '& .MuiDayCalendar-weekDayLabel': {
              color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
} 