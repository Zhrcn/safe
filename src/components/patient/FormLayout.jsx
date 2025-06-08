import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { cn } from '@/lib/utils';

export default function FormLayout({
    title,
    description,
    children,
    actions,
    className,
    maxWidth = 'md',
}) {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
    };

    return (
        <Box
            className={cn(
                'mx-auto w-full',
                maxWidthClasses[maxWidth],
                className
            )}
        >
            <Paper className="p-6 shadow-lg rounded-lg">
                {(title || description) && (
                    <>
                        <Box className="mb-6">
                            {title && (
                                <Typography
                                    variant="h5"
                                    className="font-semibold text-xl mb-2"
                                >
                                    {title}
                                </Typography>
                            )}
                            {description && (
                                <Typography
                                    variant="body1"
                                    className="text-muted-foreground"
                                >
                                    {description}
                                </Typography>
                            )}
                        </Box>
                        <Divider className="mb-6" />
                    </>
                )}

                <Box className="space-y-6">
                    {children}
                </Box>

                {actions && (
                    <>
                        <Divider className="my-6" />
                        <Box className="flex justify-end gap-2">
                            {actions}
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
} 