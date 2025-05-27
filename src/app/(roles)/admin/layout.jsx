'use client';

import { Box, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Placeholder for menu icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Placeholder for avatar
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GenericRoleLayout from '@/components/GenericRoleLayout';
import { useTheme } from '@/components/ThemeProviderWrapper';

// Basic Header Component (can be shared or role-specific)
function AdminHeader() {
    const { mode, toggleTheme } = useTheme();

    return (
        <Box className="bg-gray-900 dark:bg-gray-800 text-white p-4 flex items-center justify-between shadow-md dark:shadow-lg"> {/* Theme-aware background and shadow */}
            <Box className="flex items-center">
                {/* Menu icon can be used for future sidebar collapse */}
                <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" className="font-bold">
                    S.A.F.E Admin Portal
                </Typography>
            </Box>
            <Box className="flex items-center space-x-4">
                {/* Placeholder for Logo (adjust color for theme) */}
                <Box className="w-8 h-8 bg-red-500 dark:bg-red-600 rounded-full"></Box>
                <Typography variant="h6" component="div" className="font-bold">
                    S.A.F.E
                </Typography>
                {/* Dark/Light Toggle */}
                <FormControlLabel
                    control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="default" size="small" />}
                    label={<Typography className="text-white dark:text-gray-200">{mode === 'dark' ? 'Dark' : 'Light'}</Typography>}
                    sx={{
                        '.MuiSwitch-thumb': {
                            backgroundColor: mode === 'dark' ? '#ffffff' : '#000000',
                        },
                        '.MuiSwitch-track': {
                            backgroundColor: mode === 'dark' ? '#424242' : '#bdbdbd',
                            opacity: 1,
                        },
                        '& .Mui-checked': {
                            '.MuiSwitch-thumb': {
                                backgroundColor: mode === 'dark' ? '#ffffff' : '#000000',
                            },
                            '.MuiSwitch-track': {
                                backgroundColor: mode === 'dark' ? '#424242' : '#f1f1f1',
                            },
                        }
                    }}
                />
                {/* Avatar Placeholder (adjust color for theme) */}
                <IconButton color="inherit" className="text-white dark:text-gray-200">
                    <AccountCircle />
                </IconButton>
            </Box>
        </Box>
    );
}

// Basic Sidebar Component
function AdminSidebar() {
    const pathname = usePathname(); // Get current path to highlight active item

    const sidebarItems = [
        { name: 'Dashboard', icon: DashboardIcon, link: '/admin/dashboard' },
        { name: 'Users', icon: PeopleIcon, link: '/admin/users' },
        { name: 'Settings', icon: SettingsIcon, link: '/admin/settings' },
    ];

    return (
        <Box className="w-64 bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100 h-screen flex flex-col p-4 space-y-2 shadow-xl"> {/* Theme-aware background and text color */}
            {sidebarItems.map((item) => (
                <Link href={item.link} key={item.name} passHref legacyBehavior>
                    <Box
                        component="a"
                        className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-200
                            ${pathname === `/` + item.link ? 'bg-red-600 dark:bg-red-700' : 'hover:bg-gray-700 dark:hover:bg-gray-700'} {/* Highlight active link with Admin color */}
                        `}
                    >
                        <item.icon fontSize="small" />
                        <Typography variant="body1">{item.name}</Typography>
                    </Box>
                </Link>
            ))}
        </Box>
    );
}

const sidebarItems = [
    { name: 'Dashboard', icon: DashboardIcon, link: '/admin/dashboard' },
    { name: 'Users', icon: PeopleIcon, link: '/admin/users' },
    { name: 'Settings', icon: SettingsIcon, link: '/admin/settings' },
];

export default function AdminLayout({ children }) {
    return (
        <GenericRoleLayout
            headerBg="bg-gray-900 dark:bg-gray-800"
            sidebarBg="bg-background"
            logoBg="bg-primary"
            title="S.A.F.E Admin Portal"
            sidebarItems={sidebarItems}
        >
            {children}
        </GenericRoleLayout>
    );
} 