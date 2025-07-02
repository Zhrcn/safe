import { mockAdminProfile } from '@/data/mock/adminData';
import { mockPharmacistProfile } from '@/data/mock/pharmacistData';

const MOCK_USERS = {
    'admin@safemedical.com': {
        password: 'admin123',
        role: 'admin',
        profile: mockAdminProfile
    },
    'pharmacist@safemedical.com': {
        password: 'pharm123',
        role: 'pharmacist',
        profile: mockPharmacistProfile
    }
};

export const login = async (email, password) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = MOCK_USERS[email];
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        const token = btoa(`${email}:${Date.now()}`);
        
        localStorage.setItem('safe_auth_token', token);
        localStorage.setItem('user', JSON.stringify(user.profile));
        localStorage.setItem('role', user.role);

        return {
            token,
            user: user.profile,
            role: user.role
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('safe_auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getCurrentRole = () => {
    return localStorage.getItem('role');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('safe_auth_token');
}; 