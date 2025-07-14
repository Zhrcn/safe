'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import ProfileManager from '@/components/doctor/ProfileManager';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('doctor.profile.title', 'Doctor Profile')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('doctor.profile.description', 'Manage your professional profile, credentials, and personal information to provide the best care for your patients.')}
          </p>
        </div>

        {/* Main Profile Section Only */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Professional Profile</h2>
                  <p className="text-blue-100">Complete your profile to enhance patient trust</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-blue-100">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Verified Professional</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ProfileManager />
          </div>
        </div>
      </div>
    </div>
  );
}