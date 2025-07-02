import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { logout } from '@/store/slices/auth/authSlice';
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
import { ThemeButton } from '@/components/ThemeButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  Home, Users, Calendar, FileText, Stethoscope, Pill, MessageSquare, ClipboardList, Package, ShoppingCart, Settings as SettingsIcon, User, BarChart, LogOut as LogoutIcon, Bell, ArrowLeft, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAVIGATION_CONFIG = {
  doctor: [
    { name: 'dashboard', path: '/doctor/dashboard', icon: Home },
    { name: 'patients', path: '/doctor/patients', icon: Users },
    { name: 'appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'analytics', path: '/doctor/analytics', icon: BarChart },
    { name: 'medicine', path: '/doctor/medicine', icon: Pill },
    { name: 'messaging', path: '/doctor/messaging', icon: MessageSquare },
    { name: 'profile', path: '/doctor/profile', icon: User },
  ],
  patient: [
    { name: 'dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'consultations', path: '/patient/consultations', icon: Stethoscope },
    { name: 'medications', path: '/patient/medications', icon: Pill },
    { name: 'messaging', path: '/patient/messaging', icon: MessageSquare },
    { name: 'prescriptions', path: '/patient/prescriptions', icon: ClipboardList },
    { name: 'profile', path: '/patient/profile', icon: User },
    { name: 'providers', path: '/patient/providers', icon: Users },
    { name: 'medical-records', path: '/patient/medical-records', icon: FileText },
  ],
  pharmacist: [
    { name: 'dashboard', path: '/pharmacist/dashboard', icon: Home },
    { name: 'inventory', path: '/pharmacist/inventory', icon: Package },
    { name: 'orders', path: '/pharmacist/orders', icon: ShoppingCart },
    { name: 'prescriptions', path: '/pharmacist/prescriptions', icon: ClipboardList },
    { name: 'profile', path: '/pharmacist/profile', icon: User },
  ],
  admin: [
    { name: 'dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'users', path: '/admin/users', icon: Users },
    { name: 'logs', path: '/admin/logs', icon: FileText },
    { name: 'reports', path: '/admin/reports', icon: BarChart },
    { name: 'support', path: '/admin/support', icon: MessageSquare },
    { name: 'notifications', path: '/admin/notifications', icon: Bell },
    { name: 'settings', path: '/admin/settings', icon: SettingsIcon },
  ],
};

const formatNavigationName = (name) => name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
const getNavigationIcon = (IconComponent) => <IconComponent className="h-5 w-5" />;

const useSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);
  const toggleCollapse = useCallback(() => setSidebarCollapsed(prev => !prev), []);

  useEffect(() => { if (!isMobile) setMobileOpen(false); }, [isMobile]);

  return { mobileOpen, sidebarCollapsed, isMobile, toggleMobile, toggleCollapse };
};

const SidebarToggle = ({ collapsed, onToggle, isRtl, t }) => (
  <Button
    onClick={onToggle}
    className={cn(
      "absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center h-14 w-14 rounded-full border transition-colors shadow-lg hover:shadow-xl",
      isRtl ? "-left-10" : "-right-10"
    )}
    style={{
      background: "var(--color-card)",
      borderColor: "var(--color-border)",
      color: "var(--color-foreground)",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-50%)",
    }}
    aria-label={
      collapsed
        ? t("aria.expandSidebar", "Expand sidebar")
        : t("aria.collapseSidebar", "Collapse sidebar")
    }
  >
    {collapsed ? (
      isRtl ? (
        <ArrowLeft className="h-full w-full text-primary" />
      ) : (
        <ArrowRight className="h-full w-full text-primary" />
      )
    ) : isRtl ? (
      <ArrowRight className="h-full w-full text-primary" />
    ) : (
      <ArrowLeft className="h-full w-full text-primary" />
    )}
  </Button>
);

const UserProfile = ({ user, collapsed, t }) => (
  <div className={cn('flex flex-col items-center py-8 border-b border-border transition-all duration-300', collapsed ? 'px-0' : 'px-6')}>
    <span className={cn("mb-4 flex items-center justify-center rounded-full ring-2 ring-primary/20 p-2", "bg-primary/10 dark:bg-gray-800")}> 
      <img
        src="/logo(1).png"
        alt="App Icon"
        className="w-14 h-14 object-contain rounded-full"
        style={{ backgroundColor: 'var(--color-navbar, #f0f4f8)', filter: 'var(--logo-img-filter, none)' }}
      />
    </span>
    {!collapsed && (
      <span className="font-extrabold text-2xl tracking-tight text-primary dark:text-white mb-3">
        {t('appName', 'SafeApp')}
      </span>
    )}
    {!collapsed && user && (
      <div className="flex flex-row items-center gap-3 mb-6 w-full">
        <Avatar className="h-14 w-14" src={user?.profile?.avatar} />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-base text-gray-900 dark:text-white truncate">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {user?.email}
          </span>
        </div>
      </div>
    )}
    <div className="w-full h-px bg-border mb-2" />
  </div>
);

const NavigationMenu = ({ items, pathname, collapsed, t }) => (
  <nav className="px-1 py-4 space-y-2 overflow-y-auto">
    {items.map((item) => {
      const isActive = pathname.startsWith(item.path);
      return (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            'flex items-center gap-3 py-2 rounded-full font-medium transition-colors duration-200',
            collapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4',
            isActive
              ? 'active-sidebar-link'
              : 'hover:bg-muted hover:text-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
          style={
            isActive
              ? { background: 'var(--color-primary, #0077CC)', color: 'var(--color-primary-foreground, #fff)' }
              : { color: 'var(--color-navbar-foreground)' }
          }
          aria-current={isActive ? 'page' : undefined}
        >
          {item.icon && getNavigationIcon(item.icon)}
          {!collapsed && <span className="truncate">{t(`sidebar.${item.name}`, formatNavigationName(item.name))}</span>}
        </Link>
      );
    })}
  </nav>
);

const UnifiedLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { showNotification } = useNotification();
  const { mobileOpen, sidebarCollapsed, isMobile, toggleMobile, toggleCollapse } = useSidebar();
  const isRtl = i18n.language === 'ar';
  const [mounted, setMounted] = useState(false);

  const userFromUserSlice = useSelector((state) => state.user?.user);
  const user = useSelector((state) => state.auth.user) || userFromUserSlice;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const menuItems = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return (NAVIGATION_CONFIG[role] || []);
  }, [user?.role]);

  const handleNavigation = useCallback((path) => {
    if (typeof path !== 'string') return;
    router.push(path);
    if (mobileOpen) toggleMobile();
  }, [router, mobileOpen, toggleMobile]);

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

  if (!mounted) return null;

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
          <SidebarToggle collapsed={sidebarCollapsed} onToggle={toggleCollapse} isRtl={isRtl} t={t} />
          <UserProfile user={user} collapsed={sidebarCollapsed} t={t} />
          <div className="flex-1 flex flex-col justify-between">
            <NavigationMenu items={menuItems} pathname={pathname} collapsed={sidebarCollapsed} t={t} />
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
                  'flex items-center gap-3 py-2 rounded-full font-medium text-red-500 hover:bg-red-400 hover:text-white dark:hover:bg-red-900 transition-colors duration-200 w-full',
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
                <DropdownMenuItem onClick={() => handleNavigation(`/${user?.role}/profile`)} className="rounded-2xl">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile', 'Profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')} className="rounded-2xl">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>{t('settings', 'Settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-2xl text-destructive">
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