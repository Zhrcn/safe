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
import { Avatar, AvatarImage, AvatarFallback, getInitialsFromName, getInitials } from '@/components/ui/Avatar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import { logoutUser } from '@/store/slices/auth/authSlice';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';

export default function PatientLayout({ children }) {
    const pathname = usePathname();
    const user = useSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation('common');

    const sidebarItems = [
        {
            title: t('mainSection', 'Main'),
            items: [
                {
                    name: t('dashboard'),
                    icon: Home,
                    link: '/patient/dashboard',
                    description: t('overviewOfYourHealthStatus', 'Overview of your health status')
                },
                {
                    name: t('appointments', 'Appointments'),
                    icon: Calendar,
                    link: '/patient/appointments',
                    description: t('scheduleAndManageAppointments', 'Schedule and manage appointments')
                },
                {
                    name: t('consultations', 'Consultations'),
                    icon: Stethoscope,
                    link: '/patient/consultations',
                    description: t('virtualConsultationsWithProviders', 'Virtual consultations with providers')
                }
            ]
        },
        {
            title: t('healthcareSection', 'Healthcare'),
            items: [
                {
                    name: t('providers'),
                    icon: Users,
                    link: '/patient/providers',
                    description: t('findAndConnectWithHealthcareProviders', 'Find and connect with healthcare providers'),
                    subItems: [
                        {
                            name: t('doctors', 'Doctors'),
                            link: '/patient/providers/doctors'
                        },
                        {
                            name: t('pharmacists', 'Pharmacists'),
                            link: '/patient/providers/pharmacists'
                        }
                    ]
                },
                {
                    name: t('medications', 'Medications'),
                    icon: Pill,
                    link: '/patient/medications',
                    description: t('trackAndManageYourMedications', 'Track and manage your medications')
                },
                {
                    name: t('medicalRecords', 'Medical Records'),
                    icon: FileText,
                    link: '/patient/medical-records',
                    description: t('accessYourMedicalHistoryAndDocuments', 'Access your medical history and documents')
                },
                {
                    name: t('prescriptions', 'Prescriptions'),
                    icon: FileText,
                    link: '/patient/prescriptions',
                    description: t('viewAndManageYourPrescriptions', 'View and manage your prescriptions')
                }
            ]
        },
        {
            title: t('communicationSection', 'Communication'),
            items: [
                {
                    name: t('messages', 'Messages'),
                    icon: MessageCircle,
                    link: '/patient/messaging',
                    description: t('chatWithYourHealthcareProviders', 'Chat with your healthcare providers'),
                    badge: '3'
                }
            ]
        }
    ];

    const toggleGroup = (title) => {
        setExpandedGroups(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
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

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden lg:flex flex-col w-72 border-r bg-card shadow-lg">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Patient Portal
                    </h2>
                </div>

                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            {user?.profileImage ? (
                                <AvatarImage src={getImageUrl(user?.profileImage)} alt={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'} />
                            ) : (
                                <AvatarFallback className="bg-primary text-primary text-lg">
                                    {getInitials(user?.firstName, user?.lastName)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                            <Bell className="h-4 w-4" />
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-danger text-danger-foreground">
                                3
                            </Badge>
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {sidebarItems.map((group) => (
                            <div key={group.title} className="space-y-2">
                                <Button
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
                                </Button>
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
                                                        <span className="flex items-center gap-2 w-full">
                                                            <Icon className="h-4 w-4" />
                                                            {item.name}
                                                            {item.badge ? (
                                                                <Badge className="ml-auto bg-primary/20 text-primary">{item.badge}</Badge>
                                                            ) : null}
                                                            {item.subItems ? (
                                                                <ChevronRight className="ml-auto h-4 w-4" />
                                                            ) : null}
                                                        </span>
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

                <div className="p-4 border-t space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <a href="/patient/settings">
                            <span className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </span>
                        </a>
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-danger hover:text-danger hover:bg-danger/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 