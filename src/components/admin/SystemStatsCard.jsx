import React from 'react';
import { Card } from '@/components/ui/Card';

export function SystemStatsCard({ stats }) {
  if (!stats) return null;
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">System Health</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">Status</h6>
          <p className="text-foreground">
            {stats.systemHealth?.status === 'Healthy' ? (
              <span className="text-green-600">● Healthy</span>
            ) : (
              <span className="text-red-600">● Issues Detected</span>
            )}
          </p>
        </div>
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">Uptime</h6>
          <p className="text-foreground">{stats.systemHealth?.uptime || '-'}</p>
        </div>
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">Appointments</h6>
          <p className="text-foreground">Total: {stats.appointments?.total || 0}</p>
          <p className="text-foreground">Scheduled: {stats.appointments?.scheduled || 0}</p>
        </div>
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">Prescriptions</h6>
          <p className="text-foreground">Total: {stats.prescriptions?.total || 0}</p>
          <p className="text-foreground">Active: {stats.prescriptions?.active || 0}</p>
        </div>
      </div>
    </Card>
  );
} 