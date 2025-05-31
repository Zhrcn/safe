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
 * @param {Object} filters 
 * @returns {Promise<Array>} 
 */
export async function getUsers(filters = {}) {
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

 * @returns {Promise<Object>} 
 */
export async function getSystemStats() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_SYSTEM_STATS);
        }, 300);
    });
}

/**
 * @param {Object} filters
 * @returns {Promise<Array>} 
 */
export async function getActivityLogs(filters = {}) {
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
            }

            resolve(filteredLogs);
        }, 300);
    });
}

/**
 * @param {boolean} onlyUnread 
 * @returns {Promise<Array>} 
 */
export async function getNotifications(onlyUnread = false) {
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
 * @param {Object} userData
 * @returns {Promise<Object>} 
 */
export async function createUser(userData) {
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
 * @param {number} id 
 * @param {Object} userData 
 * @returns {Promise<Object>} 
 */
export async function updateUser(id, userData) {
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
 * @param {number} id 
 * @returns {Promise<boolean>}
 */
export async function deleteUser(id) {
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
 * @param {number} id 
 * @returns {Promise<Object>} 
 */
export async function markNotificationAsRead(id) {
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