'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import ProfileManager from '@/components/doctor/ProfileManager';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <Card className="p-8 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle>{t('doctor.profile.title', 'Doctor Profile')}</CardTitle>
        <CardDescription>{t('doctor.profile.description', 'Manage your personal information, education, and professional achievements.')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileManager />
      </CardContent>
    </Card>
  );
}