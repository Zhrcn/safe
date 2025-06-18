'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import ProfileManager from '@/components/doctor/ProfileManager';
export default function ProfilePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Doctor Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information, education, and professional achievements.
        </p>
      </div>
      <ProfileManager />
    </div>
  );
}