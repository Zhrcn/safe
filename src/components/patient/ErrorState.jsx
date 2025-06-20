import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorState({
    title = 'Error',
    message = 'Something went wrong. Please try again later.',
    retry,
    className,
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center p-8 text-center',
                className
            )}
        >
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {message}
            </p>
            {retry && (
                <Button
                    onClick={retry}
                    variant="default"
                    size="default"
                    className="mt-2"
                >
                    Try Again
                </Button>
            )}
        </div>
    );
}

export function ErrorBoundaryFallback({
    error,
    resetErrorBoundary,
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {error?.message || 'An unexpected error occurred.'}
            </p>
            {resetErrorBoundary && (
                <Button
                    onClick={resetErrorBoundary}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                    Try Again
                </Button>
            )}
        </div>
    );
} 