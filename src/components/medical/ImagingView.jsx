import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ImagingView({ record }) {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Imaging Result</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(record, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
} 