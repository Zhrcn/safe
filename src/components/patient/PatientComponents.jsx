import React from 'react';
import { Box, Typography, Paper, InputBase, IconButton, Tooltip, Card, CardContent, CardHeader } from '@mui/material';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Container component for patient pages with consistent styling
 */
export function PatientPageContainer({ title, description, children }) {
    return (
        <Box className="p-6 space-y-6">
            <Box className="space-y-1">
                <Typography variant="h4" className="font-bold tracking-tight text-foreground">
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body1" className="text-muted-foreground">
                        {description}
                    </Typography>
                )}
            </Box>
            {children}
        </Box>
    );
}

/**
 * Card component for patient interface with consistent styling
 */
export function PatientCard({ title, subtitle, actions, children, className = '' }) {
    return (
        <Card
            elevation={0}
            className={`border border-border bg-card text-card-foreground rounded-lg overflow-hidden ${className}`}
        >
            {(title || actions) && (
                <CardHeader
                    title={
                        <Box className="flex items-center justify-between">
                            <Box>
                                <Typography variant="h6" className="font-medium text-foreground">
                                    {title}
                                </Typography>
                                {subtitle && (
                                    <Typography variant="body2" className="text-muted-foreground">
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                            {actions && (
                                <Box className="flex items-center space-x-2">
                                    {actions}
                                </Box>
                            )}
                        </Box>
                    }
                    className="border-b border-border px-6 py-4"
                />
            )}
            <CardContent className={`${title || actions ? 'pt-4' : 'pt-6'} px-6 pb-6`}>
                {children}
            </CardContent>
        </Card>
    );
}

/**
 * Search field component for patient interface
 */
export function SearchField({ value, onChange, placeholder = 'Search...', className = '' }) {
    return (
        <Paper
            component="form"
            elevation={0}
            className={`flex items-center px-3 py-1 border border-border bg-background rounded-md ${className}`}
        >
            <InputBase
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="ml-1 flex-1 text-foreground"
            />
            <IconButton type="button" size="small" className="text-muted-foreground">
                <Search size={18} />
            </IconButton>
        </Paper>
    );
}

/**
 * Dashboard stat card component for patient interface
 */
export function StatCard({ title, value, trend = null, icon, description, className = '' }) {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp size={16} className="text-green-500" />;
        if (trend === 'down') return <TrendingDown size={16} className="text-red-500" />;
        if (trend === 'neutral') return <Minus size={16} className="text-yellow-500" />;
        return null;
    };

    return (
        <Card
            elevation={0}
            className={`border border-border bg-card text-card-foreground rounded-lg ${className}`}
        >
            <CardContent className="p-6">
                <Box className="flex items-center justify-between">
                    <Typography variant="body2" className="font-medium text-muted-foreground">
                        {title}
                    </Typography>
                    {icon && (
                        <Box className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {React.cloneElement(icon, { size: 18, className: 'text-primary' })}
                        </Box>
                    )}
                </Box>
                <Box className="mt-2 flex items-baseline">
                    <Typography variant="h4" className="font-bold text-foreground">
                        {value}
                    </Typography>
                    {trend && (
                        <Box className="ml-2 flex items-center">
                            {getTrendIcon()}
                        </Box>
                    )}
                </Box>
                {description && (
                    <Typography variant="body2" className="mt-1 text-muted-foreground">
                        {description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Chart container component for patient interface
 */
export function ChartContainer({ title, subtitle, children, className = '' }) {
    return (
        <Card
            elevation={0}
            className={`border border-border bg-card text-card-foreground rounded-lg ${className}`}
        >
            {title && (
                <Box className="border-b border-border p-4">
                    <Typography variant="h6" className="font-medium text-foreground">
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" className="text-muted-foreground">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            )}
            <Box className="p-4">
                {children}
            </Box>
        </Card>
    );
}

/**
 * Health indicator component for patient interface
 */
export function HealthIndicator({ value, type, className = '' }) {
    const getStatus = () => {
        switch (type) {
            case 'bloodPressure':
                if (value.systolic < 120 && value.diastolic < 80) return { label: 'Normal', color: 'green' };
                if (value.systolic < 130 && value.diastolic < 85) return { label: 'Elevated', color: 'yellow' };
                return { label: 'High', color: 'red' };
            case 'bloodGlucose':
                if (value < 100) return { label: 'Normal', color: 'green' };
                if (value < 126) return { label: 'Prediabetes', color: 'yellow' };
                return { label: 'Diabetes', color: 'red' };
            case 'heartRate':
                if (value > 60 && value < 100) return { label: 'Normal', color: 'green' };
                if (value <= 60) return { label: 'Low', color: 'yellow' };
                return { label: 'High', color: 'red' };
            default:
                return { label: 'Unknown', color: 'gray' };
        }
    };

    const status = getStatus();
    const colorClasses = {
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    };

    return (
        <Tooltip title={status.label}>
            <Box
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[status.color]} ${className}`}
            >
                {status.label}
            </Box>
        </Tooltip>
    );
}

/**
 * Medication status badge component
 */
export function MedicationStatusBadge({ status }) {
    const getStatusClasses = () => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'refill needed':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'expired':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <Box
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses()}`}
        >
            {status}
        </Box>
    );
}

/**
 * Appointment status badge component
 */
export function AppointmentStatusBadge({ status }) {
    const getStatusClasses = () => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'rescheduled':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <Box
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses()}`}
        >
            {status}
        </Box>
    );
} 