'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, Tooltip, Drawer, 
  Avatar, Badge, Menu, MenuItem, ListItemIcon, Divider, useMediaQuery, useTheme as useMuiTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, X, Sun, Moon, Bell, LogOut, Settings, User, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { APP_NAME } from '@/app-config';
import { useAuth } from '@/lib/auth/AuthContext';

/**
 * Enhanced GenericRoleLayout component with animations and better mobile experience
 * 
 * @param {Object} props
 * @param {string} props.headerBg - Header background color class
 * @param {string} props.sidebarBg - Sidebar background color class
 * @param {string} props.logoBg - Logo background color class
 * @param {string} props.title - Portal title
 * @param {Array} props.sidebarItems - Sidebar navigation items
 * @param {React.ReactNode} props.children - Page content
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
    const router = useRouter();
    const { mode, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed by default
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
    
    // Mock notifications - in a real app, these would come from a context or Redux
    const [notifications, setNotifications] = useState([
      { id: 1, title: 'New appointment', message: 'You have a new appointment scheduled', read: false },
      { id: 2, title: 'Prescription ready', message: 'Your prescription is ready for pickup', read: false },
      { id: 3, title: 'Lab results', message: 'Your lab results are now available', read: true },
    ]);
    
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    
    const drawerWidth = 240;
    
    useEffect(() => {
        // Set sidebar to open for desktop on initial load
        if (isDesktop) {
            setSidebarOpen(true);
        }
    }, [isDesktop]);

    const toggleSidebar = () => {
        if (isDesktop) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setMobileOpen(!mobileOpen);
        }
    };
    
    const handleProfileMenuOpen = (event) => {
      setProfileMenuAnchor(event.currentTarget);
    };
    
    const handleProfileMenuClose = () => {
      setProfileMenuAnchor(null);
    };
    
    const handleNotificationsMenuOpen = (event) => {
      setNotificationsMenuAnchor(event.currentTarget);
    };
    
    const handleNotificationsMenuClose = () => {
      setNotificationsMenuAnchor(null);
    };
    
    const handleNotificationRead = (id) => {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    };
    
    const handleLogout = () => {
      // Use the auth context to handle logout
      logout();
    };

    // Define SidebarContent component
    const SidebarContent = () => (
        <>
            <Box className={`h-16 ${logoBg} flex items-center justify-between px-4 transition-colors duration-300`}>
                <Box className="flex items-center">
                    <Typography variant="h6" className="font-bold text-lg bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                        {APP_NAME}
                    </Typography>
                    <Typography variant="subtitle2" className="ml-2 opacity-75">
                        {title.replace('S.A.F.E', '').trim()}
                    </Typography>
                </Box>
                {!isDesktop && (
                    <IconButton onClick={() => setMobileOpen(false)} className="text-white">
                        <X size={20} />
                    </IconButton>
                )}
            </Box>
            <Box className="p-4 overflow-y-auto flex-1">
                {sidebarItems.map((item, index) => {
                    const isActive = pathname === item.link;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={index}
                            href={item.link}
                            className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary-dark'
                                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                            }`}
                        >
                            {Icon && (
                                <Box className={`mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                                </Box>
                            )}
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <ChevronRight className="ml-auto h-5 w-5 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </Box>
            <Box className="p-4 mt-auto">
                <Divider className="mb-4" />
                <Box 
                    className="flex items-center p-2 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors duration-200"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Logout</span>
                </Box>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Enhanced fixed width sidebar */}
            <Box 
                sx={{
                    width: drawerWidth,
                    height: '100%',
                    position: 'fixed',
                    left: isDesktop ? (sidebarOpen ? 0 : -drawerWidth) : -drawerWidth,
                    top: 0,
                    zIndex: 1200,
                    bgcolor: 'background.paper',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 3,
                    display: isDesktop ? 'block' : 'none',
                    '&:hover': {
                        boxShadow: 6,
                    },
                }}
                className={`${sidebarBg} backdrop-blur-sm bg-opacity-95`}
            >
                <SidebarContent />
            </Box>
            
            {/* Enhanced mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                }}
            >
                <SidebarContent />
            </Drawer>
            
            {/* Enhanced main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    marginLeft: isDesktop && sidebarOpen ? `${drawerWidth}px` : 0,
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'background.default',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            >
                {/* Enhanced header */}
                <Box
                    className={`${headerBg} sticky top-0 z-50 backdrop-blur-sm bg-opacity-95`}
                    sx={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box className="flex items-center">
                        <IconButton
                            color="inherit"
                            aria-label="toggle sidebar"
                            onClick={toggleSidebar}
                            edge="start"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className="font-semibold">
                            {sidebarItems.find(item => item.link === pathname)?.name || 'Dashboard'}
                        </Typography>
                    </Box>
                    
                    <Box className="flex items-center space-x-2">
                        <IconButton
                            color="inherit"
                            onClick={toggleTheme}
                            className="hover:bg-white/10"
                        >
                            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </IconButton>
                        
                        <Tooltip title="Notifications">
                            <IconButton
                                color="inherit"
                                onClick={handleNotificationsMenuOpen}
                                className="hover:bg-white/10"
                            >
                                <Badge badgeContent={unreadNotificationsCount} color="error">
                                    <Bell size={20} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Profile">
                            <IconButton
                                color="inherit"
                                onClick={handleProfileMenuOpen}
                                className="hover:bg-white/10"
                            >
                                <Avatar
                                    sx={{ width: 32, height: 32 }}
                                    className="border-2 border-white"
                                >
                                    <User size={16} />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Enhanced content area */}
                <Box
                    sx={{
                        p: 3,
                        minHeight: 'calc(100vh - 64px)',
                    }}
                >
                    {children}
                </Box>
            </Box>

            {/* Enhanced menus */}
            <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                        },
                    },
                }}
            >
                <MenuItem onClick={() => { handleProfileMenuClose(); router.push('/patient/profile'); }}>
                    <ListItemIcon>
                        <User size={20} />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); router.push('/settings'); }}>
                    <ListItemIcon>
                        <Settings size={20} />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogOut size={20} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={notificationsMenuAnchor}
                open={Boolean(notificationsMenuAnchor)}
                onClose={handleNotificationsMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        width: 360,
                        maxHeight: 400,
                        borderRadius: 2,
                    },
                }}
            >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">Notifications</Typography>
                </Box>
                {notifications.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">No notifications</Typography>
                    </Box>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => handleNotificationRead(notification.id)}
                            sx={{
                                py: 1.5,
                                px: 2,
                                borderBottom: 1,
                                borderColor: 'divider',
                                backgroundColor: notification.read ? 'inherit' : 'action.hover',
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle2">{notification.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {notification.message}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </Box>
    );
}