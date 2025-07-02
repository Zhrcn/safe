import React from 'react';
import { cn } from '@/lib/utils';
export default function LoadingState({
    message = 'Loading...',
    fullScreen = false,
    className,
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center',
                fullScreen ? 'h-screen' : 'h-64',
                className
            )}
        >
            <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-7 w-7 rounded-full bg-background" />
                </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                {message}
            </p>
        </div>
    );
}
export function LoadingSkeleton({
    rows = 3,
    className,
}) {
    return (
        <div className={cn('space-y-4', className)}>
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    className="h-16 bg-muted/50 rounded-lg animate-pulse"
                />
            ))}
        </div>
    );
}
export function LoadingCard({
    className,
}) {
    return (
        <div
            className={cn(
                'p-6 rounded-lg border border-border/50 bg-card',
                className
            )}
        >
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted/50 animate-pulse" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted/50 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
} 