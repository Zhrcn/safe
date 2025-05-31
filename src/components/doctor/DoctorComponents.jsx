'use client';

import { Typography, Box, Paper, Card, CardContent, TextField } from '@mui/material';

/**
 * DoctorPageContainer - Consistent container for doctor pages
 */
export function DoctorPageContainer({ title, description, children }) {
    return (
        <Box>
            <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md min-h-[80vh]">
                <Typography variant="h4" gutterBottom className="text-foreground font-bold">
                    {title}
                </Typography>
                <Typography paragraph className="text-muted-foreground mb-6">
                    {description}
                </Typography>
                {children}
            </Paper>
        </Box>
    );
}

/**
 * DoctorCard - Consistent card component for doctor pages
 */
export function DoctorCard({ title, children, actions }) {
    return (
        <Card className="shadow-lg rounded-lg border border-border bg-card">
            <CardContent>
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
                    <Typography variant="h5" component="h1" className="font-bold text-foreground">{title}</Typography>
                    {actions && (
                        <Box className="flex items-center space-x-4 w-full sm:w-auto">
                            {actions}
                        </Box>
                    )}
                </Box>
                {children}
            </CardContent>
        </Card>
    );
}

/**
 * DashboardCard - Card component for dashboard sections
 */
export function DashboardCard({ title, icon: IconComponent, children, actionButton }) {
    return (
        <Card className="h-full shadow-lg rounded-lg border border-border bg-card text-card-foreground transition-colors duration-200 hover:shadow-xl">
            <CardContent>
                <Box className="flex justify-between items-center mb-4">
                    <Box className="flex items-center">
                        <Box className="p-3 rounded-full bg-green-100 dark:bg-green-700 mr-4">
                            <IconComponent size={28} className="text-green-600 dark:text-green-200" />
                        </Box>
                        <Typography variant="h6" component="div" className="font-semibold text-foreground">
                            {title}
                        </Typography>
                    </Box>
                    {actionButton}
                </Box>
                <Box className="text-muted-foreground">
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * ChartContainer - Container for charts
 */
export function ChartContainer({ title, children, height = 300 }) {
    return (
        <Box className="bg-card border border-border rounded-lg p-4">
            <Typography variant="h6" className="mb-4 font-semibold text-foreground">
                {title}
            </Typography>
            <Box style={{ height }} className="w-full">
                {children}
            </Box>
        </Box>
    );
}

/**
 * StatCard - Statistics card for dashboards
 */
export function StatCard({ title, value, icon: IconComponent, trend, trendValue }) {
    return (
        <Card className="border border-border bg-card shadow-sm">
            <CardContent>
                <Box className="flex items-center justify-between">
                    <Box>
                        <Typography className="text-muted-foreground font-medium" variant="body2">
                            {title}
                        </Typography>
                        <Typography className="text-2xl font-bold text-foreground mt-1">
                            {value}
                        </Typography>
                        {trend && (
                            <Box className="flex items-center mt-1">
                                <Box
                                    component="span"
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                        trend === 'up'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}
                                >
                                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <Box
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            trend === 'up'
                                ? 'bg-green-100 dark:bg-green-900'
                                : trend === 'down'
                                ? 'bg-red-100 dark:bg-red-900'
                                : 'bg-blue-100 dark:bg-blue-900'
                        }`}
                    >
                        <IconComponent
                            size={24}
                            className={
                                trend === 'up'
                                    ? 'text-green-600 dark:text-green-300'
                                    : trend === 'down'
                                    ? 'text-red-600 dark:text-red-300'
                                    : 'text-blue-600 dark:text-blue-300'
                            }
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
} 