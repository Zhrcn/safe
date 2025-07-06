'use client';
import { useState, useEffect } from 'react';
import { 
    Menu as MenuIcon, X, Sun, Moon, Bell, LogOut, Settings, User, ChevronRight,
    Home, Calendar, Stethoscope, Users, Pill, FileText, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { APP_NAME } from '@/config/app-config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser, selectCurrentUser } from '@/store/slices/auth/authSlice';
import ProtectedLayout from '.';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useLogoutMutation } from '@/store/services/user/authApi';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import LanguageSwitcher from '../LanguageSwitcher';

const drawerWidth = 240;

const getSidebarItems = (role) => {
    const roleLower = role?.toLowerCase() || 'patient';
    const prefix = `/${roleLower}`;

    const roleItems = {
        pharmacist: [
            {
                path: `${prefix}/dashboard`,
                label: 'Dashboard',
                icon: <Home className="h-5 w-5" />
            },
            {
                path: `${prefix}/prescriptions`,
                label: 'Prescriptions',
                icon: <Pill className="h-5 w-5" />
            },
            {
                path: `${prefix}/inventory`,
                label: 'Inventory',
                icon: <FileText className="h-5 w-5" />
            }
        ],
        doctor: [
            {
                path: `${prefix}/dashboard`,
                label: 'Dashboard',
                icon: <Home className="h-5 w-5" />
            },
            {
                path: `${prefix}/patients`,
                label: 'Patients',
                icon: <Users className="h-5 w-5" />
            },
            {
                path: `${prefix}/appointments`,
                label: 'Appointments',
                icon: <Calendar className="h-5 w-5" />
            },
            {
                path: `${prefix}/prescriptions`,
                label: 'Prescriptions',
                icon: <Pill className="h-5 w-5" />
            }
        ],
        patient: [
            {
                path: `${prefix}/dashboard`,
                label: 'Dashboard',
                icon: <Home className="h-5 w-5" />
            },
            {
                path: `${prefix}/appointments`,
                label: 'Appointments',
                icon: <Calendar className="h-5 w-5" />
            },
            {
                path: `${prefix}/prescriptions`,
                label: 'Prescriptions',
                icon: <Pill className="h-5 w-5" />
            },
            {
                path: `${prefix}/records`,
                label: 'Medical Records',
                icon: <FileText className="h-5 w-5" />
            }
        ],
        admin: [
            {
                path: `${prefix}/dashboard`,
                label: 'Dashboard',
                icon: <Home className="h-5 w-5" />
            },
            {
                path: `${prefix}/users`,
                label: 'Users',
                icon: <Users className="h-5 w-5" />
            },
            {
                path: `${prefix}/settings`,
                label: 'Settings',
                icon: <Settings className="h-5 w-5" />
            }
        ]
    };

    return roleItems[roleLower] || roleItems.patient;
};

const fallbackUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  profile: { avatar: "/avatars/default-avatar.svg" }
};

