'use client';

import { 
    Home, Users, Settings, Shield, 
    MessageSquare, Bell, LogOut, FileText 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const sidebarItems = [
    {
        name: 'Dashboard',
        icon: Home,
        link: '/admin'
    },
    {
        name: 'Users',
        icon: Users,
        link: '/admin/users'
    },
    {
        name: 'Roles',
        icon: Shield,
        link: '/admin/roles'
    },
    {
        name: 'Reports',
        icon: FileText,
        link: '/admin/reports'
    },
    {
        name: 'Messages',
        icon: MessageSquare,
        link: '/admin/messages'
    },
    {
        name: 'Settings',
        icon: Settings,
        link: '/admin/settings'
    }
];

export default function AdminLayout({ children }) {
    return (
        <AppLayout
            title="Admin Portal"
            sidebarItems={sidebarItems}
            allowedRoles={['admin']}
        >
            {children}
        </AppLayout>
    );
} 