'use client';
import { useState } from 'react';
import { DoctorPageContainer } from '@/components/doctor/DoctorComponents';
import PatientAnalytics from '@/components/doctor/PatientAnalytics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default function AnalyticsPage() {
  return (
    <Card className="rounded-xl shadow-lg p-8">
      <CardHeader>
        <CardTitle>Patient Analytics</CardTitle>
        <CardDescription>View analytics and statistics about your patients, appointments, and prescriptions.</CardDescription>
      </CardHeader>
      <CardContent>
        <PatientAnalytics />
      </CardContent>
    </Card>
  );
}