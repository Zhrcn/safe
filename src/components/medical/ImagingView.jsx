import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ImagingView({ record }) {
  const [showImage, setShowImage] = useState(false);
  // Assume the image URL is in record.image or record.img or record.attachment(s)
  // Adjust as needed based on your data structure
  const imageUrl = record.image || record.img || (record.attachments && record.attachments[0]?.url);

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Imaging Result</CardTitle>
      </CardHeader>
      <CardContent>
        {imageUrl && (
          <div className="mb-4">
            <Button onClick={() => setShowImage(v => !v)} variant="outline" size="sm">
              {showImage ? 'Hide Image' : 'Show Image'}
            </Button>
            {showImage && (
              <div className="mt-4 flex justify-center">
                <img src={imageUrl} alt="Imaging Result" className="max-h-96 rounded shadow" />
              </div>
            )}
          </div>
        )}
        <pre className="text-sm bg-muted p-4 rounded-2xl overflow-x-auto">
          {JSON.stringify(record, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
} 