'use client';

import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function RolesLayout({ children }) {
    return (
        <ProtectedLayout>
            {children}
        </ProtectedLayout>
    );
}