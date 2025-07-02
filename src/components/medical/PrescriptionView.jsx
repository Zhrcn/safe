import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PrescriptionView({ record }) {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-muted p-4 rounded-2xl overflow-x-auto">
          {JSON.stringify(record, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
} 