export default function AppLayout({
    headerBg = 'bg-primary',
    sidebarBg = 'bg-card',
    logoBg = 'bg-muted',
    title = 'S.A.F.E Portal',
    sidebarItems,
    children,
    allowedRoles = []
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const userRaw = useAppSelector(selectCurrentUser);
    const user = userRaw && userRaw.email ? userRaw : fallbackUser;
    const [logout] = useLogoutMutation();
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New appointment', message: 'You have a new appointment scheduled', read: false },
        { id: 2, title: 'Prescription ready', message: 'Your prescription is ready for pickup', read: true },
        { id: 3, title: 'Test results', message: 'Your test results are available', read: false }
    ]);

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    const defaultSidebarItems = getSidebarItems(user?.role);
    const finalSidebarItems = sidebarItems || defaultSidebarItems;

    useEffect(() => {
        if (!isDesktop) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    }, [isDesktop]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            router.push('/login');
        }
    };

    const SidebarContent = () => (
        <>
            <div className={`h-20 flex flex-col items-center justify-center gap-2 ${logoBg} px-4 transition-colors duration-300 border-b border-border`}>
                <Image src="/avatars/icon.svg" alt="App Icon" width={48} height={48} className="mb-1" />
                <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-1">
                    {APP_NAME}
                </h1>
                <span className="opacity-75 text-xs mb-2">{title.replace('S.A.F.E', '').trim()}</span>
                {user && (
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="rounded-full overflow-hidden border border-border mb-1">
                      <img src={user?.profile?.avatar || "/avatars/default-avatar.svg"} alt="User Avatar" className="h-10 w-10 object-cover" />
                    </div>
                    <div className="font-bold text-base text-center text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-400 text-center break-all">{user?.email}</div>
                  </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                    {finalSidebarItems.map((item) => {
                        if (!item.path) {
                            console.warn('Sidebar item missing path:', item);
                            return null;
                        }
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-2xl transition-colors ${
                                    pathname === item.path
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted/40'
                                }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 mt-auto">
                <div className="h-px bg-border mb-4" />
                <Button onClick={handleLogout} variant="ghost" className="flex items-center w-full p-2 rounded-2xl hover:bg-muted/40 cursor-pointer transition-colors duration-200">
                    <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Logout</span>
                </Button>
            </div>
        </>
    );

    return (
        <ProtectedLayout allowedRoles={allowedRoles}>
            <div className="flex h-screen overflow-hidden">
                <aside 
                    className={`fixed top-0 left-0 z-40 h-full w-60 transition-all duration-300 ease-in-out ${
                        isDesktop 
                            ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
                            : '-translate-x-full'
                    } ${sidebarBg} backdrop-blur-sm bg-opacity-95 border-r border-border shadow-lg hover:shadow-xl`}
                >
                    <SidebarContent />
                </aside>

                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div 
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="fixed inset-y-0 left-0 w-60 bg-card border-r border-border">
                            <SidebarContent />
                        </div>
                    </div>
                )}

                <main className={`flex-1 w-full h-full overflow-auto transition-all duration-300 ${
                    isDesktop && sidebarOpen ? 'ml-60' : 'ml-0'
                }`}>
                    <header className={`sticky top-0 z-30 ${headerBg} border-b border-border/40 backdrop-blur-sm bg-opacity-95`}>
                        <div className="flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                {!isDesktop && (
                                    <Button onClick={() => setMobileOpen(true)} variant="ghost" size="icon" className="text-foreground hover:text-foreground/80 transition-colors">
                                        <MenuIcon className="w-6 h-6" />
                                    </Button>
                                )}
                                {isDesktop && (
                                    <Button onClick={() => setSidebarOpen(!sidebarOpen)} variant="ghost" size="icon" className="text-foreground hover:text-foreground/80 transition-colors">
                                        <MenuIcon className="w-6 h-6" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <ThemeSwitcher />
                                <LanguageSwitcher />
                                <div className="relative">
                                    <Button onClick={() => setNotificationsMenuOpen(!notificationsMenuOpen)} variant="ghost" size="icon" className="relative p-2 text-foreground hover:text-foreground/80 transition-colors">
                                        <Bell className="w-5 h-5" />
                                        {unreadNotificationsCount > 0 && (
                                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                                {unreadNotificationsCount}
                                            </span>
                                        )}
                                    </Button>
                                    {notificationsMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-lg">
                                            <div className="p-2">
                                                <h3 className="px-2 py-1.5 text-sm font-semibold">Notifications</h3>
                                                <div className="mt-1 max-h-96 overflow-y-auto">
                                                    {notifications.map((notification) => (
                                                        <Button
                                                            key={notification.id}
                                                            className={`w-full px-2 py-1.5 text-left text-sm hover:bg-muted/40 transition-colors ${
                                                                !notification.read ? 'font-medium' : ''
                                                            }`}
                                                            onClick={() => {
                                                                setNotifications(notifications.map(n =>
                                                                    n.id === notification.id ? { ...n, read: true } : n
                                                                ));
                                                            }}
                                                        >
                                                            <div className="font-medium">{notification.title}</div>
                                                            <div className="text-muted-foreground">{notification.message}</div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <Button onClick={() => setProfileMenuOpen(!profileMenuOpen)} variant="ghost" className="flex items-center gap-2 p-2 text-foreground hover:text-foreground/80 transition-colors">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {user?.firstName?.[0] || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium hidden md:inline-block">
                                            {user?.firstName || 'User'}
                                        </span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${
                                            profileMenuOpen ? 'rotate-90' : ''
                                        }`} />
                                    </Button>
                                    {profileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card shadow-lg">
                                            <div className="p-1">
                                                <Button
                                                    onClick={() => {
                                                        router.push('/profile');
                                                        setProfileMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm rounded-2xl hover:bg-muted/40 transition-colors"
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    Profile
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        router.push('/settings');
                                                        setProfileMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm rounded-2xl hover:bg-muted/40 transition-colors"
                                                >
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Settings
                                                </Button>
                                                <div className="h-px bg-border my-1" />
                                                <Button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center px-3 py-2 text-sm rounded-2xl hover:bg-muted/40 transition-colors text-destructive"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedLayout>
    );
} 