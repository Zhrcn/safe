import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/styles';

export default function ErrorState({
    title = 'Something went wrong',
    message = 'An error occurred while loading the data. Please try again.',
    onRetry,
    className,
}) {
    return (
        <Box
            className={cn(
                'flex flex-col items-center justify-center p-8 text-center',
                className
            )}
        >
            <AlertCircle
                size={48}
                className="text-destructive mb-4"
            />
            <Typography
                variant="h5"
                className="font-semibold mb-2"
            >
                {title}
            </Typography>
            <Typography
                variant="body1"
                className="text-muted-foreground mb-6 max-w-md"
            >
                {message}
            </Typography>
            {onRetry && (
                <Button
                    variant="outlined"
                    startIcon={<RefreshCw size={16} />}
                    onClick={onRetry}
                    className="border-primary text-primary hover:bg-primary/10"
                >
                    Try Again
                </Button>
            )}
        </Box>
    );
}

export function ErrorCard({
    title = 'Error',
    message,
    onRetry,
    className,
}) {
    return (
        <Box
            className={cn(
                'p-6 rounded-lg border border-destructive/50 bg-destructive/10',
                className
            )}
        >
            <Box className="flex items-start">
                <AlertCircle
                    size={20}
                    className="text-destructive mt-1 mr-3"
                />
                <Box className="flex-1">
                    <Typography
                        variant="subtitle1"
                        className="font-medium text-destructive mb-1"
                    >
                        {title}
                    </Typography>
                    {message && (
                        <Typography
                            variant="body2"
                            className="text-muted-foreground mb-3"
                        >
                            {message}
                        </Typography>
                    )}
                    {onRetry && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshCw size={14} />}
                            onClick={onRetry}
                            className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                            Retry
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
} 