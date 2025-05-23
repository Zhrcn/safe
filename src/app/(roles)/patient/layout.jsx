'use client';

import { Box, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Placeholder for menu icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Placeholder for avatar
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { toggleThemeMode } from '@/lib/redux/slices/themeSlice';
import { usePathname } from 'next/navigation';

// Basic Header Component (can be shared or role-specific)
function PatientHeader() {
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
                    S.A.F.E Patient Portal
                </Typography>
            </Box>
            <Box className="flex items-center space-x-4">
                <Box className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-full"></Box>
                <Typography variant="h6" component="div" className="font-bold">
                    S.A.F.E
                </Typography>
                <FormControlLabel
                    control={<Switch checked={themeMode === 'dark'} onChange={handleThemeToggle} color="default" size="small" />}
                    label={themeMode === 'dark' ? 'Dark' : 'Light'}
                    sx={{
                         color: themeMode === 'dark' ? 'white' : '#212121',
                         '.MuiSwitch-thumb': {
                              backgroundColor: themeMode === 'dark' ? '#ffffff' : '#000000',
                         },
                          '.MuiSwitch-track': {
                              backgroundColor: themeMode === 'dark' ? '#424242' : '#bdbdbd',
                              opacity: 1,
                         },
                         '& .Mui-checked': {
                              '.MuiSwitch-thumb': {
                                   backgroundColor: themeMode === 'dark' ? '#ffffff' : '#000000',
                              },
                               '.MuiSwitch-track': {
                                   backgroundColor: themeMode === 'dark' ? '#424242' : '#bdbdbd',
                               },
                          }
                    }}
                />
                <IconButton color="inherit">
                    <AccountCircle />
                </IconButton>
            </Box>
        </Box>
    );
}

// Basic Sidebar Component
function PatientSidebar() {
    const pathname = usePathname();

    const sidebarItems = [
        { name: 'Dashboard', icon: DashboardIcon, link: '/patient/dashboard' },
        { name: 'Profile', icon: PersonIcon, link: '/patient/profile' },
        { name: 'Messaging', icon: MessageIcon, link: '/patient/messaging' },
        { name: 'Providers', icon: SearchIcon, link: '/patient/providers' },
        { name: 'Medications', icon: MedicalServicesIcon, link: '/patient/medications' },
        { name: 'Medical File', icon: FolderSharedIcon, link: '/patient/medical-file' },
        { name: 'Prescriptions', icon: LocalPharmacyIcon, link: '/patient/prescriptions' },
    ];

    return (
        <Box className="w-64 bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100 h-screen flex flex-col p-4 space-y-2 shadow-xl">
            {sidebarItems.map((item) => (
                <Link href={item.link} key={item.name} passHref legacyBehavior>
                    <Box
                        component="a"
                        className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-200
                            ${pathname === `/` + item.link ? 'bg-blue-600 dark:bg-blue-700' : 'hover:bg-gray-700 dark:hover:bg-gray-700'}
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

export default function PatientLayout({ children }) {
    return (
        <Box className="flex h-screen bg-gray-700 dark:bg-[#0f172a]">
            <PatientSidebar />
            <Box className="flex flex-col flex-1 overflow-hidden">
                <PatientHeader />
                <Box component="main" className="flex-1 overflow-y-auto p-6">
                    {children}
                </Box>
            </Box>
        </Box>
    );
} 