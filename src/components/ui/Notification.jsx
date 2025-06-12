'use client';

import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Box, Paper, InputBase, IconButton } from '@mui/material';
import {
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle,
    Search
} from 'lucide-react';
import { cn } from '@/utils/styles';

const NotificationContext = createContext({
    showNotification: () => {},
    hideNotification: () => {},
});

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info',
        duration: 6000,
        position: { vertical: 'bottom', horizontal: 'right' },
    });

    const showNotification = ({
        message,
        severity = 'info',
        duration = 6000,
        position = { vertical: 'bottom', horizontal: 'right' },
    }) => {
        setNotification({
            open: true,
            message,
            severity,
            duration,
            position,
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const severityStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-gray-800',
        info: 'bg-blue-500 text-white',
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={notification.duration}
                onClose={hideNotification}
                anchorOrigin={notification.position}
            >
                <Alert
                    onClose={hideNotification}
                    severity={notification.severity}
                    className={cn(
                        'w-full shadow-lg rounded-lg',
                        severityStyles[notification.severity],
                        'transition-all duration-300 ease-in-out transform',
                        notification.open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    )}
                    sx={{
                        '& .MuiAlert-icon': {
                            color: 'inherit',
                        },
                        '& .MuiAlert-message': {
                            color: 'inherit',
                        },
                        '& .MuiAlert-action': {
                            color: 'inherit',
                        },
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}

const getIcon = (type) => {
    switch (type) {
        case 'success':
            return <CheckCircle size={24} />;
        case 'error':
            return <AlertCircle size={24} />;
        case 'warning':
            return <AlertTriangle size={24} />;
        case 'info':
        default:
            return <Info size={24} />;
    }
};

const Notification = ({
    open,
    message,
    type = 'info',
    duration = 6000,
    onClose,
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                severity={type}
                variant="filled"
                onClose={onClose}
                icon={getIcon(type)}
                sx={{
                    width: '100%',
                    alignItems: 'center',
                    boxShadow: 3,
                    '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                        alignItems: 'center',
                        display: 'flex'
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;

/**
 * Shared SearchField component that can be used across different roles
 * This eliminates duplicate SearchField implementations in role-specific components
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