'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { 
    Home, Calendar, Stethoscope, Users, Pill, FileText, MessageCircle,
    ClipboardList, Settings, UserCircle
} from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const doctorSidebarItems = [
    {
        path: '/doctor/dashboard',
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />
    },
    {
        path: '/doctor/appointments',
        label: 'Appointments',
        icon: <Calendar className="h-5 w-5" />
    },
    {
        path: '/doctor/consultations',
        label: 'Consultations',
        icon: <Stethoscope className="h-5 w-5" />
    },
    {
        path: '/doctor/patients',
        label: 'Patients',
        icon: <Users className="h-5 w-5" />
    },
    {
        path: '/doctor/prescriptions',
        label: 'Prescriptions',
        icon: <Pill className="h-5 w-5" />
    },
    {
        path: '/doctor/medical-records',
        label: 'Medical Records',
        icon: <FileText className="h-5 w-5" />
    },
    {
        path: '/doctor/messaging',
        label: 'Messages',
        icon: <MessageCircle className="h-5 w-5" />
    },
    {
        path: '/doctor/tasks',
        label: 'Tasks',
        icon: <ClipboardList className="h-5 w-5" />
    }
];

export default function DoctorLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <AppLayout
            headerBg="bg-primary"
            sidebarBg="bg-card"
            logoBg="bg-muted"
            title="Doctor Portal"
            sidebarItems={doctorSidebarItems}
            allowedRoles={['doctor']}
            headerRightContent={<ThemeSwitcher />}
        >
            {children}
        </AppLayout>
    );
}