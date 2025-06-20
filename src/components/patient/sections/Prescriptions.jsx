import { Button } from '@/components/ui/Button';

// For action buttons (e.g., Download, Request Refill):
<div className="flex gap-2 mt-4">
  <Button
    onClick={handleDownload}
    variant="outline"
    size="sm"
  >
    Download
  </Button>
  <Button
    onClick={handleRequestRefill}
    variant="default"
    size="sm"
  >
    Request Refill
  </Button>
</div> 