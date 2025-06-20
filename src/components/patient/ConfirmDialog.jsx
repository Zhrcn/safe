import React from 'react';
import { cn } from '@/utils/styles';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ConfirmDialog({
  open,
  onClose,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
  className,
}) {
  if (!open) return null;
  const variantStyles = {
    default: 'bg-background',
    destructive: 'bg-destructive text-destructive-foreground',
    warning: 'bg-warning text-warning-foreground',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-warning/10 p-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {message}
            </p>
            <div className="flex gap-2 mt-6 justify-end">
              <Button
                onClick={onClose}
                variant="outline"
                size="default"
              >
                {cancelLabel}
              </Button>
              <Button
                onClick={onConfirm}
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                size="default"
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 