'use client';
import React, { createContext, useContext, useState } from 'react';
import {
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle,
    Search,
    X
} from 'lucide-react';
import{ Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
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
            <div
                className={cn(
                    'fixed z-50 transition-all duration-300 ease-in-out transform',
                    notification.position.vertical === 'bottom' ? 'bottom-4' : 'top-4',
                    notification.position.horizontal === 'right' ? 'right-4' : 'left-4',
                    notification.open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                )}
            >
                <div
                    className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
                        severityStyles[notification.severity]
                    )}
                >
                    {getIcon(notification.severity)}
                    <p className="flex-1">{notification.message}</p>
                    <Button
                        onClick={hideNotification}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </Button>
                </div>
            </div>
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
export function SearchField({ value, onChange, placeholder = 'Search...', className = '' }) {
    return (
        <div className={cn(
            'flex items-center px-3 py-1 border border-border bg-background rounded-md',
            className
        )}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="ml-1 flex-1 bg-transparent text-foreground outline-none"
            />
            <Button
                type="button"
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
                <Search size={18} />
            </Button>
        </div>
    );
} 