'use client';
import React, { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  LayoutDashboard as DashboardIcon,
  Users as PeopleIcon,
  Calendar as CalendarIcon,
  ShoppingCart as PharmacyIcon,
  MessageSquare as ChatIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  Bell,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useVerifyTokenQuery } from '@/store/services/user/authApi';
import { selectIsAuthenticated, selectCurrentUser, logoutUser } from '@/store/slices/auth/authSlice';
import { ROLES, ROLE_ROUTES } from '@/config/app-config';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/Separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'; 
import { cn } from '@/lib/utils';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const drawerWidth = 240;
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" />, path: '/dashboard' },
  { text: 'Patients', icon: <PeopleIcon className="h-5 w-5" />, path: '/patients' },
  { text: 'Appointments', icon: <CalendarIcon className="h-5 w-5" />, path: '/appointments' },
  { text: 'Prescriptions', icon: <PharmacyIcon className="h-5 w-5" />, path: '/prescriptions' },
  { text: 'Messages', icon: <ChatIcon className="h-5 w-5" />, path: '/messaging' },
  { text: 'Settings', icon: <SettingsIcon className="h-5 w-5" />, path: '/settings' },
];
const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const { refetch: verifyToken } = useVerifyTokenQuery(undefined, {
    skip: !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    verifyToken();
    const interval = setInterval(verifyToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, router, verifyToken]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentPath = window.location.pathname;
  const roleRoute = ROLE_ROUTES[user.role];
  
  if (roleRoute && typeof currentPath === 'string' && !currentPath.startsWith(roleRoute)) {
    router.push(typeof roleRoute === 'string' ? roleRoute : '/');
    return null;
  }

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };
  const activePath = router.pathname; 
  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto bg-card shadow-sm rounded-2xl">
      <div className="flex h-16 items-center px-4">
        <h1 className="project-title text-xl font-semibold text-foreground">SAFE Health</h1>
      </div>
      <Separator className="my-2" />
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.text}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  typeof router.pathname === 'string' && router.pathname.startsWith(item.path) && "bg-muted text-primary"
                )}
                onClick={() => {
                  if (typeof item.path === 'string') {
                    router.push(item.path);
                  }
                  if (mobileOpen) {
                    handleDrawerToggle();
                  }
                }}
              >
                {item.icon}
                <span>{item.text}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:block flex-shrink-0" style={{ width: drawerWidth }}>
        {sidebarContent}
      </aside>
      <div className="flex-1 flex flex-col md:ml-[240px]">
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border h-16 flex items-center px-4 md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden mr-4">
              <Button variant="ghost" size="icon">
                <span>
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle sidebar</span>
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px]">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" title="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {user?.profileImage ? (
                      <AvatarImage src={getImageUrl(user?.profileImage)} alt={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'} />
                    ) : (
                      <AvatarFallback>{getInitials(user?.firstName, user?.lastName) || 'U'}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogoutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout; 