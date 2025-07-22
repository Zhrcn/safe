import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function renderLabResults(record) {
  if (!record) {
    return <div className="text-muted-foreground">No lab result data available.</div>;
  }

  const {
    testName,
    result,
    unit,
    referenceRange,
    date,
    notes,
    ...rest
  } = record;

  return (
    <div className="space-y-3">
      {testName && (
        <div>
          <span className="font-medium">Test Name:</span> {testName}
        </div>
      )}
      {result !== undefined && (
        <div>
          <span className="font-medium">Result:</span> {result} {unit}
        </div>
      )}
      {referenceRange && (
        <div>
          <span className="font-medium">Reference Range:</span> {referenceRange}
        </div>
      )}
      {date && (
        <div>
          <span className="font-medium">Date:</span> {new Date(date).toLocaleDateString()}
        </div>
      )}
      {notes && (
        <div>
          <span className="font-medium">Notes:</span> {notes}
        </div>
      )}
      {Object.keys(rest).length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-muted-foreground">Show raw data</summary>
          <pre className="text-xs bg-muted p-2 rounded-lg overflow-x-auto mt-1">
            {JSON.stringify(rest, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default function LabResultView({ record }) {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Lab Result</CardTitle>
      </CardHeader>
      <CardContent>
        {renderLabResults(record)}
      </CardContent>
    </Card>
  );
}