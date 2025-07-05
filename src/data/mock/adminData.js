export const mockAdminProfile = {
  id: 'admin_001',
  firstName: 'Admin',
  lastName: 'User',
  name: 'Admin User',
  email: 'admin@safemedical.com',
  phoneNumber: '+1234567890',
  role: 'admin',
  isActive: true,
  isVerified: true,
  lastLogin: '2024-03-20T15:30:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-03-20T15:30:00Z',
  permissions: ['manage_users', 'view_logs', 'manage_system', 'view_reports'],
  profileImage: '/avatars/default-avatar.svg'
};

export const mockUsers = [
  {
    id: '1',
    username: 'patient1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'patient',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-03-20T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      avatar: null,
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      conditions: ['Hypertension'],
      medications: ['Lisinopril']
    }
  },
  {
    id: '2',
    username: 'doctor1',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@example.com',
    role: 'doctor',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-03-20T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      avatar: null,
      phone: '+1234567892',
      specialization: 'Cardiology',
      license: 'MD123456',
      yearsOfExperience: 10,
      education: [
        {
          degree: 'MD',
          institution: 'Harvard Medical School',
          year: 2010
        }
      ],
      certifications: ['Board Certified in Cardiology'],
      languages: ['English', 'Spanish']
    }
  },
  {
    id: '3',
    username: 'pharmacist1',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'pharmacist',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-03-20T12:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      avatar: null,
      phone: '+1234567893',
      license: 'PH123456',
      yearsOfExperience: 8,
      education: [
        {
          degree: 'PharmD',
          institution: 'University of California',
          year: 2012
        }
      ],
      certifications: ['Board Certified Pharmacist'],
      languages: ['English', 'French']
    }
  }
];

export const mockStats = {
  totalUsers: 1250,
  activeUsers: 1180,
  newUsersThisMonth: 45,
  totalDoctors: 85,
  totalPatients: 1100,
  totalPharmacists: 65,
  totalAppointments: 3420,
  completedAppointments: 3150,
  pendingAppointments: 270,
  totalConsultations: 2150,
  totalPrescriptions: 1890,
  systemUptime: '99.8%',
  averageResponseTime: '2.3s',
  storageUsed: '75%',
  monthlyGrowth: '12%'
};

export const mockNotifications = [
  {
    id: '1',
    title: 'New User Registration',
    message: 'A new doctor has registered and requires verification.',
    type: 'user_registration',
    isRead: false,
    createdAt: '2024-03-20T15:30:00Z',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM.',
    type: 'system_maintenance',
    isRead: true,
    createdAt: '2024-03-20T14:00:00Z',
    priority: 'low'
  },
  {
    id: '3',
    title: 'High Storage Usage',
    message: 'Storage usage has reached 85%. Consider cleanup.',
    type: 'system_alert',
    isRead: false,
    createdAt: '2024-03-20T13:30:00Z',
    priority: 'high'
  },
  {
    id: '4',
    title: 'New Report Available',
    message: 'Monthly user activity report is ready for review.',
    type: 'report',
    isRead: false,
    createdAt: '2024-03-20T12:00:00Z',
    priority: 'medium'
  }
];

export const mockSystemLogs = [
  {
    id: '1',
    action: 'USER_LOGIN',
    userId: '1',
    userEmail: 'john.doe@example.com',
    userRole: 'patient',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-20T15:30:00Z',
    status: 'success',
    details: 'User logged in successfully'
  },
  {
    id: '2',
    action: 'APPOINTMENT_CREATED',
    userId: '2',
    userEmail: 'sarah.smith@example.com',
    userRole: 'doctor',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2024-03-20T15:25:00Z',
    status: 'success',
    details: 'New appointment created for patient ID: 15'
  },
  {
    id: '3',
    action: 'PRESCRIPTION_UPDATED',
    userId: '3',
    userEmail: 'michael.johnson@example.com',
    userRole: 'pharmacist',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-20T15:20:00Z',
    status: 'success',
    details: 'Prescription status updated to "dispensed"'
  },
  {
    id: '4',
    action: 'USER_REGISTRATION',
    userId: '4',
    userEmail: 'new.doctor@example.com',
    userRole: 'doctor',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    timestamp: '2024-03-20T15:15:00Z',
    status: 'pending',
    details: 'New doctor registration requires verification'
  },
  {
    id: '5',
    action: 'SYSTEM_BACKUP',
    userId: 'system',
    userEmail: 'system@safemedical.com',
    userRole: 'system',
    ipAddress: '192.168.1.1',
    userAgent: 'System/1.0',
    timestamp: '2024-03-20T15:00:00Z',
    status: 'success',
    details: 'Daily system backup completed successfully'
  }
]; 