'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const mockReports = [
  { id: 1, name: 'User Activity Report', description: 'Summary of user logins and actions', available: true },
  { id: 2, name: 'System Usage Report', description: 'System usage and uptime statistics', available: true },
  { id: 3, name: 'Compliance Report', description: 'Compliance and audit trail', available: false },
];

export default function AdminReportsPage() {
  const [reports] = useState(mockReports);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Reports & Analytics</h3>
      <ul className="space-y-4">
        {reports.map(report => (
          <li key={report.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-2xl border bg-muted">
            <div>
              <div className="font-semibold text-foreground">{report.name}</div>
              <div className="text-muted-foreground text-sm mb-1">{report.description}</div>
            </div>
            <Button disabled={!report.available} className="mt-2 md:mt-0">
              {report.available ? 'Download' : 'Coming Soon'}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
} 