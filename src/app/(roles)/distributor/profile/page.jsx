"use client";

import React, { useEffect, useState } from 'react';
import { getDistributorProfile, updateDistributorProfile } from '@/store/services/distributorApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User } from 'lucide-react';

export default function DistributorProfilePage() {
  const [profile, setProfile] = useState({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getDistributorProfile()
      .then(res => setProfile(res.data.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setProfile(p => ({ ...p, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await updateDistributorProfile(profile);
      setSuccess('Profile updated!');
    } catch {
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl max-w-xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <User className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl font-bold">Distributor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Company Name</label>
                <input type="text" value={profile.companyName} onChange={e => handleChange('companyName', e.target.value)} required className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Name</label>
                <input type="text" value={profile.contactName} onChange={e => handleChange('contactName', e.target.value)} className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Email</label>
                <input type="email" value={profile.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Phone</label>
                <input type="text" value={profile.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input type="text" value={profile.address} onChange={e => handleChange('address', e.target.value)} className="border rounded px-3 py-2 w-full" />
              </div>
              <button type="submit" className="mt-4 px-6 py-2 rounded bg-primary text-white hover:bg-primary/90">Save Profile</button>
              {success && <div className="text-green-600 mt-2">{success}</div>}
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 