'use client';

import React from 'react';
import { Box, Typography, Paper, Card, CardContent, CardHeader, Chip, Button } from '@mui/material';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

/**
 * Container component for admin pages with consistent styling
 */
export function AdminPageContainer({ title, description, children }) {
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
 * Card component for admin interface with consistent styling
 */
export function AdminCard({ title, subtitle, actions, children, className = '' }) {
    return (
        <Card className={`border border-border bg-card shadow-sm ${className}`}>
            <CardContent>
                {(title || subtitle || actions) && (
                    <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <Box>
                            {title && <Typography variant="h6" className="font-medium text-foreground">{title}</Typography>}
                            {subtitle && <Typography variant="body2" className="text-muted-foreground">{subtitle}</Typography>}
                        </Box>
                        {actions && <Box className="mt-2 sm:mt-0">{actions}</Box>}
                    </Box>
                )}
                {children}
            </CardContent>
        </Card>
    );
}

/**
 * Dashboard stat card component for admin interface
 */
export function StatCard({ title, value, trend = null, icon, description, className = '', onClick }) {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp size={16} className="text-green-500" />;
        if (trend === 'down') return <TrendingDown size={16} className="text-red-500" />;
        if (trend === 'neutral') return <Minus size={16} className="text-yellow-500" />;
        return null;
    };

    const getWrapperClass = () => {
        let baseClass = 'border border-border bg-card text-card-foreground rounded-lg p-4 transition-all duration-200';
        
        if (onClick) {
            baseClass += ' cursor-pointer hover:shadow-md';
        }

        return `${baseClass} ${className}`;
    };

    return (
        <Box 
            className={getWrapperClass()}
            onClick={onClick}
        >
            <Box className="flex items-start justify-between">
                <Box>
                    <Typography variant="h5" className="font-bold text-foreground">
                        {value}
                    </Typography>
                    
                    <Typography variant="body2" className="text-muted-foreground mt-1">
                        {title}
                    </Typography>
                    
                    {description && (
                        <Box className="mt-2">
                            <Typography variant="body2" className="text-muted-foreground">
                                {description}
                            </Typography>
                        </Box>
                    )}
                    
                    {trend && (
                        <Box className="flex items-center mt-2">
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
                                {trend === 'up' ? 'Increase' : trend === 'down' ? 'Decrease' : 'No change'}
                            </Typography>
                        </Box>
                    )}
                </Box>
                
                {icon && (
                    <Box className="p-2 rounded-full bg-primary/10 text-primary">
                        {icon}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

/**
 * Chart container component for admin interface
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
 * User role badge component
 */
export function UserRoleBadge({ role }) {
    const getRoleClasses = () => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'doctor':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'pharmacist':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'patient':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <Chip
            label={role.charAt(0).toUpperCase() + role.slice(1)}
            size="small"
            className={`${getRoleClasses()}`}
        />
    );
}

/**
 * User status badge component
 */
export function UserStatusBadge({ status }) {
    const getStatusClasses = () => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            case 'suspended':
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
 * Notification severity badge component
 */
export function NotificationSeverityBadge({ severity }) {
    const getSeverityClasses = () => {
        switch (severity.toLowerCase()) {
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <Chip
            label={severity.charAt(0).toUpperCase() + severity.slice(1)}
            size="small"
            className={`${getSeverityClasses()}`}
        />
    );
}

/**
 * Activity log item component
 */
export function ActivityLogItem({ user, action, timestamp, details, category }) {
    const getCategoryStyle = () => {
        switch (category?.toLowerCase()) {
            case 'user':
                return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900';
            case 'security':
                return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900';
            case 'system':
                return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900';
            default:
                return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <Box className="p-3 border-b border-border last:border-0">
            <Box className="flex flex-col sm:flex-row sm:items-start justify-between mb-1">
                <Box className="flex items-center">
                    <Typography className="font-medium text-foreground">{user}</Typography>
                    
                    {category && (
                        <Chip
                            label={category}
                            size="small"
                            className={`ml-2 text-xs px-2 py-1 rounded ${getCategoryStyle()}`}
                        />
                    )}
                </Box>
                
                <Typography variant="caption" className="text-muted-foreground mt-1 sm:mt-0">
                    {formatTimestamp(timestamp)}
                </Typography>
            </Box>
            
            <Typography className="mb-1 text-foreground">
                {action}
            </Typography>
            
            {details && (
                <Typography variant="body2" className="text-muted-foreground">
                    {details}
                </Typography>
            )}
        </Box>
    );
}

/**
 * Notification item component
 */
export function NotificationItem({ title, message, timestamp, severity, isRead, onMarkAsRead }) {
    const getNotificationClasses = () => {
        let baseClass = 'p-3 border-b border-border last:border-0 transition-colors duration-200';
        if (!isRead) {
            baseClass += ' bg-primary/5';
        }
        return baseClass;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <Box className={getNotificationClasses()}>
            <Box className="flex flex-col sm:flex-row sm:items-start justify-between mb-1">
                <Box className="flex items-center">
                    <Typography className="font-medium text-foreground">{title}</Typography>
                    {severity && <NotificationSeverityBadge severity={severity} />}
                </Box>
                
                <Typography variant="caption" className="text-muted-foreground mt-1 sm:mt-0">
                    {formatTimestamp(timestamp)}
                </Typography>
            </Box>
            
            <Typography variant="body2" className="mb-2 text-foreground">
                {message}
            </Typography>
            
            {!isRead && onMarkAsRead && (
                <Button
                    size="small"
                    onClick={onMarkAsRead}
                    endIcon={<ArrowRight size={16} />}
                    className="text-primary hover:bg-primary/10"
                >
                    Mark as read
                </Button>
            )}
        </Box>
    );
} 