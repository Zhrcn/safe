'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Menu as MenuIcon,
  Home,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  MessageSquare,
  ClipboardList,
  Package,
  ShoppingCart,
  Settings as SettingsIcon,
  User,
  BarChart,
  LayoutDashboard as DashboardIcon,
  ShoppingCart as PharmacyIcon,
  MessageSquare as ChatIcon,
  LogOut as LogoutIcon,
  Bell,
  FileText as FileTextIcon,
  Pill as PillIcon,
  ClipboardList as ClipboardListIcon,
  Stethoscope as StethoscopeIcon,
  Store,
  Shield,
  Activity,
  History,
  FileCheck,
  ClipboardCheck,
  UserPlus,
  Building2,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/auth/authSlice';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNotification } from '@/components/ui/Notification';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Separator } from '@/components/ui/Separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import { ThemeButton } from '@/components/ThemeButton';

const drawerWidth = 240;

const roleFolders = {
  doctor: [
    { name: 'dashboard', path: '/doctor/dashboard' },
    { name: 'patients', path: '/doctor/patients' },
    { name: 'appointments', path: '/doctor/appointments' },
    { name: 'analytics', path: '/doctor/analytics' },
    { name: 'medicine', path: '/doctor/medicine' },
    { name: 'messaging', path: '/doctor/messaging' },
    { name: 'profile', path: '/doctor/profile' },
  ],
  patient: [
    { name: 'dashboard', path: '/patient/dashboard' },
    { name: 'appointments', path: '/patient/appointments' },
    { name: 'consultations', path: '/patient/consultations' },
    { name: 'medications', path: '/patient/medications' },
    { name: 'messaging', path: '/patient/messaging' },
    { name: 'prescriptions', path: '/patient/prescriptions' },
    { name: 'profile', path: '/patient/profile' },
    { name: 'providers', path: '/patient/providers' },
    { name: 'medical-records', path: '/patient/medical-records' },
  ],
  pharmacist: [
    { name: 'dashboard', path: '/pharmacist/dashboard' },
    { name: 'inventory', path: '/pharmacist/inventory' },
    { name: 'orders', path: '/pharmacist/orders' },
    { name: 'prescriptions', path: '/pharmacist/prescriptions' },
    { name: 'profile', path: '/pharmacist/profile' },
  ],
  admin: [
    { name: 'dashboard', path: '/admin/dashboard' },
    { name: 'users', path: '/admin/users' },
    { name: 'settings', path: '/admin/settings' },
  ],
};

function prettify(name) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getTabIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('dashboard')) return <Home className="h-5 w-5" />;
  if (n.includes('users')) return <Users className="h-5 w-5" />;
  if (n.includes('appointments')) return <Calendar className="h-5 w-5" />;
  if (n.includes('calendar')) return <Calendar className="h-5 w-5" />;
  if (n.includes('records')) return <FileText className="h-5 w-5" />;
  if (n.includes('consultations')) return <Stethoscope className="h-5 w-5" />;
  if (n.includes('medications') || n.includes('medicine')) return <Pill className="h-5 w-5" />;
  if (n.includes('messaging') || n.includes('messages')) return <MessageSquare className="h-5 w-5" />;
  if (n.includes('prescriptions')) return <ClipboardList className="h-5 w-5" />;
  if (n.includes('inventory')) return <Package className="h-5 w-5" />;
  if (n.includes('orders')) return <ShoppingCart className="h-5 w-5" />;
  if (n.includes('settings')) return <SettingsIcon className="h-5 w-5" />;
  if (n.includes('profile')) return <User className="h-5 w-5" />;
  if (n.includes('analytics')) return <BarChart className="h-5 w-5" />;
  if (n.includes('providers')) return <Users className="h-5 w-5" />;
  return <MenuIcon className="h-5 w-5" />;
}

const UnifiedLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const menuItems = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return (roleFolders[role] || []).map(item => ({
      label: prettify(item.name),
      path: item.path,
      icon: getTabIcon(item.name),
    }));
  }, [user?.role]);

  const handleNavigation = useCallback((path) => {
    if (typeof path !== 'string' || isNavigating) return;
    setIsNavigating(true);
    router.push(path);
    setIsNavigating(false);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [router, mobileOpen, isNavigating]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      showNotification('Logged out successfully', 'success');
      router.push('/auth/login');
    } catch (error) {
      showNotification(error.message || 'Failed to logout', 'error');
    }
  }, [dispatch, router, showNotification]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !isAuthenticated || !user?.role) return;
    const rolePrefix = `/${user.role}`;
    if (typeof pathname === 'string' && !pathname.startsWith(rolePrefix)) {
      handleNavigation(`${rolePrefix}/dashboard`);
    }
  }, [mounted, isAuthenticated, user?.role, pathname, handleNavigation]);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card shadow-2xl rounded-none border-r border-border">
      <div className="flex h-20 items-center px-6">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">SAFE Health</h1>
      </div>
      <Separator className="my-2" />
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 rounded-full px-5 py-3 text-base font-semibold transition-all duration-200 flex items-center",
                  typeof pathname === 'string' && pathname.startsWith(item.path)
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={() => handleNavigation(item.path)}
                disabled={isNavigating}
              >
                <span className={cn("text-xl", typeof pathname === 'string' && pathname.startsWith(item.path) ? "text-primary-foreground" : "text-primary")}>{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-6 pb-8">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive rounded-full px-5 py-3 font-semibold transition-all duration-200"
          onClick={handleLogout}
          disabled={isNavigating}
        >
          <LogoutIcon className="mr-2 h-5 w-5" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          'fixed z-40 top-0 left-0 h-screen w-[270px] transition-transform duration-300 bg-card shadow-2xl border-r border-primary/20 hidden md:block',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ willChange: 'transform' }}
      >
        {sidebarContent}
      </aside>
      {/* Drawer for mobile */}
      {isMobile && (
        <>
          <div
            className={cn(
              'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
              mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={cn(
              'fixed z-50 top-0 left-0 h-screen w-[270px] bg-card shadow-2xl border-r border-primary/20 transition-transform duration-300',
              mobileOpen ? 'translate-x-0' : '-translate-x-[-100%]'
            )}
            style={{ willChange: 'transform' }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        sidebarOpen && !isMobile ? 'md:ml-[270px]' : 'md:ml-0'
      )}>
        <header className="sticky top-0 z-40 w-full h-20 flex items-center px-4 md:px-8 bg-primary shadow-xl border-b border-border backdrop-blur-lg">
          {/* Hamburger menu for mobile */}
          {isMobile && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl mr-4">
                  <MenuIcon className="h-7 w-7" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[270px] bg-card backdrop-blur-xl rounded-none shadow-2xl border-r border-border">
                {sidebarContent}
              </SheetContent>
            </Sheet>
          )}
          {/* Collapse/expand for desktop */}
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              className="text-foreground hover:text-primary transition-colors rounded-xl p-2 mr-2 md:mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <MenuIcon className="h-7 w-7" />
            </button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <ThemeButton />
            <div className="relative">
              <Button variant="ghost" size="icon" title="Notifications" className="rounded-xl">
                <Bell className="h-6 w-6 text-primary-foreground" />
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-md">3</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 rounded-full border-2 border-primary shadow-md bg-primary">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary text-lg">
                      {user?.firstName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-lg" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation(`/${user?.role}/profile`)} disabled={isNavigating} className="rounded-lg">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')} disabled={isNavigating} className="rounded-lg">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isNavigating} className="rounded-lg text-destructive">
                  <LogoutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="bg-card rounded-3xl shadow-2xl p-6 md:p-10 min-h-[calc(100vh-7rem)] mx-0 mt-6 border border-border transition-all duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout; 