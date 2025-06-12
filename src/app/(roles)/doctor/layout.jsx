'use client';

import { 
    Home, Calendar, FileText, Users, 
    MessageSquare, Settings, Bell, LogOut 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const sidebarItems = [
    {
        name: 'Dashboard',
        icon: Home,
        link: '/doctor'
    },
    {
        name: 'Appointments',
        icon: Calendar,
        link: '/doctor/appointments'
    },
    {
        name: 'Medical Records',
        icon: FileText,
        link: '/doctor/medical-records'
    },
    {
        name: 'Patients',
        icon: Users,
        link: '/doctor/patients'
    },
    {
        name: 'Messages',
        icon: MessageSquare,
        link: '/doctor/messages'
    },
    {
        name: 'Settings',
        icon: Settings,
        link: '/doctor/settings'
    }
];

export default function DoctorLayout({ children }) {
    return (
        <AppLayout
            title="Doctor Portal"
            sidebarItems={sidebarItems}
            allowedRoles={['doctor']}
        >
            {children}
        </AppLayout>
    );
}