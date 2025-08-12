
import axiosInstance from '@/store/services/axiosInstance';

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





export const getOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        if (status === 'cancelled') {
            const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);
            return response.data.data;
        }
        if (status === 'completed') {
            const response = await axiosInstance.patch(`/orders/${orderId}/complete`);
            return response.data.data;
        }
        const response = await axiosInstance.patch(`/orders/${orderId}`, { status });
        return response.data.data;
    } catch (error) {
        console.error('Error updating order status:', error);
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
        console.error('Request payload:', profileData);
        console.error('Response data:', error.response?.data);
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

export const getMedicineById = async (id) => {
    try {
        const response = await axiosInstance.get(`/medicines/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching medicine by ID:', error);
        throw error;
    }
}; 

export const deleteOrder = async (orderId) => {
    try {
        const response = await axiosInstance.delete(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};

export const getPharmacistOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching pharmacist orders:', error);
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
    }
}; 