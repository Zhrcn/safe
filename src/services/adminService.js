/**
 * Admin Service
 * Handles all API calls related to the admin role
 */

// Mock data for development - replace with actual API calls in production
const MOCK_USERS = [
    {
        id: 1,
        name: 'Dr. Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        role: 'doctor',
        specialty: 'Cardiology',
        status: 'active',
        lastActive: '2024-06-25T10:30:00Z'
    },
    {
        id: 2,
        name: 'Dr. Fatima Al-Abbas',
        email: 'fatima.abbas@example.com',
        role: 'doctor',
        specialty: 'General Medicine',
        status: 'active',
        lastActive: '2024-06-25T09:15:00Z'
    },
    {
        id: 3,
        name: 'Nour Khalid',
        email: 'nour.khalid@example.com',
        role: 'pharmacist',
        pharmacy: 'Downtown Pharmacy',
        status: 'active',
        lastActive: '2024-06-25T11:45:00Z'
    },
    {
        id: 4,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'patient',
        status: 'active',
        lastActive: '2024-06-24T15:20:00Z'
    },
    {
        id: 5,
        name: 'Omar Zaid',
        email: 'omar.zaid@example.com',
        role: 'admin',
        status: 'active',
        lastActive: '2024-06-25T08:30:00Z'
    },
    {
        id: 6,
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'patient',
        status: 'inactive',
        lastActive: '2024-06-10T14:45:00Z'
    }
];

const MOCK_SYSTEM_STATS = {
    users: {
        total: 156,
        active: 142,
        inactive: 14,
        byRole: {
            doctor: 32,
            patient: 98,
            pharmacist: 18,
            admin: 8
        }
    },
    appointments: {
        total: 450,
        scheduled: 120,
        completed: 310,
        cancelled: 20
    },
    prescriptions: {
        total: 680,
        active: 210,
        completed: 470
    },
    systemHealth: {
        status: 'healthy',
        uptime: '99.98%',
        responseTime: '230ms',
        lastIssue: '2024-05-15T03:20:00Z'
    }
};

const MOCK_ACTIVITY_LOGS = [
    {
        id: 1,
        user: 'Dr. Ahmed Hassan',
        action: 'Logged in',
        timestamp: '2024-06-25T10:30:00Z',
        details: 'IP: 192.168.1.105',
        category: 'authentication'
    },
    {
        id: 2,
        user: 'Dr. Ahmed Hassan',
        action: 'Created prescription',
        timestamp: '2024-06-25T10:45:00Z',
        details: 'Prescription #12345 for patient Sarah Johnson',
        category: 'clinical'
    },
    {
        id: 3,
        user: 'Nour Khalid',
        action: 'Filled prescription',
        timestamp: '2024-06-25T11:45:00Z',
        details: 'Prescription #12345 for patient Sarah Johnson',
        category: 'pharmacy'
    },
    {
        id: 4,
        user: 'Omar Zaid',
        action: 'Added user',
        timestamp: '2024-06-25T08:30:00Z',
        details: 'Created new doctor account for Dr. Layla Mahmoud',
        category: 'administration'
    },
    {
        id: 5,
        user: 'System',
        action: 'Backup completed',
        timestamp: '2024-06-25T02:00:00Z',
        details: 'Daily automated backup',
        category: 'system'
    }
];

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'System Update Scheduled',
        message: 'System maintenance will occur on July 1, 2024 from 2:00 AM to 4:00 AM. The system will be unavailable during this time.',
        timestamp: '2024-06-25T09:00:00Z',
        severity: 'info',
        isRead: false
    },
    {
        id: 2,
        title: 'License Renewal Required',
        message: 'The system license will expire in 15 days. Please renew to avoid service interruption.',
        timestamp: '2024-06-24T10:30:00Z',
        severity: 'warning',
        isRead: true
    },
    {
        id: 3,
        title: 'New Feature Available',
        message: 'Telemedicine integration is now available. Configure in system settings.',
        timestamp: '2024-06-23T14:15:00Z',
        severity: 'info',
        isRead: false
    },
    {
        id: 4,
        title: 'Security Alert',
        message: 'Multiple failed login attempts detected for user account: omar.zaid@example.com',
        timestamp: '2024-06-22T18:45:00Z',
        severity: 'error',
        isRead: true
    }
];

/**
 * Get all users
 * @param {Object} filters - Optional filters (role, status)
 * @returns {Promise<Array>} - List of users
 */
export async function getUsers(filters = {}) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredUsers = [...MOCK_USERS];

            if (filters.role) {
                filteredUsers = filteredUsers.filter(user => user.role === filters.role);
            }

            if (filters.status) {
                filteredUsers = filteredUsers.filter(user => user.status === filters.status);
            }

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredUsers = filteredUsers.filter(user =>
                    user.name.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
                );
            }

            resolve(filteredUsers);
        }, 300);
    });
}

/**
 * Get system statistics
 * @returns {Promise<Object>} - System statistics
 */
export async function getSystemStats() {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_SYSTEM_STATS);
        }, 300);
    });
}

/**
 * Get activity logs
 * @param {Object} filters - Optional filters (category, user, dateRange)
 * @returns {Promise<Array>} - List of activity logs
 */
export async function getActivityLogs(filters = {}) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredLogs = [...MOCK_ACTIVITY_LOGS];

            if (filters.category) {
                filteredLogs = filteredLogs.filter(log => log.category === filters.category);
            }

            if (filters.user) {
                filteredLogs = filteredLogs.filter(log => log.user.toLowerCase().includes(filters.user.toLowerCase()));
            }

            if (filters.dateRange) {
                // Implementation for date filtering would go here
                // This is simplified for the mock
            }

            resolve(filteredLogs);
        }, 300);
    });
}

/**
 * Get notifications
 * @param {boolean} onlyUnread - Whether to return only unread notifications
 * @returns {Promise<Array>} - List of notifications
 */
export async function getNotifications(onlyUnread = false) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredNotifications = onlyUnread
                ? MOCK_NOTIFICATIONS.filter(notification => !notification.isRead)
                : MOCK_NOTIFICATIONS;
            resolve(filteredNotifications);
        }, 300);
    });
}

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user
 */
export async function createUser(userData) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser = {
                id: Math.max(...MOCK_USERS.map(u => u.id)) + 1,
                ...userData,
                status: 'active',
                lastActive: new Date().toISOString()
            };
            MOCK_USERS.push(newUser);
            resolve(newUser);
        }, 300);
    });
}

/**
 * Update user
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - Updated user
 */
export async function updateUser(id, userData) {
    // Mock implementation
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = MOCK_USERS.findIndex(u => u.id === id);
            if (userIndex === -1) {
                reject(new Error('User not found'));
                return;
            }

            MOCK_USERS[userIndex] = {
                ...MOCK_USERS[userIndex],
                ...userData
            };

            resolve(MOCK_USERS[userIndex]);
        }, 300);
    });
}

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteUser(id) {
    // Mock implementation
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = MOCK_USERS.findIndex(u => u.id === id);
            if (userIndex === -1) {
                reject(new Error('User not found'));
                return;
            }

            MOCK_USERS.splice(userIndex, 1);
            resolve(true);
        }, 300);
    });
}

/**
 * Mark notification as read
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} - Updated notification
 */
export async function markNotificationAsRead(id) {
    // Mock implementation
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const notificationIndex = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
            if (notificationIndex === -1) {
                reject(new Error('Notification not found'));
                return;
            }

            MOCK_NOTIFICATIONS[notificationIndex].isRead = true;
            resolve(MOCK_NOTIFICATIONS[notificationIndex]);
        }, 300);
    });
} 