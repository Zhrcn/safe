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

const NotificationContext = createContext(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info', 
    });

    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    const hideNotification = () => {
        setNotification({
            ...notification,
            open: false,
        });
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={hideNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={hideNotification} severity={notification.severity} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

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