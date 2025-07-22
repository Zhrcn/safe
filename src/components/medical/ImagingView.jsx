import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FaImage, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function ImagingView({ record }) {
  const [showImage, setShowImage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const imageUrl = record.image || record.img || (record.attachments && record.attachments[0]?.url);

  const summaryFields = [
    { label: 'Type', value: record.type || record.modality },
    { label: 'Date', value: record.date || record.createdAt || record.timestamp },
    { label: 'Description', value: record.description || record.notes },
    { label: 'Status', value: record.status },
  ];

  return (
    <Card className="max-w-5xl mx-auto mt-8 shadow-lg border border-muted">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FaImage className="text-primary" />
          <CardTitle>Imaging Result</CardTitle>
        </div>
        {imageUrl && (
          <Button
            onClick={() => setShowImage(v => !v)}
            variant={showImage ? "default" : "outline"}
            size="sm"
            className="ml-2"
          >
            {showImage ? 'Hide Image' : 'Show Image'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {summaryFields.map(
              (field, idx) =>
                field.value && (
                  <Badge key={idx} variant="secondary" className="rounded px-3 py-1 text-xs">
                    <span className="font-semibold">{field.label}:</span> {field.value}
                  </Badge>
                )
            )}
          </div>
          {imageUrl && showImage && (
            <div className="mt-4 flex justify-center">
              <img
                src={imageUrl}
                alt="Imaging Result"
                className="max-h-[36rem] max-w-full rounded-lg shadow-lg border border-muted"
                style={{ objectFit: 'contain', background: '#f8fafc', width: '100%' }}
              />
            </div>
          )}
        </div>
        <div className="mt-2">
          <Button
            onClick={() => setShowDetails(v => !v)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          {showDetails && (
            <pre className="text-xs bg-muted p-4 rounded-2xl overflow-x-auto mt-2 border border-muted-foreground/10">
              {JSON.stringify(record, null, 2)}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}