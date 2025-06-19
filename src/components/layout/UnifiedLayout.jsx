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
  X,
  ArrowLeft,
  ArrowRight,
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
import Link from 'next/link';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const menuItems = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return (roleFolders[role] || []).map(item => ({
      name: item.name,
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
    }
  }, [isMobile]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <aside
          className={cn(
            'relative fixed z-40 top-0 left-0 h-screen bg-white/90 dark:bg-gray-900/90 shadow-2xl border-r border-border flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'w-16' : 'w-[270px]'
          )}
        >
          {/* Collapse/expand arrow button at right edge, vertically centered */}
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-50 flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-border shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </button>
          <div className={cn('flex items-center justify-center py-6 border-b border-border transition-all duration-300', sidebarCollapsed ? 'px-0' : 'px-4')}> 
            <img src="/favicon.svg" alt="App Logo" className={cn('h-8 w-8', sidebarCollapsed ? '' : 'mr-2')} />
            {!sidebarCollapsed && (
              <span className="font-extrabold text-xl tracking-tight text-primary dark:text-white">SafeApp</span>
            )}
          </div>
          <div className={cn('flex flex-col items-center py-4 border-b border-border bg-white/80 dark:bg-gray-900/80 transition-all duration-300', sidebarCollapsed ? 'px-0' : 'px-4')}> 
            <Avatar className="h-10 w-10 mb-2" src={user?.profile?.avatar} />
            {!sidebarCollapsed && (
              <>
                <div className="font-bold text-lg text-center text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
              </>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <nav className="px-1 py-4 space-y-2 overflow-y-auto">
              {menuItems.map((item, idx) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'flex items-center gap-3 py-2 rounded-full font-medium transition-colors duration-200',
                    sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4',
                    pathname.startsWith(item.path)
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 shadow-md'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                  aria-current={pathname.startsWith(item.path) ? 'page' : undefined}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span className="truncate">{prettify(item.name)}</span>}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pb-6 px-1">
              <Link
                href="/settings"
                className={cn(
                  'flex items-center gap-3 py-2 rounded-full font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
                  sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4'
                )}
              >
                <SettingsIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span>Settings</span>}
              </Link>
              <Link
                href="/logout"
                className={cn(
                  'flex items-center gap-3 py-2 rounded-full font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 w-full',
                  sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4'
                )}
              >
                <LogoutIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span>Logout</span>}
              </Link>
            </div>
          </div>
        </aside>
      )}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        !isMobile && sidebarCollapsed ? 'md:ml-16' : !isMobile ? 'md:ml-[270px]' : 'md:ml-0'
      )}>
        <header className="sticky top-0 z-40 w-full h-20 flex items-center px-4 md:px-8 bg-primary shadow-xl border-b border-border backdrop-blur-lg">
          {isMobile && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl mr-4">
                  <MenuIcon className="h-7 w-7" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[270px] bg-white/90 dark:bg-gray-900/90 shadow-2xl border-r border-border">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 z-50 rounded-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                </button>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-center py-6 border-b border-border">
                      <img src="/favicon.svg" alt="App Logo" className="h-8 w-8 mr-2" />
                      <span className="font-extrabold text-xl tracking-tight text-primary dark:text-white">SafeApp</span>
                    </div>
                    <div className="flex flex-col items-center py-4 border-b border-border bg-white/80 dark:bg-gray-900/80">
                      <Avatar className="h-14 w-14 mb-2" src={user?.profile?.avatar} />
                      <div className="font-bold text-lg text-center text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                    </div>
                    <nav className="px-2 py-4 space-y-2 overflow-y-auto">
                      {menuItems.map((item, idx) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2 rounded-full font-medium transition-colors duration-200',
                            pathname.startsWith(item.path)
                              ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 shadow-md'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                          )}
                          aria-current={pathname.startsWith(item.path) ? 'page' : undefined}
                        >
                          {item.icon}
                          <span className="truncate">{prettify(item.name)}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="flex flex-col gap-2 pb-6">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 rounded-full font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <SettingsIcon className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="/logout"
                      className="flex items-center gap-3 px-4 py-2 rounded-full font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 w-full"
                    >
                      <LogoutIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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