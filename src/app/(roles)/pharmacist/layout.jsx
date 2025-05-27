'use client';

import GenericRoleLayout from '@/components/GenericRoleLayout';
import { Package, FileText, ShoppingCart, BarChart, User } from 'lucide-react';

// Define sidebar items for the pharmacist role
const sidebarItems = [
    { name: 'Dashboard', icon: BarChart, link: '/pharmacist/dashboard' },
    { name: 'Inventory', icon: Package, link: '/pharmacist/inventory' },
    { name: 'Prescriptions', icon: FileText, link: '/pharmacist/prescriptions' },
    { name: 'Orders', icon: ShoppingCart, link: '/pharmacist/orders' },
    { name: 'Profile', icon: User, link: '/pharmacist/profile' },
];

export default function PharmacistLayout({ children }) {
    return (
        <GenericRoleLayout
            headerBg="bg-green-600 dark:bg-green-800"
            sidebarBg="bg-background"
            logoBg="bg-green-500 dark:bg-green-700"
            title="S.A.F.E Pharmacy"
            sidebarItems={sidebarItems}
        >
            {children}
        </GenericRoleLayout>
    );
} 