import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { cn } from '@/lib/utils';

export default function LoadingState({
    message = 'Loading...',
    fullScreen = false,
    className,
}) {
    return (
        <Box
            className={cn(
                'flex flex-col items-center justify-center',
                fullScreen ? 'h-screen' : 'h-64',
                className
            )}
        >
            <CircularProgress
                size={40}
                thickness={4}
                className="text-primary mb-4"
            />
            <Typography
                variant="body1"
                className="text-muted-foreground animate-pulse"
            >
                {message}
            </Typography>
        </Box>
    );
}

export function LoadingSkeleton({
    rows = 3,
    className,
}) {
    return (
        <Box className={cn('space-y-4', className)}>
            {Array.from({ length: rows }).map((_, index) => (
                <Box
                    key={index}
                    className="h-16 bg-muted/50 rounded-lg animate-pulse"
                />
            ))}
        </Box>
    );
}

export function LoadingCard({
    className,
}) {
    return (
        <Box
            className={cn(
                'p-6 rounded-lg border border-border bg-card',
                className
            )}
        >
            <Box className="flex items-center space-x-4">
                <Box className="h-12 w-12 rounded-full bg-muted/50 animate-pulse" />
                <Box className="flex-1 space-y-2">
                    <Box className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                    <Box className="h-3 w-1/2 bg-muted/50 rounded animate-pulse" />
                </Box>
            </Box>
        </Box>
    );
} 