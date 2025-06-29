import { 
    mockAdminProfile, 
    mockUsers, 
    mockStats, 
    mockNotifications, 
    mockSystemLogs 
} from '@/data/mock/adminData';

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
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUser = async (userId, data) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        return mockUsers[userIndex];
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        const deletedUser = mockUsers.splice(userIndex, 1)[0];
        return deletedUser;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
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
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockNotifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
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
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSystemLogs;
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
    }
}; 