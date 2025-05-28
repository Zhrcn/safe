import React from 'react';
import { Box, Typography, Paper, InputBase, IconButton, Card, CardContent, CardHeader, Chip, Button } from '@mui/material';
import { Search, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

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
 * Search field component for admin interface
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
 * Dashboard stat card component for admin interface
 */
export function StatCard({ title, value, trend = null, icon, description, className = '', onClick }) {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp size={16} className="text-green-500" />;
        if (trend === 'down') return <TrendingDown size={16} className="text-red-500" />;
        if (trend === 'neutral') return <Minus size={16} className="text-yellow-500" />;
        return null;
    };

    return (
        <Card
            elevation={0}
            className={`border border-border bg-card text-card-foreground rounded-lg ${onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : ''} ${className}`}
            onClick={onClick}
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
                {onClick && (
                    <Box className="mt-4 flex items-center text-primary">
                        <Typography variant="body2" className="font-medium">
                            View details
                        </Typography>
                        <ArrowRight size={16} className="ml-1" />
                    </Box>
                )}
            </CardContent>
        </Card>
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
    const getCategoryClasses = () => {
        switch (category.toLowerCase()) {
            case 'authentication':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'clinical':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'pharmacy':
                return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
            case 'administration':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'system':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Format timestamp
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <Box className="border-b border-border py-3 last:border-0">
            <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                    <Typography variant="body1" className="font-medium text-foreground">
                        {user}
                    </Typography>
                    <Typography variant="body2" className="ml-2 text-muted-foreground">
                        {action}
                    </Typography>
                </Box>
                <Typography variant="caption" className="text-muted-foreground">
                    {formatDate(timestamp)}
                </Typography>
            </Box>
            {details && (
                <Typography variant="body2" className="mt-1 text-muted-foreground">
                    {details}
                </Typography>
            )}
            <Box className="mt-2">
                <Chip
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                    size="small"
                    className={`${getCategoryClasses()}`}
                />
            </Box>
        </Box>
    );
}

/**
 * Notification item component
 */
export function NotificationItem({ title, message, timestamp, severity, isRead, onMarkAsRead }) {
    // Format timestamp
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <Box className={`border-b border-border py-3 last:border-0 ${!isRead ? 'bg-muted/30' : ''}`}>
            <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                    <Typography variant="body1" className="font-medium text-foreground">
                        {title}
                    </Typography>
                    <NotificationSeverityBadge severity={severity} />
                </Box>
                <Typography variant="caption" className="text-muted-foreground">
                    {formatDate(timestamp)}
                </Typography>
            </Box>
            <Typography variant="body2" className="mt-1 text-muted-foreground">
                {message}
            </Typography>
            {!isRead && onMarkAsRead && (
                <Box className="mt-2 flex justify-end">
                    <Button
                        size="small"
                        onClick={onMarkAsRead}
                        className="text-primary hover:bg-primary/10"
                    >
                        Mark as read
                    </Button>
                </Box>
            )}
        </Box>
    );
} 