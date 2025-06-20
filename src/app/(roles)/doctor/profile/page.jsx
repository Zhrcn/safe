'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import ProfileManager from '@/components/doctor/ProfileManager';
export default function ProfilePage() {
  return (
    <Card className="p-8 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle>Doctor Profile</CardTitle>
        <CardDescription>Manage your personal information, education, and professional achievements.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileManager />
      </CardContent>
    </Card>
  );
}