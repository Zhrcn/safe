import { 
    mockPharmacistProfile, 
    mockInventory, 
    mockPrescriptions, 
    mockNotifications, 
    mockStats 
} from '@/data/mock/pharmacistData';

// Get pharmacist's inventory
export const getInventory = async () => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockInventory;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

// Get prescriptions assigned to pharmacist
export const getPrescriptions = async () => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPrescriptions;
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

// Get pharmacist's profile
export const getPharmacistProfile = async () => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPharmacistProfile;
    } catch (error) {
        console.error('Error fetching pharmacist profile:', error);
        throw error;
    }
};

// Get pharmacist's notifications
export const getNotifications = async () => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockNotifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

// Get pharmacist's stats
export const getStats = async () => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStats;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

// Update prescription status
export const updatePrescriptionStatus = async (prescriptionId, status) => {
    try {
        // Simulate API delay
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

// Update inventory item
export const updateInventoryItem = async (itemId, data) => {
    try {
        // Simulate API delay
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

// Add new inventory item
export const addInventoryItem = async (data) => {
    try {
        // Simulate API delay
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

// Delete inventory item
export const deleteInventoryItem = async (itemId) => {
    try {
        // Simulate API delay
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