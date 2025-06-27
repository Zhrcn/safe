import { Separator } from '@/components/ui/Separator';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Menu as MenuIcon,
  X as CloseIcon,
  ArrowLeft as CollapseSidebarIcon,
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import { ThemeButton } from '@/components/ThemeButton';
import Link from 'next/link';
import Image from 'next/image';

import { useSelector as useUserSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  const { t, i18n } = useTranslation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userFromUserSlice = useUserSelector((state) => state.user?.user);
  const user = useSelector((state) => state.auth.user) || userFromUserSlice;
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
      showNotification(t('notification.logoutSuccess', 'Logged out successfully'), 'success');
      router.push('/auth/login');
    } catch (error) {
      showNotification(error.message || t('notification.logoutFail', 'Failed to logout'), 'error');
    }
  }, [dispatch, router, showNotification, t]);

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

  const isRtl = i18n.language === 'ar';

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("flex min-h-screen bg-background", isRtl ? 'flex-row-reverse' : 'flex-row')}>
      {!isMobile && (
        <aside
          className={cn(
            'relative fixed z-40 top-0',
            isRtl ? 'right-0' : 'left-0',
            'h-screen border-r border-border flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'w-16' : 'w-[270px]'
          )}
          style={{
            background: 'var(--color-navbar)',
            color: 'var(--color-navbar-foreground)',
            [isRtl ? 'right' : 'left']: 0
          }}
        >
          <Button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
              isRtl ? 'left-[-20px]' : 'right-[-20px]'
            )}
            aria-label={sidebarCollapsed ? t('aria.expandSidebar', 'Expand sidebar') : t('aria.collapseSidebar', 'Collapse sidebar')}
          >
          </Button>
          <div className={cn('flex flex-col items-center py-8 border-b border-border transition-all duration-300', sidebarCollapsed ? 'px-0' : 'px-6')}>
            <span
              className={cn(
                "mb-4 flex items-center justify-center rounded-full ring-2 ring-primary/20 p-2",
                "bg-primary/10 dark:bg-gray-800"
              )}
            >
              <img
                src="/logo(1).png"
                alt="App Icon"
                className="w-14 h-14 object-contain rounded-full"
                style={{
                  backgroundColor: 'var(--color-navbar, #f0f4f8)',
                  filter: 'var(--logo-img-filter, none)'
                }}
              />
              <style jsx>{`
                @media (prefers-color-scheme: dark) {
                  img[alt="App Icon"] {
                    background-color: var(--color-navbar, #23272f);
                  }
                }
              `}</style>
            </span>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-2xl tracking-tight text-primary dark:text-white mb-3">{t('appName', 'SafeApp')}</span>
            )}
            {!sidebarCollapsed && user && (
              <div className="flex flex-row items-center gap-3 mb-6 w-full">
                <Avatar className="h-14 w-14" src={user?.profile?.avatar} />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-base text-gray-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</span>
                </div>
              </div>
            )}
            <div className="w-full h-px bg-border mb-2" />
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
                      ? 'bg-[color:var(--color-primary)/.1] text-[color:var(--color-primary)]'
                      : 'hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]',
                    'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-2'
                  )}
                  style={{ color: 'var(--color-navbar-foreground)' }}
                  aria-current={pathname.startsWith(item.path) ? 'page' : undefined}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span className="truncate">{t(`sidebar.${item.name}`, prettify(item.name))}</span>}
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
                {!sidebarCollapsed && <span>{t('settings', 'Settings')}</span>}
              </Link>
              <Link
                href="/logout"
                className={cn(
                  'flex items-center gap-3 py-2 rounded-full font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 w-full',
                  sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4'
                )}
              >
                <LogoutIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{t('logout', 'Logout')}</span>}
              </Link>
            </div>
          </div>
        </aside>
      )}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        !isMobile && sidebarCollapsed ? (isRtl ? 'md:mr-16' : 'md:ml-16') : !isMobile ? (isRtl ? 'md:mr-[270px]' : 'md:ml-[270px]') : 'md:ml-0'
      )}>
        <header
          className="sticky top-0 z-40 w-full h-20 flex items-center px-4 md:px-8 backdrop-blur-xl shadow-xl border-b border-border transition-colors"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          <div className="flex items-center gap-3">
            <img src="/logo(1).png" alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="font-extrabold text-2xl tracking-tight">{t('appName', 'SafeApp')}</span>
          </div>
          <div className="flex-1" />
          <div className={cn('flex items-center gap-6', isRtl && 'flex-row-reverse')}>
            <ThemeButton />
            <LanguageSwitcher />
            <div className="relative">
              <Button variant="ghost" size="icon" title={t('notifications', 'Notifications')}>
                <Bell className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-md">3</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 border-2 border-primary shadow-md bg-primary">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white text-lg">
                      {user?.firstName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-lg" align={isRtl ? 'start' : 'end'} forceMount>
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
                  <span>{t('profile', 'Profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')} disabled={isNavigating} className="rounded-lg">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>{t('settings', 'Settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isNavigating} className="rounded-lg text-destructive">
                  <LogoutIcon className="mr-2 h-4 w-4" />
                  <span>{t('logout', 'Logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout; 