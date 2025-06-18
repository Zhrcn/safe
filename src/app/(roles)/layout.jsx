'use client';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function RolesLayout({ children }) {
    return (
        <ProtectedLayout>
            <div className="min-h-screen">
                {children}
            </div>
        </ProtectedLayout>
    );
}