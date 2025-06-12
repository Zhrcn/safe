'use client';

import React from 'react';
import { Box, Typography, Paper, InputBase, IconButton, Tooltip, Card, CardContent, CardHeader, Chip } from '@mui/material';
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Clock, MapPin } from 'lucide-react';

const DEFAULT_AVATAR_PATH = '/avatars/default-avatar.svg';

/**
 * Container component for patient pages with consistent styling
 */
export function PatientPageContainer({ children }) {
    return (
        <Box className="container mx-auto px-4 py-2">
            {children}
        </Box>
    );
}

/**
 * Card component for patient interface with consistent styling
 */
export function PatientCard({ title, subtitle, status, date, time, location, actions }) {
    return (
        <Paper className="p-6 hover:shadow-lg transition-shadow">
            <Box className="flex justify-between items-start mb-4">
                <Box>
                    <Typography variant="h6" className="font-semibold mb-1">
                        {title}
                    </Typography>
                    <Typography color="text.secondary" className="mb-2">
                        {subtitle}
                    </Typography>
                </Box>
                {status}
            </Box>

            <Box className="space-y-3">
                {date && (
                    <Box className="flex items-center text-gray-600">
                        <Calendar size={18} className="mr-2" />
                        <Typography variant="body2">{date}</Typography>
                    </Box>
                )}

                {time && (
                    <Box className="flex items-center text-gray-600">
                        <Clock size={18} className="mr-2" />
                        <Typography variant="body2">{time}</Typography>
                    </Box>
                )}

                {location && (
                    <Box className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-2" />
                        <Typography variant="body2">{location}</Typography>
                    </Box>
                )}
            </Box>

            {actions && (
                <Box className="mt-4 pt-4 border-t">
                    {actions}
                </Box>
            )}
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
        <Card className={`border border-border bg-card shadow-sm ${className}`}>
            <CardContent>
                <Box className="flex justify-between items-start">
                    <Box>
                        <Typography variant="body2" className="text-muted-foreground">
                            {title}
                        </Typography>
                        <Typography variant="h5" className="font-bold mt-1 text-foreground">
                            {value}
                        </Typography>
                        {trend && (
                            <Box className="flex items-center mt-1">
                                {getTrendIcon()}
                                <Typography
                                    variant="body2"
                                    className={`ml-1 ${
                                        trend === 'up'
                                            ? 'text-green-500'
                                            : trend === 'down'
                                            ? 'text-red-500'
                                            : 'text-yellow-500'
                                    }`}
                                >
                                    {trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Stable'}
                                </Typography>
                            </Box>
                        )}
                        {description && (
                            <Typography variant="body2" className="mt-1 text-muted-foreground">
                                {description}
                            </Typography>
                        )}
                    </Box>
                    {icon && (
                        <Box className="p-2 rounded-full bg-primary/10">
                            {icon}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * Chart container component for patient interface
 */
export function ChartContainer({ title, subtitle, children, className = '' }) {
    return (
        <Card className={`border border-border bg-card shadow-sm ${className}`}>
            <CardContent>
                {(title || subtitle) && (
                    <Box className="mb-4">
                        {title && <Typography variant="h6" className="font-medium text-foreground">{title}</Typography>}
                        {subtitle && <Typography variant="body2" className="text-muted-foreground">{subtitle}</Typography>}
                    </Box>
                )}
                {children}
            </CardContent>
        </Card>
    );
}

/**
 * Health indicator component for patient interface
 */
export function HealthIndicator({ value, type, className = '' }) {
    const getIndicatorInfo = () => {
        switch (type) {
            case 'bloodPressure':
                if (value.systolic < 120 && value.diastolic < 80) return { label: 'Normal', color: 'bg-green-500' };
                if (value.systolic < 130 && value.diastolic < 85) return { label: 'Elevated', color: 'bg-yellow-500' };
                if (value.systolic < 140 && value.diastolic < 90) return { label: 'Stage 1', color: 'bg-orange-500' };
                return { label: 'Stage 2', color: 'bg-red-500' };
            case 'heartRate':
                if (value >= 60 && value <= 100) return { label: 'Normal', color: 'bg-green-500' };
                if (value > 100) return { label: 'Elevated', color: 'bg-yellow-500' };
                return { label: 'Low', color: 'bg-blue-500' };
            case 'bloodGlucose':
                if (value < 100) return { label: 'Normal', color: 'bg-green-500' };
                if (value < 126) return { label: 'Prediabetes', color: 'bg-yellow-500' };
                return { label: 'Diabetes', color: 'bg-red-500' };
            default:
                return { label: 'Unknown', color: 'bg-gray-500' };
        }
    };

    const info = getIndicatorInfo();

    return (
        <Box className={`flex items-center ${className}`}>
            <Box className={`w-3 h-3 rounded-full ${info.color} mr-2`}></Box>
            <Typography variant="body2" className="text-muted-foreground">
                {info.label}
            </Typography>
        </Box>
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
            case 'discontinued':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            className={`${getStatusClasses()}`}
        />
    );
}

/**
 * Appointment status badge component
 */
export function AppointmentStatusBadge({ status }) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return 'success';
            case 'pending':
                return 'warning';
            case 'completed':
                return 'info';
            case 'cancelled':
                return 'error';
            case 'rescheduled':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return 'Scheduled';
            case 'pending':
                return 'Pending';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            case 'rescheduled':
                return 'Rescheduled';
            default:
                return status || 'Unknown';
        }
    };

    return (
        <Chip
            label={getStatusLabel(status)}
            color={getStatusColor(status)}
            size="small"
            className="capitalize"
        />
    );
} 