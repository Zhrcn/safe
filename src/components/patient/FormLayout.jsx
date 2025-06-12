import React, { forwardRef } from 'react';
import { Box, Paper, Typography, Divider, Grid } from '@mui/material';
import { cn } from '@/utils/styles';

export default forwardRef(function FormLayout({
    title,
    description,
    children,
    actions,
    className,
    maxWidth = 'lg',
}, ref) {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        none: '', // No max-width restriction
        full: 'max-w-full', // Full width
    };

    return (
        <Box sx={{ width: '100%', maxWidth: maxWidth, mx: 'auto', px: 2 }} ref={ref}>
            <Grid container spacing={3}>
                <Grid xs={12}>
                    <Paper className="px-2 py-4 shadow-lg rounded-lg">
                        {(title || description) && (
                            <>
                                <Box className="mb-4">
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
                                <Divider className="mb-4" />
                            </>
                        )}

                        <Box className="space-y-2">
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
                </Grid>
            </Grid>
        </Box>
    );
}) 