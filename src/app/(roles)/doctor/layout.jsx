'use client';

import { Box, Typography, Container, IconButton, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Placeholder for menu icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Placeholder for avatar
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'; // Updated import path
import { toggleThemeMode } from '@/lib/redux/slices/themeSlice'; // Updated import path

// Basic Header Component
function DoctorHeader() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.themeMode);

  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
  };

  return (
    <Box className="bg-gray-900 dark:bg-gray-800 text-white p-4 flex items-center justify-between shadow-md dark:shadow-lg">
      <Box className="flex items-center">
        <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" className="font-bold">
          S.A.F.E
        </Typography>
        {/* Add dark/light mode toggle and avatar later */}
      </Box>
       {/* Right side: Logo, S.A.F.E, Dark/Light Toggle, Avatar */}
       <Box className="flex items-center space-x-4">
           {/* Placeholder for Logo (adjust color for theme) */}
           <Box className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full"></Box>
           <Typography variant="h6" component="div" className="font-bold">
               S.A.F.E
           </Typography>
           {/* Dark/Light Toggle */}
            <FormControlLabel
              control={<Switch checked={themeMode === 'dark'} onChange={handleThemeToggle} color="default" />}
              label={themeMode === 'dark' ? 'Dark' : 'Light'}
              sx={{
                   color: themeMode === 'dark' ? 'white' : '#212121' // Theme-aware label color
              }}
            />

            {/* Avatar Placeholder (adjust color for theme) */}
            <IconButton color="inherit">
                <AccountCircle />
            </IconButton>
       </Box>
    </Box>
  );
}

// Basic Sidebar Component
function DoctorSidebar() {
    const sidebarItems = [
        { name: 'Dashboard', icon: DashboardIcon, link: '/doctor/dashboard' },
        { name: 'Patients', icon: PeopleIcon, link: '/doctor/patients' },
        { name: 'Appointments', icon: CalendarTodayIcon, link: '/doctor/appointments' },
        { name: 'Messaging', icon: MessageIcon, link: '/doctor/messaging' },
        { name: 'Analytics', icon: AnalyticsIcon, link: '/doctor/analytics' },
        { name: 'Profile', icon: PersonIcon, link: '/doctor/profile' },
    ];

    return (
        <Box className="w-64 bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100 h-screen flex flex-col p-4 space-y-2 shadow-xl">
            {/* Logo/Title in Sidebar if needed, based on image. The image shows it in header. */}
            {sidebarItems.map((item) => (
                <Link href={item.link} key={item.name} passHref legacyBehavior>
                    <Box
                        component="a"
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <item.icon fontSize="small" />
                        <Typography variant="body1">{item.name}</Typography>
                    </Box>
                </Link>
            ))}
        </Box>
    );
}

export default function DoctorLayout({ children }) {
  return (
    <Box className="flex h-screen bg-gray-700 dark:bg-[#0f172a]">
      <DoctorSidebar />
      <Box className="flex flex-col flex-1 overflow-hidden">
        <DoctorHeader />
        <Box component="main" className="flex-1 overflow-y-auto p-6">
          {children}
        </Box>
      </Box>
    </Box>
  );
} 