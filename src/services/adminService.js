import axiosInstance from '@/store/services/axiosInstance';

// Add mock data definitions to prevent ReferenceError
const mockSystemLogs = [];
const mockStats = {};
const mockNotifications = [];

export const getAdminProfile = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockAdminProfile;
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        throw error;
    }
};

export const getUsers = async () => {
    const response = await axiosInstance.get('/users');
    return response.data.data;
};

export const getUserById = async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
};

export const updateUser = async (userId, data) => {
    const response = await axiosInstance.patch(`/users/${userId}`, data);
    return response.data.data;
};

export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
};

export const getStats = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStats;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

export const getNotifications = async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
};

export const getSystemLogs = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSystemLogs;
    } catch (error) {
        console.error('Error fetching system logs:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            return notification;
        }
        throw new Error('Notification not found');
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const getSystemStats = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStats;
    } catch (error) {
        console.error('Error fetching system stats:', error);
        throw error;
    }
};

export const getActivityLogs = async () => {
    const response = await axiosInstance.get('/logs');
    // The backend returns { statusCode, data, message }, where data is the logs array
    return response.data.data || [];
};