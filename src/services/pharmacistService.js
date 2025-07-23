import { 
    mockPharmacistProfile, 
    mockInventory, 
    mockPrescriptions, 
    mockNotifications, 
    mockStats 
} from '@/data/mock/pharmacistData';
import axiosInstance from '@/store/services/axiosInstance';
import { getPharmacistOrders, cancelOrder } from '@/store/services/orderApi';

export const getInventory = async () => {
    try {
        const response = await axiosInstance.get('/pharmacists/inventory');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

export const getPrescriptions = async () => {
    try {
        const response = await axiosInstance.get('/prescriptions');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

export const getPharmacistProfile = async () => {
    try {
        const response = await axiosInstance.get('/pharmacists/profile');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching pharmacist profile:', error);
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

export const getStats = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStats;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

export const getOrders = async () => {
    try {
        const response = await getPharmacistOrders();
        return response.data.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        if (status === 'cancelled') {
            const response = await cancelOrder(orderId);
            return response.data.data;
        }
        if (status === 'completed') {
            const response = await axiosInstance.patch(`/orders/${orderId}/complete`);
            return response.data.data;
        }
        // For other statuses, send PATCH to /orders/:id with { status }
        const response = await axiosInstance.patch(`/orders/${orderId}`, { status });
        return response.data.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const updatePrescriptionStatus = async (prescriptionId, status) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const prescription = mockPrescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.status = status;
            return prescription;
        }
        throw new Error('Prescription not found');
    } catch (error) {
        console.error('Error updating prescription status:', error);
        throw error;
    }
};

export const updateInventoryItem = async (item) => {
    try {
        const response = await axiosInstance.patch(`/pharmacists/inventory/${item._id || item.id}`, item);
        return response.data.data;
    } catch (error) {
        console.error('Error updating inventory item:', error);
        throw error;
    }
};

export const addInventoryItem = async (data) => {
    try {
        const response = await axiosInstance.post('/pharmacists/inventory', data);
        return response.data.data;
    } catch (error) {
        console.error('Error adding inventory item:', error);
        throw error;
    }
};

export const deleteInventoryItem = async (id) => {
    try {
        const response = await axiosInstance.delete(`/pharmacists/inventory/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        throw error;
    }
};

export const updatePharmacistProfile = async (profileData) => {
    try {
        const response = await axiosInstance.patch('/pharmacists/profile', profileData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating pharmacist profile:', error);
        throw error;
    }
};

export const markPrescriptionFilled = async (prescriptionId) => {
    try {
        const response = await axiosInstance.patch(`/prescriptions/${prescriptionId}`, { status: 'filled' });
        return response.data.data;
    } catch (error) {
        console.error('Error marking prescription as filled:', error);
        throw error;
    }
};

export const getPharmacists = async () => {
    try {
        const response = await axiosInstance.get('/pharmacists');
        return response.data;
    } catch (error) {
        console.error('Error fetching pharmacists:', error);
        throw error;
    }
}; 

export const getPrescriptionById = async (id) => {
    try {
        const response = await axiosInstance.get(`/prescriptions/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching prescription by ID:', error);
        throw error;
    }
}; 

export const getDistributors = async () => {
    try {
        const response = await axiosInstance.get('/distributors');
        return response.data;
    } catch (error) {
        console.error('Error fetching distributors:', error);
        throw error;
    }
}; 