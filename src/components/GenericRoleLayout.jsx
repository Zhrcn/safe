'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Sun, Moon } from 'lucide-react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProviderWrapper';

/**
 * GenericRoleLayout
 * @param {Object} props
 * @param {string} props.headerBg - Tailwind classes for header background
 * @param {string} props.sidebarBg - Tailwind classes for sidebar background
 * @param {string} props.logoBg - Tailwind classes for logo background
 * @param {string} props.title - Title for the header
 * @param {Array} props.sidebarItems - Array of { name, icon, link }
 * @param {React.ReactNode} props.children - Main content
 */
export default function GenericRoleLayout({
    headerBg = 'bg-primary',
    sidebarBg = 'bg-card',
    logoBg = 'bg-muted',
    title = 'S.A.F.E Portal',
    sidebarItems = [],
    children
}) {
    const pathname = usePathname();
    const { mode, toggleTheme } = useTheme();

    return (
        <Box className="flex h-screen">
            {/* Sidebar */}
            <Box className={`w-64 ${sidebarBg} text-card-foreground shadow-lg transition-colors duration-300`}>
                {/* Logo Area */}
                <Box className={`h-16 ${logoBg} flex items-center justify-center transition-colors duration-300`}>
                    <Typography variant="h6" className="font-bold">
                        {title}
                    </Typography>
                </Box>
                {/* Navigation Links */}
                <Box className="p-4">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.link;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={index}
                                href={item.link}
                                className={`flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted/40'
                                    }`}
                            >
                                {Icon && <Icon className="mr-3 h-5 w-5" />}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </Box>
            </Box>

            {/* Main Content */}
            <Box className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Box className={`h-16 ${headerBg} text-primary-foreground flex items-center justify-between px-6 shadow-md transition-colors duration-300`}>
                    <IconButton color="inherit" edge="start" className="lg:hidden">
                        <MenuIcon />
                    </IconButton>
                    <Box className="flex items-center space-x-4">
                        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                            <IconButton onClick={toggleTheme} color="inherit">
                                {mode === 'dark' ? <Sun /> : <Moon />}
                            </IconButton>
                        </Tooltip>
                        <IconButton color="inherit">
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content Area */}
                <Box className="flex-1 overflow-auto bg-background p-6 transition-colors duration-300">
                    {children}
                </Box>
            </Box>
        </Box>
    );
} 