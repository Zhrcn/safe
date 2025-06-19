'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Home, Calendar, Users, MessageSquare, 
    FileText, Pill, User, Stethoscope,
    MessageCircle, ChevronRight, LogOut,
    Settings, Bell, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import { useLogoutMutation } from '@/store/services/user/userApi';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { Badge } from '@/components/ui/Badge';

const sidebarItems = [
    {
        title: 'Main',
        items: [
            {
                name: 'Dashboard',
                icon: Home,
                link: '/patient/dashboard',
                description: 'Overview of your health status'
            },
            {
                name: 'Appointments',
                icon: Calendar,
                link: '/patient/appointments',
                description: 'Schedule and manage appointments'
            },
            {
                name: 'Consultations',
                icon: Stethoscope,
                link: '/patient/consultations',
                description: 'Virtual consultations with providers'
            }
        ]
    },
    {
        title: 'Healthcare',
        items: [
            {
                name: 'Providers',
                icon: Users,
                link: '/patient/providers',
                description: 'Find and connect with healthcare providers',
                subItems: [
                    {
                        name: 'Doctors',
                        link: '/patient/providers/doctors'
                    },
                    {
                        name: 'Pharmacists',
                        link: '/patient/providers/pharmacists'
                    }
                ]
            },
            {
                name: 'Medications',
                icon: Pill,
                link: '/patient/medications',
                description: 'Track and manage your medications'
            },
            {
                name: 'Medical Records',
                icon: FileText,
                link: '/patient/medical-records',
                description: 'Access your medical history and documents'
            },
            {
                name: 'Prescriptions',
                icon: FileText,
                link: '/patient/prescriptions',
                description: 'View and manage your prescriptions'
            }
        ]
    },
    {
        title: 'Communication',
        items: [
            {
                name: 'Messages',
                icon: MessageCircle,
                link: '/patient/messaging',
                description: 'Chat with your healthcare providers',
                badge: '3' // Example notification count
            }
        ]
    }
];

export default function PatientLayout({ children }) {
    const pathname = usePathname();
    const user = useSelector(selectCurrentUser);
    const [logout] = useLogoutMutation();
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState(
        sidebarItems.map(group => group.title)
    );
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleGroup = (title) => {
        setExpandedGroups(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

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

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 border-r bg-card shadow-lg">
                {/* Logo and Title */}
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Patient Portal
                    </h2>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user?.profile?.avatar} />
                            <AvatarFallback className="bg-primary text-primary text-lg">
                                {user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                            <Bell className="h-4 w-4" />
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-destructive-foreground">
                                3
                            </Badge>
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {sidebarItems.map((group) => (
                            <div key={group.title} className="space-y-2">
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {group.title}
                                    <ChevronRight 
                                        className={cn(
                                            "h-4 w-4 transition-transform",
                                            expandedGroups.includes(group.title) && "rotate-90"
                                        )} 
                                    />
                                </button>
                                {expandedGroups.includes(group.title) && (
                                    <div className="space-y-1 pl-2">
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.link;
                                            const Icon = item.icon;
                                            
                                            return (
                                                <Button
                                                    key={item.name}
                                                    variant={isActive ? "secondary" : "ghost"}
                                                    className={cn(
                                                        "w-full justify-start gap-2 group relative",
                                                        isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                                                    )}
                                                    asChild
                                                >
                                                    <a href={item.link}>
                                                        <Icon className="h-4 w-4" />
                                                        <span>{item.name}</span>
                                                        {item.badge && (
                                                            <Badge className="ml-auto bg-primary/20 text-primary">
                                                                {item.badge}
                                                            </Badge>
                                                        )}
                                                        {item.subItems && (
                                                            <ChevronRight className="ml-auto h-4 w-4" />
                                                        )}
                                                    </a>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Bottom Actions */}
                <div className="p-4 border-t space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <a href="/patient/settings">
                            <Settings className="h-4 w-4" />
                            Settings
                        </a>
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 