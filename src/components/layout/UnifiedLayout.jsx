import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { logoutUser } from '@/store/slices/auth/authSlice';
import { useNotification } from '@/components/ui/Notification';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
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
  Home, Users, Calendar, FileText, Stethoscope, Pill, MessageSquare, ClipboardList, Package, ShoppingCart, Settings as SettingsIcon, User, BarChart, LogOut as LogoutIcon, Bell, ArrowLeft, ArrowRight, Menu as MenuIcon, X as CloseIcon, X as XIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSocket } from '@/utils/socket';
import { getToken } from '@/utils/tokenUtils';
import { fetchUserProfile, selectUser } from '@/store/slices/user/userSlice';
import { getInitials, getImageUrl } from '@/components/ui/Avatar';
import { addPatientById } from '@/store/slices/doctor/doctorPatientsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import axiosInstance from '@/store/services/axiosInstance';

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
    { name: 'messaging', path: '/pharmacist/messaging', icon: MessageSquare },
    { name: 'profile', path: '/pharmacist/profile', icon: User },
    { name: 'medicine Requests', path: '/pharmacist/medicine', icon: Pill },
  ],
  admin: [
    { name: 'dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'users', path: '/admin/users', icon: Users },
    { name: 'logs', path: '/admin/logs', icon: FileText },
    { name: 'reports', path: '/admin/reports', icon: BarChart },
    { name: 'support', path: '/admin/support', icon: MessageSquare },
    { name: 'settings', path: '/admin/settings', icon: SettingsIcon },
  ],
  distributor: [
    { name: 'dashboard', path: '/distributor/dashboard', icon: Home },
    { name: 'orders', path: '/distributor/orders', icon: ShoppingCart },
    { name: 'accepted orders', path: '/distributor/orders/accepted', icon: Package },
    { name: 'inventory', path: '/distributor/inventory', icon: ClipboardList },
    { name: 'messaging', path: '/distributor/messaging', icon: MessageSquare },
    { name: 'profile', path: '/distributor/profile', icon: User },
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
  const imageUrl = user?.profileImage ? getImageUrl(user.profileImage) + `?t=${Date.now()}` : undefined;
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
            <Avatar className="h-10 w-10 sm:h-14 sm:w-14">
              {user?.profileImage ? (
                <AvatarImage src={imageUrl} alt="Profile Picture" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg sm:text-2xl flex items-center justify-center w-full h-full rounded-full">
                  {getInitials(user?.firstName, user?.lastName) || 'U'}
                </AvatarFallback>
              )}
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
    {items.filter(item => {
      if (!item.path) {
        if (process.env.NODE_ENV !== 'production') {
       
          console.warn('Sidebar navigation item missing path:', item);
        }
        return false;
      }
      return true;
    }).map((item) => {
      const isActive = pathname === item.path;
      return (
        <Link
          key={item.path}
          href={item.path}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 font-medium transition-colors duration-200',
            collapsed ? 'justify-center px-0 w-10 sm:w-12 mx-auto' : 'px-2 sm:px-4',
            pathname === item.path
              ? 'rounded-xl active-sidebar-link'
              : 'rounded-xl hover:bg-muted hover:text-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base'
          )}
          style={
            pathname === item.path
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
  useEffect(() => {
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
  const imageUrl = user?.profileImage ? getImageUrl(user.profileImage) + `?t=${Date.now()}` : undefined;
  if (asButton) {
    return (
      <button
        type="button"
        className="focus:outline-none"
        onClick={() => onAvatarClick && onAvatarClick(imageUrl)}
        title="View profile image"
      >
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          {user?.profileImage ? (
            <AvatarImage src={imageUrl} alt="Profile Picture" />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-base sm:text-lg flex items-center justify-center w-full h-full rounded-full">
              {getInitials(user?.firstName, user?.lastName) || 'U'}
            </AvatarFallback>
          )}
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
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
        {user?.profileImage ? (
          <AvatarImage src={imageUrl} alt="Profile Picture" />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base sm:text-lg flex items-center justify-center w-full h-full rounded-full">
            {getInitials(user?.firstName, user?.lastName) || 'U'}
          </AvatarFallback>
        )}
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

  const user = useSelector(selectUser);
  const isAuthenticated = !!user;
  const token = getToken();

  console.log('[Notifications] User state:', {
    user: user ? { id: user.id, role: user.role, email: user.email } : null,
    isAuthenticated,
    hasToken: !!token
  });

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
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationUpdateTrigger, setNotificationUpdateTrigger] = useState(0);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [activeReferral, setActiveReferral] = useState(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralResult, setReferralResult] = useState(null);

  const patientBrief = activeReferral?.data?.patientBrief;
  useEffect(() => {
    if (referralModalOpen && activeReferral?.data) {
    }
  }, [referralModalOpen, activeReferral]);

  useEffect(() => {
    let isMounted = true;

    const checkBackendHealth = async () => {
      if (!isMounted) return;

      try {
        const { checkBackendHealth: healthCheck } = await import('@/utils/backendHealth');
        const result = await healthCheck();

        if (!isMounted) return;


        if (result.status === 'unhealthy') {
          showNotification(
            t('notification.backendUnavailable', 'Backend service not available. Please check if the server is running.'),
            'error'
          );
        }
      } catch (error) {
        if (!isMounted) return;
      }
    };

    checkBackendHealth();

    return () => {
      isMounted = false;
    };
  }, [showNotification, t]);

  useEffect(() => {
    if (!user || !token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        showNotification(t('notification.tokenExpired', 'Session expired. Please log in again.'), 'error');
        return;
      }
    } catch (error) {
      showNotification(t('notification.invalidToken', 'Invalid session. Please log in again.'), 'error');
      return;
    }

    setNotifLoading(true);
    console.log('[DEBUG] Making notification API call with axiosInstance');
    console.log('[DEBUG] axiosInstance baseURL:', axiosInstance.defaults.baseURL);
    axiosInstance.get('/notifications?limit=20')
      .then(res => {
        const notifs = res.data.data?.notifications || [];
        const formattedNotifications = notifs.map(n => ({
          id: n._id || n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleTimeString(),
          read: n.isRead,
          type: n.type || 'general',
          data: n.data || {},
          priority: n.priority || 'normal'
        }));
        setNotifications(prev => {
          if (prev.length === 0) {
            return formattedNotifications;
          }
          return prev;
        });
        setUnreadCount(notifs.filter(n => !n.isRead).length);
        setNotifLoading(false);
      })
      .catch(err => {
        setNotifLoading(false);

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
  }, [user?.id, token, showNotification, t, dispatch, router]);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('[Notifications] No user or user.id, skipping setup. User:', user);
      return;
    }
    
    const socket = getSocket();
    if (!socket) {
      console.log('[Notifications] Socket not available, retrying in 2 seconds...');
      const timer = setTimeout(() => {
        const retrySocket = getSocket();
        if (retrySocket) {
          console.log('[Notifications] Socket available on retry');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }

    console.log('[Notifications] Setting up real-time notifications for user:', user.id);
    console.log('[Notifications] Socket connected:', socket.connected);
    console.log('[Notifications] Socket ID:', socket.id);

    socket.emit('join', { userId: user.id, role: user.role });
    console.log('[Notifications] Sent join event for user:', user.id, 'role:', user.role);

    const handleNewNotification = (notificationData) => {
      console.log('[Notifications] Real-time notification received:', notificationData);
      console.log('[Notifications] Current notifications before update:', notifications.length);
      console.log('[Notifications] Current unread count before update:', unreadCount);
      
      const notification = {
        id: notificationData.id || `${notificationData.type}-${Date.now()}`,
        title: notificationData.title || 'Notification',
        message: notificationData.message || 'You have a new notification',
        time: new Date(notificationData.timestamp || Date.now()).toLocaleTimeString(),
        read: false,
        type: notificationData.type || 'general',
        data: notificationData.data || {},
        priority: notificationData.priority || 'normal'
      };

      console.log('[Notifications] Created notification object:', notification);

      setNotifications(prev => {
        console.log('[Notifications] Previous notifications count:', prev.length);
        const exists = prev.some(n => n.id === notification.id);
        if (exists) {
          console.log('[Notifications] Duplicate notification ignored:', notification.id);
          return prev;
        }
        console.log('[Notifications] Adding new notification to state:', notification.id);
        const newNotifications = [notification, ...prev];
        console.log('[Notifications] New notifications count:', newNotifications.length);
        return newNotifications;
      });
      
      setUnreadCount(count => {
        const newCount = count + 1;
        console.log('[Notifications] Updated unread count:', newCount);
        return newCount;
      });

      const toastType = notification.priority === 'high' ? 'warning' : 'info';
      showNotification(notification.message, toastType);
      
      setTimeout(() => {
        setNotificationUpdateTrigger(prev => prev + 1);
        console.log('[Notifications] Triggered re-render');
      }, 50);
    };

    socket.on('notification:new', handleNewNotification);

    const handleConnect = () => {
      console.log('[Notifications] Socket connected - notifications active');
      showNotification(t('notification.socketConnected', 'Real-time notifications connected'), 'success');
    };

    const handleDisconnect = (reason) => {
      console.log('[Notifications] Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        showNotification(t('notification.socketDisconnected', 'Connection lost. Trying to reconnect...'), 'warning');
      }
    };

    const handleReconnect = (attemptNumber) => {
      console.log('[Notifications] Socket reconnected after', attemptNumber, 'attempts');
      showNotification(t('notification.socketReconnected', 'Connection restored'), 'success');
    };

    const handleConnectError = (error) => {
      console.error('[Notifications] Socket connection error:', error);
      showNotification(t('notification.socketError', 'Connection error. Notifications may be delayed.'), 'error');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      console.log('[Notifications] Cleaning up socket listeners');
      socket.off('notification:new', handleNewNotification);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [user?.id, user?.role, showNotification, t]);

  useEffect(() => {
    console.log('[Notifications] State changed - notifications count:', notifications.length);
    console.log('[Notifications] State changed - unread count:', unreadCount);
    console.log('[Notifications] State changed - update trigger:', notificationUpdateTrigger);
  }, [notifications, unreadCount, notificationUpdateTrigger]);

  const handleNotifOpen = () => {
    setUnreadCount(0);
    if (!token) {
      return;
    }
    axiosInstance.patch('/notifications/read-all').then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }).catch(err => {
      if (err.response?.status === 401) {
        dispatch(logoutUser());
        router.push('/login');
      }
    });
  };

  const handleDeleteNotification = (id) => {
    if (!token) {
      return;
    }
    axiosInstance.delete(`/notifications/${id}`).then(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }).catch(err => {
      if (err.response?.status === 401) {
        dispatch(logoutUser());
        router.push('/login');
      }
    });
  };

  const handleDeleteAllNotifications = () => {
    if (!token) {
      return;
    }
    axiosInstance.delete('/notifications').then(() => {
      setNotifications([]);
      setUnreadCount(0);
    }).catch(err => {
      if (err.response?.status === 401) {
        dispatch(logoutUser());
        router.push('/login');
      }
    });
  };

    const handleNotificationClick = (notification) => {
    if (!notification.read) {
      if (token) {
        axiosInstance.patch(`/notifications/${notification.id}/read`).then(() => {
          setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
          );
          setUnreadCount(count => Math.max(0, count - 1));
        }).catch(() => {});
      }
    }

    if (notification.type === 'referral' || (notification.title && notification.title.toLowerCase().includes('referral'))) {
      setActiveReferral(notification);
      setReferralModalOpen(true);
    } else if (notification.type === 'appointment') {
      handleNavigation(`/${user?.role}/appointments`);
    } else if (notification.type === 'message') {
      handleNavigation(`/${user?.role}/messaging`);
    } else if (notification.type === 'prescription') {
      handleNavigation(`/${user?.role}/prescriptions`);
    } else if (notification.type === 'consultation') {
      handleNavigation(`/${user?.role}/consultations`);
    }
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

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  if (!ready || !mounted) return null;

  return (
    <div className={cn("flex h-screen bg-background overflow-hidden", isRtl ? 'flex-row-reverse' : 'flex-row')}>
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
            color: 'var(--color-navbar-foreground)',
            [isRtl ? 'right' : 'left']: 0,
            [isRtl ? 'left' : 'right']: 'auto',
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
            ? (sidebarCollapsed ? 'mr-12 sm:mr-16' : 'ml-[60px] sm:ml-[270px]')
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
          <div className={cn("flex items-center gap-2 sm:gap-3 flex-1", isRtl ? 'flex-row-reverse' : '')}>
            <img src="/logo(1).png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <span className="project-title font-extrabold text-lg sm:text-2xl tracking-tight">{t('appName', 'SafeApp')}</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 sm:h-11 sm:w-11 text-white hover:bg-white/10 transition-colors"
                    aria-label={t('notifications', 'Notifications')}
                  >
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                    {unreadCount > 0 && (
                        <span className={cn(
                          'absolute flex items-center justify-center',
                          isRtl ? 'top-1 left-1 right-auto' : 'top-1 right-1 left-auto')
                        }>
                          <span className="flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 bg-red-500 rounded-full border-2 border-white shadow-md text-white text-[10px] sm:text-xs font-bold">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        </span>
                      )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto" onOpenAutoFocus={handleNotifOpen} onOpenChange={open => { if (open) handleNotifOpen(); }}>
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="font-semibold text-base">
                      {t('notifications', 'Notifications')} ({notifications.length})
                    </span>
                    {notifications.length > 0 && (
                      <Button size="xs" variant="ghost" onClick={handleDeleteAllNotifications} className="text-red-500">
                        {t('clearAll', 'Delete All')}
                      </Button>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        {t('noNotifications', 'No notifications at this time')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Debug: {notifications.length} notifications, {unreadCount} unread
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => {
                      const getNotificationIcon = () => {
                        switch (notification.type) {
                          case 'appointment':
                            return <Calendar className="h-4 w-4" />;
                          case 'message':
                            return <MessageSquare className="h-4 w-4" />;
                          case 'prescription':
                            return <Pill className="h-4 w-4" />;
                          case 'consultation':
                            return <Stethoscope className="h-4 w-4" />;
                          case 'referral':
                            return <Users className="h-4 w-4" />;
                          case 'medical_file_update':
                            return <FileText className="h-4 w-4" />;
                          case 'reminder':
                            return <Bell className="h-4 w-4" />;
                          case 'inquiry':
                            return <ClipboardList className="h-4 w-4" />;
                          default:
                            return <Bell className="h-4 w-4" />;
                        }
                      };

                      const getPriorityColor = () => {
                        switch (notification.priority) {
                          case 'high':
                            return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20';
                          case 'normal':
                            return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
                          case 'low':
                            return 'border-l-4 border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
                          default:
                            return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
                        }
                      };

                      return (
                      <DropdownMenuItem
                        key={`${notification.id}-${notificationUpdateTrigger}-${index}`}
                          className={cn(
                            "flex flex-col items-start gap-1 w-full group p-0 transition-all duration-200 hover:bg-muted/50",
                            getPriorityColor()
                          )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center justify-between w-full px-3 py-2">
                            <div className={cn("flex items-center min-w-0 gap-2", isRtl ? 'flex-row-reverse' : '')}>
                            {!notification.read && (
                              <span className={cn("inline-block h-2 w-2 bg-red-500 rounded-full align-middle", isRtl ? 'ml-2 mr-0' : 'mr-2 ml-0')} />
                            )}
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "p-1 rounded-full",
                                  notification.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                  notification.priority === 'normal' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                                )}>
                                  {getNotificationIcon()}
                                </div>
                            <div className="font-medium text-foreground text-sm truncate max-w-[110px]">
                              {notification.title}
                                </div>
                            </div>
                          </div>
                          <span className={cn("text-xs text-muted-foreground whitespace-nowrap", isRtl ? 'mr-2 ml-0' : 'ml-2 mr-0')}>{notification.time}</span>
                          <button
                            className={cn("p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors", isRtl ? 'mr-2 ml-0' : 'ml-2 mr-0')}
                            onClick={e => { e.stopPropagation(); handleDeleteNotification(notification.id); }}
                            aria-label={t('delete', 'Delete')}
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-muted-foreground w-full break-words px-3 pb-2">
                          {notification.message}
                        </div>
                      </DropdownMenuItem>
                      );
                    })
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
      <ImageModal
        open={imageModalOpen}
        onClose={handleModalClose}
        imageUrl={modalImageUrl}
        alt="Profile Image"
      />
      {referralModalOpen && activeReferral && (
        <Dialog open={referralModalOpen} onOpenChange={setReferralModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Referral Request</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <p className="mb-2">Do you want to add this referred patient to your list?</p>
              <div className="text-sm text-muted-foreground mb-2">
                {patientBrief ? (
                  <div className="mb-2">
                    <div><strong>Name:</strong> {patientBrief.name}</div>
                    <div><strong>Age:</strong> {patientBrief.age || 'N/A'}</div>
                    <div><strong>Gender:</strong> {patientBrief.gender || 'N/A'}</div>
                    <div><strong>Medical ID:</strong> {patientBrief.medicalId || 'N/A'}</div>
                    {patientBrief.condition && <div><strong>Condition:</strong> {patientBrief.condition}</div>}
                    {patientBrief.email && <div><strong>Email:</strong> {patientBrief.email}</div>}
                    {patientBrief.phone && <div><strong>Phone:</strong> {patientBrief.phone}</div>}
                  </div>
                ) : (
                  <span className="text-red-600">Patient not found.</span>
                )}
                {activeReferral.data?.fromDoctorName && (
                  <div className="mb-2"><strong>Referred by:</strong> {activeReferral.data.fromDoctorName}</div>
                )}
                {activeReferral.data?.reason && (
                  <div><strong>Reason:</strong> {activeReferral.data.reason}</div>
                )}
                {activeReferral.data?.urgency && (
                  <div><strong>Urgency:</strong> {activeReferral.data.urgency}</div>
                )}
                {activeReferral.data?.notes && (
                  <div><strong>Notes:</strong> {activeReferral.data.notes}</div>
                )}
                <strong>Message:</strong> {activeReferral.message}
              </div>
              {referralResult && (
                <div className={referralResult.success ? 'text-green-600' : 'text-red-600'}>
                  {referralResult.message}
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="default"
                disabled={referralLoading}
                onClick={async () => {
                  setReferralLoading(true);
                  setReferralResult(null);
                  try {
                    const resultAction = await dispatch(addPatientById(activeReferral.data?.patientId));
                    if (addPatientById.fulfilled.match(resultAction)) {
                      setReferralResult({ success: true, message: 'Patient added successfully!' });
                      setTimeout(() => setReferralModalOpen(false), 1200);
                    } else {
                      setReferralResult({ success: false, message: resultAction.payload || 'Failed to add patient.' });
                    }
                  } catch (err) {
                    setReferralResult({ success: false, message: 'An error occurred.' });
                  } finally {
                    setReferralLoading(false);
                  }
                }}
              >
                {referralLoading ? 'Adding...' : 'Accept'}
              </Button>
              <Button variant="outline" onClick={() => setReferralModalOpen(false)} disabled={referralLoading}>
                Reject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UnifiedLayout; 