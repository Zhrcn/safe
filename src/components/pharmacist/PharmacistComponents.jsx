'use client';

import { Typography, Box, Paper, Card, CardContent, CardHeader, Button, Divider } from '@mui/material';
import { ChevronRight } from 'lucide-react';

/**
 * PharmacistPageContainer - Consistent container for pharmacist pages
 */
export function PharmacistPageContainer({ title, description, children }) {
    return (
        <Box className="p-6">
            <Box className="mb-6">
                <Typography variant="h4" className="font-bold text-foreground">
                    {title}
                </Typography>
                <Typography variant="body1" className="text-muted-foreground">
                    {description}
                </Typography>
            </Box>
            {children}
        </Box>
    );
}

/**
 * PharmacistCard - Consistent card component for pharmacist pages
 */
export function PharmacistCard({ title, children, actions }) {
    return (
        <Paper className="p-6 bg-card border border-border rounded-lg mb-6">
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <Typography variant="h6" className="font-semibold text-foreground mb-2 sm:mb-0">
                    {title}
                </Typography>
                {actions && (
                    <Box className="flex space-x-2">
                        {actions}
                    </Box>
                )}
            </Box>
            <Divider className="mb-4" />
            {children}
        </Paper>
    );
}

/**
 * DashboardCard component
 */
export function DashboardCard({ title, icon: IconComponent, children, actionButton }) {
    return (
        <Card className="shadow-sm border border-border bg-card overflow-hidden">
            <CardHeader
                title={
                    <Box className="flex items-center">
                        {IconComponent && <IconComponent className="mr-2 text-primary" size={24} />}
                        <Typography variant="h6" className="font-semibold text-foreground">
                            {title}
                        </Typography>
                    </Box>
                }
                action={actionButton}
                className="pb-0"
            />
            <CardContent>
                {children}
                {actionButton && (
                    <Box className="mt-4 flex justify-end">
                        <Button
                            variant="text"
                            endIcon={<ChevronRight size={16} />}
                            className="text-primary"
                        >
                            View All
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
} 