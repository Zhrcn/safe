import React from 'react';
import { cn } from '@/utils/styles';
import { CheckCircle2 } from 'lucide-react';
export default function SuccessState({
  title = 'Success',
  message = 'Operation completed successfully.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      <div className="rounded-2xl bg-success/10 p-4 mb-4">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {message}
      </p>
      {action && (
        <div className="flex items-center gap-4">
          {action}
        </div>
      )}
    </div>
  );
}
export function SuccessCard({
  title = 'Success',
  message,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl border border-success/50 bg-success/10',
        className
      )}
    >
      <div className="flex items-start">
        <CheckCircle2
          size={20}
          className="text-success mt-1 mr-3"
        />
        <div className="flex-1">
          <h4 className="font-medium text-success mb-1">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-muted-foreground mb-3">
              {message}
            </p>
          )}
          {action && (
            <div className="flex items-center gap-2">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 