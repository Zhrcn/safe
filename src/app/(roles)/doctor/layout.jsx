'use client';

import { Box, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Placeholder for menu icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Placeholder for avatar
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person'; // Corrected import path
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GenericRoleLayout from '@/components/GenericRoleLayout';
import { useTheme } from '@/components/ThemeProviderWrapper';

// Basic Header Component
function DoctorHeader() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box className="bg-blue-600 dark:bg-gray-800 text-white dark:text-gray-200 p-4 flex items-center justify-between shadow-md dark:shadow-lg"> {/* Theme-aware background, text, and shadow */}
      <Box className="flex items-center">
        {/* Menu icon can be used for future sidebar collapse */}
        <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" className="font-bold text-white dark:text-gray-200"> {/* Ensure Typography text is theme-aware */}
          S.A.F.E
        </Typography>
      </Box>
      {/* Right side: Logo, S.A.F.E, Dark/Light Toggle, Avatar */}
      <Box className="flex items-center space-x-4">
        {/* Placeholder for Logo (adjust color for theme) */}
        <Box className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full"></Box>
        <Typography variant="h6" component="div" className="font-bold text-white dark:text-gray-200"> {/* Ensure Typography text is theme-aware */}
          S.A.F.E
        </Typography>
        {/* Dark/Light Toggle */}
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="default" size="small" />}
          label={<Typography className="text-white dark:text-gray-200">{mode === 'dark' ? 'Dark' : 'Light'}</Typography>} // Make label theme-aware
          sx={{
            // Removed explicit color from sx to rely on Tailwind classes
            '.MuiSwitch-thumb': { // Style the switch thumb
              backgroundColor: mode === 'dark' ? '#ffffff' : '#000000', // White thumb in dark, black in light
            },
            '.MuiSwitch-track': { // Style the switch track
              backgroundColor: mode === 'dark' ? '#424242' : '#bdbdbd', // Darker track in dark, lighter in light
              opacity: 1, // Ensure track is visible
            },
            '& .Mui-checked': { // Style when checked (Dark mode)
              '.MuiSwitch-thumb': {
                backgroundColor: mode === 'dark' ? '#ffffff' : '#000000', // Consistent thumb color
              },
              '.MuiSwitch-track': {
                backgroundColor: mode === 'dark' ? '#424242' : '#f1f1f1', // Consistent track color
              },
            }
          }}
        />

        {/* Avatar Placeholder (adjust color for theme) */}
        <IconButton color="inherit" className="text-white dark:text-gray-200"> {/* Ensure icon button is theme-aware */}
          <AccountCircle />
        </IconButton>
      </Box>
    </Box>
  );
}

// Basic Sidebar Component
function DoctorSidebar() {
  const pathname = usePathname(); // Get current path to highlight active item

  const sidebarItems = [
    { name: 'Dashboard', icon: DashboardIcon, link: '/doctor/dashboard' },
    { name: 'Patients', icon: PeopleIcon, link: '/doctor/patients' },
    { name: 'Appointments', icon: CalendarTodayIcon, link: '/doctor/appointments' },
    { name: 'Messaging', icon: MessageIcon, link: '/doctor/messaging' },
    { name: 'Analytics', icon: AnalyticsIcon, link: '/doctor/analytics' },
    { name: 'Profile', icon: PersonIcon, link: '/doctor/profile' },
  ];

  return (
    <Box className="w-64 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100 h-screen flex flex-col p-4 space-y-2 shadow-xl dark:shadow-none"> {/* Theme-aware background, text color, and shadow */}
      {/* Logo/Title in Sidebar if needed, based on image. The image shows it in header. */}
      {sidebarItems.map((item) => (
        <Link href={item.link} key={item.name} passHref legacyBehavior>
          <Box
            component="a"
            className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-200
                            ${pathname === `/` + item.link ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'} {/* Highlight active link with theme-aware colors */}
                        `}
          >
            <item.icon fontSize="small" className={`${pathname === `/` + item.link ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} /> {/* Theme-aware icon color */}
            <Typography variant="body1" className={`${pathname === `/` + item.link ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}> {/* Theme-aware text color */}
              {item.name}
            </Typography>
          </Box>
        </Link>
      ))}
    </Box>
  );
}

const sidebarItems = [
  { name: 'Dashboard', icon: DashboardIcon, link: '/doctor/dashboard' },
  { name: 'Patients', icon: PeopleIcon, link: '/doctor/patients' },
  { name: 'Appointments', icon: CalendarTodayIcon, link: '/doctor/appointments' },
  { name: 'Messaging', icon: MessageIcon, link: '/doctor/messaging' },
  { name: 'Analytics', icon: AnalyticsIcon, link: '/doctor/analytics' },
  { name: 'Profile', icon: PersonIcon, link: '/doctor/profile' },
];

export default function DoctorLayout({ children }) {
  return (
    <GenericRoleLayout
      headerBg="bg-blue-600 dark:bg-gray-800"
      sidebarBg="bg-background"
      logoBg="bg-primary"
      title="S.A.F.E Doctor Portal"
      sidebarItems={sidebarItems}
    >
      {children}
    </GenericRoleLayout>
  );
}