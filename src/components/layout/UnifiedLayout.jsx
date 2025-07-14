import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { logoutUser } from '@/store/slices/auth/authSlice';
import { useNotification } from '@/components/ui/Notification';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, getImageUrl } from '@/components/ui/Avatar';
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
  Home, Users, Calendar, FileText, Stethoscope, Pill, MessageSquare, ClipboardList, Package, ShoppingCart, Settings as SettingsIcon, User, BarChart, LogOut as LogoutIcon, Bell, ArrowLeft, ArrowRight, Menu as MenuIcon, X as CloseIcon, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSocket } from '@/utils/socket';
import { getToken } from '@/utils/tokenUtils';
import NotificationDialog from '@/components/patient/NotificationDialog';
import axios from 'axios';

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
    { name: 'providers', path: '/patient/providers', icon: Users },
    { name: 'medical-records', path: '/patient/medical-records', icon: FileText },
    { name: 'profile', path: '/patient/profile', icon: User },
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
  const isMobile = useMediaQuery('(max-width: 640px)');

  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);
  const toggleCollapse = useCallback(() => setSidebarCollapsed(prev => !prev), []);

  useEffect(() => { if (!isMobile) setMobileOpen(false); }, [isMobile]);

  return { mobileOpen, sidebarCollapsed, isMobile, toggleMobile, toggleCollapse, setMobileOpen };
};

const SidebarToggle = ({ collapsed, onToggle, isRtl, t }) => (
  <Button
    onClick={onToggle}
    className={cn(
      "flex items-center justify-center h-12 w-6 sm:h-14 sm:w-7 p-0 bg-[var(--color-navbar)] shadow-lg hover:shadow-xl transition-colors duration-200",
      isRtl
        ? "rounded-l-full rounded-r-none"
        : "rounded-r-full rounded-l-none"
    )}
    style={{
      boxShadow: "0 8px 25px -8px rgba(0,0,0,0.15)",
      color: "var(--color-foreground)",
      background: "var(--color-navbar)",
      transition: "all 0.3s ease-in-out",
      [isRtl ? 'marginRight' : 'marginLeft']: '-1px',
    }}
    aria-label={
      collapsed
        ? t("aria.expandSidebar", "Expand sidebar")
        : t("aria.collapseSidebar", "Collapse sidebar")
    }
  >
    {collapsed ? (
      isRtl ? (
        <ArrowLeft className="h-5 w-5 text-primary" />
      ) : (
        <ArrowRight className="h-5 w-5 text-primary" />
      )
    ) : isRtl ? (
      <ArrowRight className="h-5 w-5 text-primary" />
    ) : (
      <ArrowLeft className="h-5 w-5 text-primary" />
    )}
  </Button>
);

