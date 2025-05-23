'use client';

import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'; // Updated import path to use @/lib alias

export default function ThemeProviderWrapper({ children }) {
  const themeMode = useAppSelector((state) => state.theme.themeMode);

  useEffect(() => {
    // Apply dark class to html element for Tailwind
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const theme = createTheme({
    palette: {
      mode: themeMode, // Set MUI palette mode based on Redux state
      // Define custom colors for both light and dark modes if needed
      primary: {
        main: themeMode === 'dark' ? '#90caf9' : '#1976d2', // Example primary color
      },
      secondary: {
        main: themeMode === 'dark' ? '#f48fb1' : '#9c27b0', // Example secondary color
      },
       background: {
         default: themeMode === 'dark' ? '#121212' : '#f4f4f4', // Example background
         paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff', // Example paper background
       },
       text: {
         primary: themeMode === 'dark' ? '#ffffff' : '#212121', // Example text color
         secondary: themeMode === 'dark' ? '#a0a0a0' : '#757575', // Example secondary text color
       },
    },
     components: {
       // Customize MUI components based on theme
        MuiCard: {
           styleOverrides: {
             root: {
               // Apply dark background to cards in dark mode
                backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                color: themeMode === 'dark' ? '#ffffff' : '#212121', // Adjust text color
             },
           },
        },
        MuiPaper: {
            styleOverrides: {
              root: {
                // Apply dark background to Paper in dark mode
                 backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                 color: themeMode === 'dark' ? '#ffffff' : '#212121', // Adjust text color
              },
            },
         },
         MuiTypography: {
            styleOverrides: {
              root: {
                 color: themeMode === 'dark' ? '#ffffff' : '#212121', // Adjust text color for Typography
              }
            }
         }
     }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Optional: resets CSS to provide a consistent baseline */}
      {children}
    </ThemeProvider>
  );
} 