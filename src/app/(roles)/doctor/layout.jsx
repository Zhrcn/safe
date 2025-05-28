'use client';

import GenericRoleLayout from '@/components/GenericRoleLayout';
import { BarChart, Users, Calendar, MessageSquare, Activity, User } from 'lucide-react';

// Define sidebar items for the doctor role
const sidebarItems = [
  { name: 'Dashboard', icon: BarChart, link: '/doctor/dashboard' },
  { name: 'Patients', icon: Users, link: '/doctor/patients' },
  { name: 'Appointments', icon: Calendar, link: '/doctor/appointments' },
  { name: 'Messaging', icon: MessageSquare, link: '/doctor/messaging' },
  { name: 'Analytics', icon: Activity, link: '/doctor/analytics' },
  { name: 'Profile', icon: User, link: '/doctor/profile' },
];

export default function DoctorLayout({ children }) {
  return (
    <GenericRoleLayout
      headerBg="bg-blue-600 dark:bg-blue-800"
      sidebarBg="bg-background"
      logoBg="bg-blue-500 dark:bg-blue-700"
      title="S.A.F.E Doctor Portal"
      sidebarItems={sidebarItems}
    >
      {children}
    </GenericRoleLayout>
  );
}