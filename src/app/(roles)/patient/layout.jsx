'use client';

import { 
    Home, Calendar, Users, MessageSquare, 
    FileText, Pill, User, Stethoscope,
    MessageCircle
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const sidebarItems = [
    {
        name: 'Dashboard',
        icon: Home,
        link: '/patient/dashboard'
    },
    {
        name: 'Appointments',
        icon: Calendar,
        link: '/patient/appointments'
    },
    {
        name: 'Providers',
        icon: Users,
        link: '/patient/providers',
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
        name: 'Consultations',
        icon: Stethoscope,
        link: '/patient/consultations'
    },
    {
        name: 'Medications',
        icon: Pill,
        link: '/patient/medications'
    },
    {
        name: 'Medical Records',
        icon: FileText,
        link: '/patient/medical-records'
    },
    {
        name: 'Messages',
        icon: MessageCircle,
        link: '/patient/messaging'
    },
    {
        name: 'Prescriptions',
        icon: FileText,
        link: '/patient/prescriptions'
    },
    {
        name: 'Profile',
        icon: User,
        link: '/patient/profile'
    }
];

export default function PatientLayout({ children }) {
    return (
        <AppLayout
            title="Patient Portal"
            sidebarItems={sidebarItems}
            allowedRoles={['patient']}
        >
            {children}
        </AppLayout>
    );
} 