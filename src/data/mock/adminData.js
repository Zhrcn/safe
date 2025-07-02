export const mockAdminProfile = {
    id: "admin_001",
    name: "Dr. Ahmed Hassan",
    email: "admin@safemedical.com",
    phone: "+1 (555) 987-6543",
    role: "System Administrator",
    department: "IT & Administration",
    experience: "10 years",
    lastLogin: "2024-03-15T08:30:00Z",
    profileImage: "/images/admin-profile.jpg"
};

export const mockUsers = [
    {
        id: "user_001",
        name: "Dr. Sarah Johnson",
        email: "pharmacist@safemedical.com",
        role: "pharmacist",
        status: "active",
        lastLogin: "2024-03-15T09:15:00Z",
        department: "Pharmacy",
        joinDate: "2023-01-15"
    },
    {
        id: "user_002",
        name: "Dr. Michael Brown",
        email: "doctor@safemedical.com",
        role: "doctor",
        status: "active",
        lastLogin: "2024-03-15T08:45:00Z",
        department: "General Medicine",
        joinDate: "2023-02-20"
    },
    {
        id: "user_003",
        name: "Emma Wilson",
        email: "nurse@safemedical.com",
        role: "nurse",
        status: "active",
        lastLogin: "2024-03-15T09:00:00Z",
        department: "Emergency",
        joinDate: "2023-03-10"
    },
    {
        id: "user_004",
        name: "John Smith",
        email: "patient@safemedical.com",
        role: "patient",
        status: "active",
        lastLogin: "2024-03-14T15:30:00Z",
        department: "N/A",
        joinDate: "2023-04-05"
    }
];

export const mockStats = {
    users: {
        total: 150,
        active: 142,
        byRole: {
            doctor: 25,
            nurse: 40,
            pharmacist: 15,
            patient: 70
        }
    },
    appointments: {
        total: 200,
        scheduled: 50,
        completed: 140,
        cancelled: 10
    },
    prescriptions: {
        total: 120,
        active: 80
    },
    systemHealth: {
        status: "Healthy",
        uptime: "99.9%"
    },
    totalUsers: 150,
    activeUsers: 142,
    inactiveUsers: 8,
    totalDoctors: 25,
    totalNurses: 40,
    totalPharmacists: 15,
    totalPatients: 70,
    newUsersThisMonth: 12,
    activeSessions: 45,
    lastBackup: "2024-03-15T00:00:00Z"
};

export const mockNotifications = [
    {
        id: "notif_001",
        type: "system",
        title: "System Update Required",
        message: "New security patch available for installation",
        timestamp: "2024-03-15T10:00:00Z",
        read: false
    },
    {
        id: "notif_002",
        type: "user",
        title: "New User Registration",
        message: "Dr. Lisa Chen has registered as a new doctor",
        timestamp: "2024-03-15T09:30:00Z",
        read: false
    },
    {
        id: "notif_003",
        type: "alert",
        title: "High System Load",
        message: "Server CPU usage is above 80%",
        timestamp: "2024-03-15T09:15:00Z",
        read: true
    }
];

export const mockSystemLogs = [
    {
        id: "log_001",
        type: "login",
        user: "Dr. Sarah Johnson",
        action: "User logged in",
        timestamp: "2024-03-15T09:15:00Z",
        ip: "192.168.1.100"
    },
    {
        id: "log_002",
        type: "update",
        user: "System",
        action: "Database backup completed",
        timestamp: "2024-03-15T00:00:00Z",
        ip: "N/A"
    },
    {
        id: "log_003",
        type: "error",
        user: "Dr. Michael Brown",
        action: "Failed login attempt",
        timestamp: "2024-03-15T08:40:00Z",
        ip: "192.168.1.101"
    }
]; 