'use client';

import GenericRoleLayout from '@/components/GenericRoleLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

const sidebarItems = [
    { name: 'Dashboard', icon: DashboardIcon, link: '/patient/dashboard' },
    { name: 'Profile', icon: PersonIcon, link: '/patient/profile' },
    { name: 'Messaging', icon: MessageIcon, link: '/patient/messaging' },
    { name: 'Providers', icon: SearchIcon, link: '/patient/providers' },
    { name: 'Medications', icon: MedicalServicesIcon, link: '/patient/medications' },
    { name: 'Medical File', icon: FolderSharedIcon, link: '/patient/medical-file' },
    { name: 'Prescriptions', icon: LocalPharmacyIcon, link: '/patient/prescriptions' },
];

export default function PatientLayout({ children }) {
    return (
        <GenericRoleLayout
            headerBg="bg-primary"
            sidebarBg="bg-background"
            logoBg="bg-primary"
            title="S.A.F.E Patient Portal"
            sidebarItems={sidebarItems}
        >
            {children}
        </GenericRoleLayout>
    );
} 