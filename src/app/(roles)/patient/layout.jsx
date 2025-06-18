'use client';
import AppLayout from '@/components/layout/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { 
    Home, Calendar, Users, MessageCircle, FileText, Pill, Stethoscope
} from 'lucide-react';

const patientSidebarItems = [
    {
        path: '/patient/dashboard',
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />
    },
    {
        path: '/patient/appointments',
        label: 'Appointments',
        icon: <Calendar className="h-5 w-5" />
    },
    {
        path: '/patient/consultations',
        label: 'Consultations',
        icon: <Stethoscope className="h-5 w-5" />
    },
    {
        path: '/patient/providers',
        label: 'Providers',
        icon: <Users className="h-5 w-5" />
    },
    {
        path: '/patient/medications',
        label: 'Medications',
        icon: <Pill className="h-5 w-5" />
    },
    {
        path: '/patient/medical-records',
        label: 'Medical Records',
        icon: <FileText className="h-5 w-5" />
    },
    {
        path: '/patient/prescriptions',
        label: 'Prescriptions',
        icon: <FileText className="h-5 w-5" />
    },
    {
        path: '/patient/messaging',
        label: 'Messages',
        icon: <MessageCircle className="h-5 w-5" />
    }
];

export default function Layout({ children }) {
    return (
        <AppLayout
            headerBg="bg-primary"
            sidebarBg="bg-card"
            logoBg="bg-muted"
            title="Patient Portal"
            sidebarItems={patientSidebarItems}
            allowedRoles={['patient']}
            headerRightContent={<ThemeSwitcher />}
        >
            {children}
        </AppLayout>
    );
} 