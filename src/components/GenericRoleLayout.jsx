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
                  <Typography variant="h6" className="font-bold text-lg">
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
                            className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'text-muted-foreground hover:bg-muted/40'
                                }`}
                        >
                            {Icon && <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : ''}`} />}
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                              <ChevronRight className="ml-auto h-5 w-5" />
                            )}
                        </Link>
                    );
                })}
            </Box>
            <Box className="p-4 mt-auto">
              <Divider className="mb-4" />
              <Box className="flex items-center p-2 rounded-lg hover:bg-muted/40 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">Logout</span>
              </Box>
            </Box>
        </>
    );

    // Define outer return statement for the component
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Simple fixed width sidebar */}
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
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 3,
                    display: isDesktop ? 'block' : 'none'
                }}
                className={sidebarBg}
            >
                <SidebarContent />
            </Box>
            
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                <SidebarContent />
            </Drawer>
            
            {/* Main content with margin adjustment */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    marginLeft: isDesktop && sidebarOpen ? `${drawerWidth}px` : 0,
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Header */}
                <Box className={`${headerBg} text-white h-16 shadow-sm transition-colors duration-300`}>
                    <Box className="flex items-center justify-between h-full px-4">
                        <Box className="flex items-center">
                            <IconButton color="inherit" onClick={toggleSidebar} className="mr-2">
                                {mobileOpen || sidebarOpen ? <X /> : <MenuIcon />}
                            </IconButton>
                            <Typography variant="h6" className="font-bold hidden md:block">
                                {title}
                            </Typography>
                        </Box>
                        
                        <Box className="flex items-center gap-1">
                            {/* Theme Toggle */}
                            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                                <IconButton color="inherit" onClick={toggleTheme}>
                                    {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </IconButton>
                            </Tooltip>
                            
                            {/* Notifications */}
                            <IconButton color="inherit" onClick={handleNotificationsMenuOpen}>
                                <Badge badgeContent={unreadNotificationsCount} color="error">
                                    <Bell size={20} />
                                </Badge>
                            </IconButton>
                            <Menu
                              anchorEl={notificationsMenuAnchor}
                              open={Boolean(notificationsMenuAnchor)}
                              onClose={handleNotificationsMenuClose}
                              PaperProps={{
                                sx: {
                                  boxShadow: 3,
                                  borderRadius: 2,
                                }
                              }}
                            >
                              <Box className="px-4 py-2 border-b">
                                <Typography variant="subtitle1" className="font-medium">Notifications</Typography>
                              </Box>
                              {/* Use conditional rendering instead of returns */}
                              {(() => {
                                if (notifications.length === 0) {
                                  return (
                                    <Box className="p-4 text-center">
                                      <Typography variant="body2" color="text.secondary">No notifications</Typography>
                                    </Box>
                                  );
                                } else {
                                  return notifications.map((notification) => (
                                    <MenuItem 
                                      key={notification.id} 
                                      onClick={() => handleNotificationRead(notification.id)}
                                      sx={{ 
                                        py: 1.5,
                                        px: 2,
                                        backgroundColor: notification.read ? 'transparent' : 'action.hover'
                                      }}
                                    >
                                      <Box>
                                        <Typography variant="subtitle2" className="font-medium">
                                          {notification.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mt-0.5">
                                          {notification.message}
                                        </Typography>
                                      </Box>
                                    </MenuItem>
                                  ));
                                }
                              })()}
                              <Divider />
                              <Box className="p-2 text-center">
                                <Typography 
                                  variant="body2" 
                                  color="primary" 
                                  className="cursor-pointer hover:underline"
                                  onClick={handleNotificationsMenuClose}
                                >
                                  View all notifications
                                </Typography>
                              </Box>
                            </Menu>
                            
                            {/* User Profile */}
                            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                                <Avatar 
                                  sx={{ width: 32, height: 32 }}
                                  className="bg-primary-dark text-white"
                                >
                                  S
                                </Avatar>
                            </IconButton>
                            <Menu
                              anchorEl={profileMenuAnchor}
                              open={Boolean(profileMenuAnchor)}
                              onClose={handleProfileMenuClose}
                              PaperProps={{
                                sx: {
                                  boxShadow: 3,
                                  width: 200,
                                  borderRadius: 2,
                                }
                              }}
                            >
                              <Box className="px-4 py-3">
                                <Typography variant="subtitle1" className="font-medium">Sarah Johnson</Typography>
                                <Typography variant="body2" color="text.secondary">Patient</Typography>
                              </Box>
                              <Divider />
                              <MenuItem onClick={handleProfileMenuClose}>
                                <ListItemIcon>
                                  <User size={18} />
                                </ListItemIcon>
                                Profile
                              </MenuItem>
                              <MenuItem onClick={handleProfileMenuClose}>
                                <ListItemIcon>
                                  <Settings size={18} />
                                </ListItemIcon>
                                Settings
                              </MenuItem>
                              <Divider />
                              <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                  <LogOut size={18} />
                                </ListItemIcon>
                                Logout
                              </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Box>
                
                {/* Main Content */}
                <Box className="flex-1 overflow-auto bg-background p-4 md:p-6 transition-colors duration-300">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}