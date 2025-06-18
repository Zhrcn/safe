'use client';
import { useState, useEffect } from 'react';
import { 
    Menu as MenuIcon, X, Sun, Moon, Bell, LogOut, Settings, User, ChevronRight,
    Home, Calendar, Stethoscope, Users, Pill, FileText, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { APP_NAME } from '@/config/app-config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectCurrentUser } from '@/store/slices/auth/authSlice';
import ProtectedLayout from './ProtectedLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useLogoutMutation } from '@/store/services/user/userApi';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

export default function AppLayout({
    headerBg = 'bg-primary',
    sidebarBg = 'bg-card',
    logoBg = 'bg-muted',
    title = 'S.A.F.E Portal',
    sidebarItems,
    children,
    allowedRoles = [],
    headerRightContent
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
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
            await logout().unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if the API call fails, redirect to login
            router.push('/login');
        }
    };

    const SidebarContent = () => (
        <>
            <div className={`h-16 ${logoBg} flex items-center justify-between px-4 transition-colors duration-300`}>
                <div className="flex items-center">
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                        {APP_NAME}
                    </h1>
                    <span className="ml-2 opacity-75 text-sm">
                        {title.replace('S.A.F.E', '').trim()}
                    </span>
                </div>
                {!isDesktop && (
                    <button 
                        onClick={() => setMobileOpen(false)}
                        className="text-foreground hover:text-foreground/80 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
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
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
                <button 
                    className="flex items-center w-full p-2 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors duration-200"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <ProtectedLayout allowedRoles={allowedRoles}>
            <div className="flex h-screen overflow-hidden">
                {/* Desktop Sidebar */}
                <aside 
                    className={`fixed top-0 left-0 z-40 h-full w-60 transition-all duration-300 ease-in-out ${
                        isDesktop 
                            ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
                            : '-translate-x-full'
                    } ${sidebarBg} backdrop-blur-sm bg-opacity-95 border-r border-border shadow-lg hover:shadow-xl`}
                >
                    <SidebarContent />
                </aside>

                {/* Mobile Menu Overlay */}
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

                {/* Main Content */}
                <main className={`flex-1 w-full h-full overflow-auto transition-all duration-300 ${
                    isDesktop && sidebarOpen ? 'ml-60' : 'ml-0'
                }`}>
                    <header className={`sticky top-0 z-30 ${headerBg} border-b border-border/40 backdrop-blur-sm bg-opacity-95`}>
                        <div className="flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                {!isDesktop && (
                                    <button
                                        onClick={() => setMobileOpen(true)}
                                        className="text-foreground hover:text-foreground/80 transition-colors"
                                    >
                                        <MenuIcon className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                {headerRightContent}
                                <button
                                    onClick={() => setNotificationsMenuOpen(!notificationsMenuOpen)}
                                    className="relative text-foreground hover:text-foreground/80 transition-colors"
                                >
                                    <Bell className="h-6 w-6" />
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error text-error-foreground text-xs flex items-center justify-center">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="relative text-foreground hover:text-foreground/80 transition-colors"
                                >
                                    <User className="h-6 w-6" />
                                </button>
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