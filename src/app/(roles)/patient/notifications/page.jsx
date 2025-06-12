'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Alert, IconButton, Chip } from '@mui/material';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation, useDeleteNotificationMutation } from '@/store/services/patient/patientApi';
import { Bell, Check, Trash2, Calendar, FileText, Pill, MessageSquare } from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';

const getNotificationIcon = (type) => {
    switch (type) {
        case 'appointment':
            return Calendar;
        case 'medical':
            return FileText;
        case 'medication':
            return Pill;
        case 'message':
            return MessageSquare;
        default:
            return Bell;
    }
};

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
    const Icon = getNotificationIcon(notification.type);

    return (
        <Card className={`${!notification.read ? 'bg-primary-50' : ''}`}>
            <CardContent>
                <Box className="flex items-start justify-between mb-4">
                    <Box className="flex items-start gap-3">
                        <Icon className="text-primary mt-1" size={24} />
                        <Box>
                            <Typography variant="h6" component="h3" className="mb-1">
                                {notification.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="mb-2">
                                {notification.message}
                            </Typography>
                            <Box className="flex items-center gap-2">
                                <Chip
                                    size="small"
                                    label={notification.type}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="flex items-center gap-2">
                        {!notification.read && (
                            <IconButton
                                size="small"
                                onClick={() => onMarkAsRead(notification._id)}
                                className="text-primary"
                            >
                                <Check size={18} />
                            </IconButton>
                        )}
                        <IconButton
                            size="small"
                            onClick={() => onDelete(notification._id)}
                            className="text-error"
                        >
                            <Trash2 size={18} />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function NotificationsPage() {
    const { data: notifications, isLoading, error } = useGetNotificationsQuery();
    const [markAsRead] = useMarkNotificationAsReadMutation();
    const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center min-h-[400px]">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-4">
                <Alert severity="error">
                    Error loading notifications. Please try again later.
                </Alert>
            </Box>
        );
    }

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId).unwrap();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap();
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleDelete = async (notificationId) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            try {
                await deleteNotification(notificationId).unwrap();
            } catch (error) {
                console.error('Failed to delete notification:', error);
            }
        }
    };

    return (
        <Box className="container mx-auto px-4 py-8">
            <PageHeader
                title="Notifications"
                description="View and manage your notifications"
            />

            <Box className="flex justify-between items-center mb-6">
                <Typography variant="body1" color="text.secondary">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </Typography>
                {unreadCount > 0 && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </Button>
                )}
            </Box>

            <Box className="space-y-4">
                {notifications?.map((notification) => (
                    <NotificationCard
                        key={notification._id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                    />
                ))}
            </Box>

            {notifications?.length === 0 && (
                <Box className="text-center py-8">
                    <Typography variant="body1" color="text.secondary">
                        No notifications yet.
                    </Typography>
                </Box>
            )}
        </Box>
    );
} 