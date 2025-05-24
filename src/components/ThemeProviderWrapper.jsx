'use client';

import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'; // Updated import path to use @/lib alias

export default function ThemeProviderWrapper({ children }) {
  const themeMode = useAppSelector((state) => state.theme.themeMode);

  useEffect(() => {
    // Sync Tailwind's dark mode with Redux theme
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: themeMode === 'dark' ? '#f48fb1' : '#9c27b0',
      },
      background: {
        default: themeMode === 'dark' ? '#0f172a' : '#f4f4f4', // match Tailwind dark bg
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#212121',
        secondary: themeMode === 'dark' ? '#a0a0a0' : '#757575',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: themeMode === 'dark' ? '#ffffff' : '#212121',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: themeMode === 'dark' ? '#ffffff' : '#212121',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: themeMode === 'dark' ? '#ffffff' : '#212121',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Optional: resets CSS to provide a consistent baseline */}
      {children}
    </ThemeProvider>
  );
} 