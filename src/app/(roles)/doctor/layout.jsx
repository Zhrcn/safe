'use client';

import { 
    Home, Calendar, FileText, Users, 
    MessageSquare, Settings, Bell, LogOut, BarChart2, User, Pill 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const sidebarItems = [
    {
        name: 'Dashboard',
        icon: Home,
        link: '/doctor/dashboard'
    },
    {
        name: 'Appointments',
        icon: Calendar,
        link: '/doctor/appointments'
    },
    {
        name: 'Patients',
        icon: Users,
        link: '/doctor/patients'
    },
    {
        name: 'Medicine',
        icon: Pill,
        link: '/doctor/medicine'
    },
    {
        name: 'Analytics',
        icon: BarChart2,
        link: '/doctor/analytics'
    },
    {
        name: 'Messaging',
        icon: MessageSquare,
        link: '/doctor/messaging'
    },
    {
        name: 'Profile',
        icon: User,
        link: '/doctor/profile'
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