function ImageModal({ open, onClose, imageUrl, alt }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="relative" onClick={e => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-[90vw] max-h-[80vh] rounded-2xl shadow-2xl border-4 border-white"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80 transition-colors"
          aria-label="Close image preview"
        >
          <CloseIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}

const UserProfile = ({ user, collapsed, t, onAvatarClick }) => {
  const imageUrl = user?.profileImage ? getImageUrl(user.profileImage) + `?t=${Date.now()}` : '/avatars/default-avatar.svg';
  return (
    <div className={cn(
      'flex flex-col items-center py-6 sm:py-8 border-b border-border transition-all duration-300',
      collapsed ? 'px-0' : 'px-2 sm:px-6'
    )}>
      <span className={cn("mb-3 sm:mb-4 flex items-center justify-center rounded-full ring-2 ring-primary/20 p-1 sm:p-2", "bg-primary/10 dark:bg-gray-800")}> 
        <img
          src="/logo(1).png"
          alt="App Icon"
          className="w-10 h-10 sm:w-14 sm:h-14 object-contain rounded-full"
          style={{ backgroundColor: 'var(--color-navbar, #f0f4f8)', filter: 'var(--logo-img-filter, none)' }}
        />
      </span>
      {!collapsed && (
        <span className="project-title font-extrabold text-lg sm:text-2xl tracking-tight text-primary dark:text-white mb-2 sm:mb-3">
          {t('appName', 'SafeApp')}
        </span>
      )}
      {!collapsed && user && (
        <div className="flex flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-6 w-full">
          <button
            type="button"
            className="focus:outline-none"
            onClick={() => onAvatarClick && onAvatarClick(imageUrl)}
            title="View profile image"
          >
            <Avatar 
              src={imageUrl}
              alt="Profile Picture"
              className="h-10 w-10 sm:h-14 sm:w-14"
            >
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg sm:text-2xl flex items-center justify-center w-full h-full rounded-full">
                {(user?.firstName || user?.lastName)
                  ? `${user?.firstName ? user.firstName.charAt(0) : ''}${user?.lastName ? user.lastName.charAt(0) : ''}`
                  : 'U'}
              </AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
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
};

const NavigationMenu = ({ items, pathname, collapsed, t, onNavigate }) => (
  <nav className="px-0.5 sm:px-1 py-2 sm:py-4 space-y-1 sm:space-y-2 overflow-y-auto">
    {items.map((item) => {
      const isActive = pathname.startsWith(item.path);
      return (
        <Link
          key={item.path}
          href={item.path}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 font-medium transition-colors duration-200',
            collapsed ? 'justify-center px-0 w-10 sm:w-12 mx-auto' : 'px-2 sm:px-4',
            isActive
              ? 'rounded-xl active-sidebar-link'
              : 'rounded-xl hover:bg-muted hover:text-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base'
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

const MobileSidebarDrawer = ({
  open,
  onClose,
  sidebarCollapsed,
  toggleCollapse,
  isRtl,
  t,
  user,
  menuItems,
  pathname,
  handleNavigation,
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-modal="true"
      role="dialog"
      style={{ display: open ? 'block' : 'none' }}
    >
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-0 h-full bg-[var(--color-navbar)] flex flex-col transition-transform duration-300 shadow-2xl",
          isRtl
            ? "border-l border-border"
            : "border-r border-border",
          isRtl
            ? open
              ? "right-0 translate-x-0"
              : "-right-[80vw] sm:-right-[270px] translate-x-full"
            : open
              ? "left-0 translate-x-0"
              : "-left-[80vw] sm:-left-[270px] -translate-x-full",
          "w-[80vw] sm:w-[270px] max-w-full"
        )}
        style={{
          color: 'var(--color-navbar-foreground)',
          zIndex: 60,
        }}
      >
        <div className="flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4 border-b border-border">
          <span className="flex items-center gap-1 sm:gap-2">
            <img src="/logo(1).png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <span className="project-title font-extrabold text-lg sm:text-2xl tracking-tight">{t('appName', 'SafeApp')}</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('aria.closeSidebar', 'Close sidebar')}
            className="ml-1 sm:ml-2"
          >
            <CloseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
        <UserProfile user={user} collapsed={false} t={t} onAvatarClick={handleNavigation} />
        <div className="flex-1 flex flex-col justify-between">
          <NavigationMenu
            items={menuItems}
            pathname={pathname}
            collapsed={false}
            t={t}
            onNavigate={onClose}
          />
          <div className="flex flex-col gap-1.5 sm:gap-2 pb-4 sm:pb-6 px-1">
            <Link
              href="/settings"
              onClick={onClose}
              className={cn(
                'flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 rounded-full font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
                'px-2 sm:px-4 text-sm sm:text-base'
              )}
            >
              <SettingsIcon className="h-5 w-5" />
                              <span>{typeof t('settings') === 'string' ? t('settings') : 'Settings'}</span>
            </Link>
            <Link
              href="/logout"
              onClick={onClose}
              className={cn(
                'flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 rounded-full font-medium text-red-500 hover:bg-red-400 hover:text-white dark:hover:bg-red-900 transition-colors duration-200 w-full',
                'px-2 sm:px-4 text-sm sm:text-base'
              )}
            >
              <LogoutIcon className="h-5 w-5" />
                              <span>{typeof t('logout') === 'string' ? t('logout') : 'Logout'}</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

const HeaderUserAvatar = ({ user, onAvatarClick, asButton = true }) => {
  const imageUrl = user?.profileImage ? getImageUrl(user.profileImage) + `?t=${Date.now()}` : '/avatars/default-avatar.svg';
  if (asButton) {
    return (
      <button
        type="button"
        className="focus:outline-none"
        onClick={() => onAvatarClick && onAvatarClick(imageUrl)}
        title="View profile image"
      >
        <Avatar 
          src={imageUrl}
          alt="Profile Picture"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base sm:text-lg flex items-center justify-center w-full h-full rounded-full">
            {(user?.firstName || user?.lastName)
              ? `${user?.firstName ? user.firstName.charAt(0) : ''}${user?.lastName ? user.lastName.charAt(0) : ''}`
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </button>
    );
  }
  return (
    <span
      className="focus:outline-none"
      title="View profile image"
      style={{ display: 'inline-block' }}
    >
      <Avatar 
        src={imageUrl}
        alt="Profile Picture"
        className="h-8 w-8 sm:h-10 sm:w-10"
      >
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-base sm:text-lg flex items-center justify-center w-full h-full rounded-full">
          {(user?.firstName || user?.lastName)
            ? `${user?.firstName ? user.firstName.charAt(0) : ''}${user?.lastName ? user.lastName.charAt(0) : ''}`
            : 'U'}
        </AvatarFallback>
      </Avatar>
    </span>
  );
};

const UnifiedLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { t, i18n, ready } = useTranslation();
  const { showNotification } = useNotification();
  const { mobileOpen, sidebarCollapsed, isMobile, toggleMobile, toggleCollapse, setMobileOpen } = useSidebar();
  const isRtl = i18n.language === 'ar';
  const [mounted, setMounted] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = getToken();

  const menuItems = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return (NAVIGATION_CONFIG[role] || []);
  }, [user?.role]);

  const handleNavigation = useCallback((path) => {
    if (typeof path !== 'string') return;
    router.push(path);
    if (mobileOpen) setMobileOpen(false);
  }, [router, mobileOpen, setMobileOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      showNotification(t('notification.logoutSuccess', 'Logged out successfully'), 'success');
      router.push('/auth/login');
    } catch (error) {
      showNotification(error.message || t('notification.logoutFail', 'Failed to logout'), 'error');
    }
  }, [dispatch, router, showNotification, t]);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkBackendHealth = async () => {
      if (!isMounted) return;
      
      try {
        const { checkBackendHealth: healthCheck } = await import('@/utils/backendHealth');
        const result = await healthCheck();
        
        if (!isMounted) return;
        
        console.log('Backend health check:', result);
        
        if (result.status === 'unhealthy') {
          showNotification(
            t('notification.backendUnavailable', 'Backend service not available. Please check if the server is running.'),
            'error'
          );
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Backend health check failed:', error);
      }
    };
    
    checkBackendHealth();
    
    return () => {
      isMounted = false;
    };
  }, []); 

  useEffect(() => {
    if (!user || !token) return;
    
    console.log('Notifications request - Token exists:', !!token);
    console.log('Notifications request - User:', user);
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expires:', new Date(payload.exp * 1000).toLocaleString());
      console.log('Current time:', new Date().toLocaleString());
      console.log('Token expired:', payload.exp * 1000 < Date.now());
      
      if (payload.exp * 1000 < Date.now()) {
        console.error('Token expired');
        showNotification(t('notification.tokenExpired', 'Session expired. Please log in again.'), 'error');
        return;
      }
    } catch (error) {
      console.error('Invalid token format:', error);
      showNotification(t('notification.invalidToken', 'Invalid session. Please log in again.'), 'error');
      return;
    }
    
    setNotifLoading(true);
    axios.get('/api/notifications?limit=20', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const notifs = res.data.notifications || [];
        setNotifications(notifs.map(n => ({
          id: n._id || n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleTimeString(),
          read: n.isRead,
        })));
        setUnreadCount(notifs.filter(n => !n.isRead).length);
        setNotifLoading(false);
      })
      .catch(err => {
        setNotifLoading(false);
        console.error('Notifications fetch error:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('Error headers:', err.response?.headers);
        
        let errorMessage = t('notification.fetchFail', 'Failed to fetch notifications');
        
        if (err.response?.status === 404) {
          errorMessage = t('notification.backendUnavailable', 'Backend service not available. Please check if the server is running.');
        } else if (err.response?.status === 401) {
          errorMessage = t('notification.unauthorized', 'Authentication required. Please log in again.');
          dispatch(logoutUser());
          router.push('/login');
        } else if (err.response?.status === 500) {
          errorMessage = t('notification.serverError', 'Server error. Please try again later.');
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = t('notification.networkError', 'Network error. Please check your connection.');
        }
        
        showNotification(errorMessage, 'error');
      });
  }, [user, token, showNotification, t]);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit('join', { userId: user.id, role: user.role });
    socket.on('appointment:update', (data) => {
      setNotifications(prev => [
        {
          id: data.id || Date.now(),
          title: 'Appointment Update',
          message: data.message,
          time: new Date().toLocaleTimeString(),
          read: false,
        },
        ...prev,
      ]);
      setUnreadCount(count => count + 1);
    });
    socket.on('message:new', (data) => {
      setNotifications(prev => [
        {
          id: data.id || Date.now(),
          title: 'New Message',
          message: `${data.senderName}: ${data.text}`,
          time: new Date().toLocaleTimeString(),
          read: false,
        },
        ...prev,
      ]);
      setUnreadCount(count => count + 1);
    });
    return () => {
      socket.off('appointment:update');
      socket.off('message:new');
    };
  }, [user]);

  const handleNotifOpen = () => {
    setNotifOpen(true);
    setUnreadCount(0);
    
    if (!token) {
      console.error('No token available for marking notifications as read');
      return;
    }
    
    axios.patch('/api/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => {
      console.error('Error marking notifications as read:', err);
      if (err.response?.status === 401) {
        dispatch(logoutUser());
        router.push('/login');
      }
    });
    
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const handleNotifClose = () => setNotifOpen(false);
  const handleMarkAsRead = (id) => {
    if (!token) {
      console.error('No token available for marking notification as read');
      return;
    }
    
    axios.patch(`/api/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => {
      console.error('Error marking notification as read:', err);
      if (err.response?.status === 401) {
        dispatch(logoutUser());
        router.push('/login');
      }
    });
    
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

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

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const handleAvatarClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setImageModalOpen(true);
  };
  const handleModalClose = () => {
    setImageModalOpen(false);
    setModalImageUrl('');
  };

  if (!ready || !mounted) return null;

  return (
    <div className={cn("flex h-screen bg-background overflow-hidden", 'flex-row')}>
      {!isMobile && (
        <aside
          className={cn(
            'fixed z-30 top-0',
            'h-screen flex flex-col transition-all duration-300',
            isRtl ? 'right-0 border-l border-border' : 'left-0 border-r border-border',
            sidebarCollapsed ? 'w-12 sm:w-16' : 'w-[60px] sm:w-[270px]'
          )}
          style={{
            background: 'var(--color-navbar)',
            color: 'var(--color-navbar-foreground)'
          }}
        >
          <div
            className={cn(
              'hidden md:block',
              'fixed z-40',
              'top-1/2 -translate-y-1/2'
            )}
            style={
              isRtl 
                ? { 
                    right: sidebarCollapsed ? '3rem' : '16.875rem',
                    left: 'auto'
                  }
                : { 
                    left: sidebarCollapsed ? '3rem' : '16.875rem',
                    right: 'auto'
                  }
            }
          >
            <SidebarToggle
              collapsed={sidebarCollapsed}
              onToggle={toggleCollapse}
              isRtl={isRtl}
              t={t}
            />
          </div>
          <UserProfile user={user} collapsed={sidebarCollapsed} t={t} onAvatarClick={handleAvatarClick} />
          <div className="flex-1 flex flex-col justify-between h-[calc(100vh-8rem)]">
            <NavigationMenu items={menuItems} pathname={pathname} collapsed={sidebarCollapsed} t={t} />
            <div className="flex flex-col gap-1.5 sm:gap-2 pb-4 sm:pb-6 px-1">
              <Link
                href="/settings"
                className={cn(
                  'flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 rounded-full font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
                  sidebarCollapsed ? 'justify-center px-0 w-10 sm:w-12 mx-auto' : 'px-2 sm:px-4 text-sm sm:text-base'
                )}
              >
                <SettingsIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{typeof t('settings') === 'string' ? t('settings') : 'Settings'}</span>}
              </Link>
              <Link
                href="/logout"
                className={cn(
                  'flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 rounded-full font-medium text-red-500 hover:bg-red-400 hover:text-white dark:hover:bg-red-900 transition-colors duration-200 w-full',
                  sidebarCollapsed ? 'justify-center px-0 w-10 sm:w-12 mx-auto' : 'px-2 sm:px-4 text-sm sm:text-base'
                )}
              >
                <LogoutIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{typeof t('logout') === 'string' ? t('logout') : 'Logout'}</span>}
              </Link>
            </div>
          </div>
        </aside>
      )}

      {isMobile && (
        <MobileSidebarDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sidebarCollapsed={false}
          toggleCollapse={toggleCollapse}
          isRtl={isRtl}
          t={t}
          user={user}
          menuItems={menuItems}
          pathname={pathname}
          handleNavigation={handleNavigation}
        />
      )}

      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        !isMobile && (
          isRtl 
            ? (sidebarCollapsed ? 'mr-12 sm:mr-16' : 'mr-[60px] sm:mr-[270px]')
            : (sidebarCollapsed ? 'ml-12 sm:ml-16' : 'ml-[60px] sm:ml-[270px]')
        )
      )}>
        <header
          className="sticky top-0 z-20 w-full h-14 sm:h-20 flex items-center px-2 sm:px-4 md:px-8 backdrop-blur-xl shadow-xl border-b border-border transition-colors flex-shrink-0"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label={t('aria.openSidebar', 'Open sidebar')}
              className="mr-1 sm:mr-2"
            >
              <MenuIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </Button>
          )}
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <img src="/logo(1).png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <span className="project-title font-extrabold text-lg sm:text-2xl tracking-tight">{t('appName', 'SafeApp')}</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotifOpen}
                className="relative h-9 w-9 sm:h-11 sm:w-11 text-white hover:bg-white/10 transition-colors"
                aria-label={t('notifications', 'Notifications')}
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
              <LanguageSwitcher />
              <ThemeButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 sm:h-11 sm:w-11 border-2 border-primary shadow-md p-0 flex items-center justify-center">
                    <HeaderUserAvatar user={user} onAvatarClick={handleAvatarClick} asButton={false} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44 sm:w-56 rounded-xl shadow-lg" align={isRtl ? 'start' : 'end'} forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm sm:text-base">{user?.firstName} {user?.lastName}</p>
                      <p className="w-[120px] sm:w-[200px] truncate text-xs sm:text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation(`/${user?.role}/profile`)} className="rounded-2xl text-sm sm:text-base">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile', 'Profile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/settings')} className="rounded-2xl text-sm sm:text-base">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>{typeof t('settings') === 'string' ? t('settings') : 'Settings'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-2xl text-sm sm:text-base text-red-500">
                    <LogoutIcon className="mr-2 h-4 w-4" />
                    <span>{typeof t('logout') === 'string' ? t('logout') : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-[200px]">{user?.email}</span>
            </div>
          )}
        </header>
        <main className="flex-1 p-2 sm:p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <NotificationDialog
        open={notifOpen}
        onClose={handleNotifClose}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAll}
        loading={notifLoading}
      />
      <ImageModal
        open={imageModalOpen}
        onClose={handleModalClose}
        imageUrl={modalImageUrl}
        alt="Profile Image"
      />
    </div>
  );
};

export default UnifiedLayout; 