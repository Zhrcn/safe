import { 
    mockPharmacistProfile, 
    mockInventory, 
    mockPrescriptions, 
    mockNotifications, 
    mockStats 
} from '@/data/mock/pharmacistData';

export const getInventory = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockInventory;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

export const getPrescriptions = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPrescriptions;
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

export const getPharmacistProfile = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPharmacistProfile;
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

export const updateInventoryItem = async (itemId, data) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const item = mockInventory.find(i => i.id === itemId);
        if (item) {
            Object.assign(item, data);
            return item;
        }
        throw new Error('Inventory item not found');
    } catch (error) {
        console.error('Error updating inventory item:', error);
        throw error;
    }
};

export const addInventoryItem = async (data) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newItem = {
            id: `inv_${String(mockInventory.length + 1).padStart(3, '0')}`,
            ...data
        };
        mockInventory.push(newItem);
        return newItem;
    } catch (error) {
        console.error('Error adding inventory item:', error);
        throw error;
    }
};

export const deleteInventoryItem = async (itemId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockInventory.findIndex(i => i.id === itemId);
        if (index !== -1) {
            const deletedItem = mockInventory.splice(index, 1)[0];
            return deletedItem;
        }
        throw new Error('Inventory item not found');
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        throw error;
    }
}; 