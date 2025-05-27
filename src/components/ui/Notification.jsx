'use client';

import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle
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
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [duration, setDuration] = useState(6000);

    const showNotification = (
        message,
        type = 'info',
        duration = 6000
    ) => {
        setMessage(message);
        setType(type);
        setDuration(duration);
        setOpen(true);
    };

    const closeNotification = () => {
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, closeNotification }}>
            {children}
            <Notification
                open={open}
                message={message}
                type={type}
                duration={duration}
                onClose={closeNotification}
            />
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