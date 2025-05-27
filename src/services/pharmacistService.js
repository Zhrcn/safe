/**
 * Pharmacist Service
 * Handles all API calls related to the pharmacist role
 */

// Mock data for development - replace with actual API calls in production
const MOCK_INVENTORY = [
    { id: 1, name: 'Amoxicillin (500mg)', stock: 150, lowStockThreshold: 50 },
    { id: 2, name: 'Lisinopril (10mg)', stock: 30, lowStockThreshold: 40 },
    { id: 3, name: 'Ibuprofen (200mg)', stock: 250, lowStockThreshold: 100 },
    { id: 4, name: 'Aspirin (81mg)', stock: 80, lowStockThreshold: 50 },
    { id: 5, name: 'Cetirizine (10mg)', stock: 45, lowStockThreshold: 30 },
];

const MOCK_PRESCRIPTIONS = [
    { id: 1, patientName: 'Patient D', medication: 'Antibiotic X', dosage: '250 mg', frequency: 'Twice daily', issueDate: '2024-06-20', status: 'Pending' },
    { id: 2, patientName: 'Patient E', medication: 'Pain Reliever Y', dosage: '50 mg', frequency: 'As needed', issueDate: '2024-06-19', status: 'Pending' },
    { id: 3, patientName: 'Patient F', medication: 'Medication Z', dosage: '100 mg', frequency: 'Once daily', issueDate: '2024-06-18', status: 'Filled' },
    { id: 4, patientName: 'Patient G', medication: 'Antibiotic A', dosage: '500 mg', frequency: 'Three times daily', issueDate: '2024-06-20', status: 'Pending' },
];

const MOCK_ORDERS = [
    { id: 201, items: 'Item A (50 units), Item B (100 units)', date: '2024-06-18', status: 'Processing' },
    { id: 202, items: 'Item C (20 units)', date: '2024-06-19', status: 'Pending' },
    { id: 203, items: 'Item A (30 units), Item D (50 units)', date: '2024-06-17', status: 'Completed' },
    { id: 204, items: 'Item E (100 units)', date: '2024-06-20', status: 'Pending' },
];

const MOCK_PHARMACIST_PROFILE = {
    name: 'Fatima Al-Abbas',
    location: 'Downtown Pharmacy',
    licenseNumber: 'PH98765',
    contact: {
        email: 'fatima.abbas@example.com',
        phone: '+963 99 876 5432',
    },
};

/**
 * Get inventory items
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<Array>} - List of inventory items
 */
export async function getInventory(searchTerm = '') {
    // In production, replace with actual API call
    // const response = await fetch('/api/pharmacist/inventory');
    // const data = await response.json();
    // return data;

    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredInventory = searchTerm
                ? MOCK_INVENTORY.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : MOCK_INVENTORY;
            resolve(filteredInventory);
        }, 300); // Simulate network delay
    });
}

/**
 * Get prescriptions
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<Array>} - List of prescriptions
 */
export async function getPrescriptions(searchTerm = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredPrescriptions = searchTerm
                ? MOCK_PRESCRIPTIONS.filter(prescription =>
                    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : MOCK_PRESCRIPTIONS;
            resolve(filteredPrescriptions);
        }, 300);
    });
}

/**
 * Update prescription status
 * @param {number} id - Prescription ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated prescription
 */
export async function updatePrescriptionStatus(id, status) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const prescription = MOCK_PRESCRIPTIONS.find(p => p.id === id);
            if (prescription) {
                prescription.status = status;
            }
            resolve(prescription);
        }, 300);
    });
}

/**
 * Get orders
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<Array>} - List of orders
 */
export async function getOrders(searchTerm = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredOrders = searchTerm
                ? MOCK_ORDERS.filter(order =>
                    order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.id.toString().includes(searchTerm.toLowerCase())
                )
                : MOCK_ORDERS;
            resolve(filteredOrders);
        }, 300);
    });
}

/**
 * Update order status
 * @param {number} id - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated order
 */
export async function updateOrderStatus(id, status) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const order = MOCK_ORDERS.find(o => o.id === id);
            if (order) {
                order.status = status;
            }
            resolve(order);
        }, 300);
    });
}

/**
 * Get pharmacist profile
 * @returns {Promise<Object>} - Pharmacist profile
 */
export async function getPharmacistProfile() {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PHARMACIST_PROFILE);
        }, 300);
    });
}

/**
 * Update inventory item
 * @param {Object} item - Inventory item to update
 * @returns {Promise<Object>} - Updated inventory item
 */
export async function updateInventoryItem(item) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = MOCK_INVENTORY.findIndex(i => i.id === item.id);
            if (index !== -1) {
                MOCK_INVENTORY[index] = { ...MOCK_INVENTORY[index], ...item };
                resolve(MOCK_INVENTORY[index]);
            } else {
                resolve(null);
            }
        }, 300);
    });
}

/**
 * Add inventory item
 * @param {Object} item - New inventory item
 * @returns {Promise<Object>} - Added inventory item
 */
export async function addInventoryItem(item) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const newItem = {
                id: Math.max(...MOCK_INVENTORY.map(i => i.id)) + 1,
                ...item
            };
            MOCK_INVENTORY.push(newItem);
            resolve(newItem);
        }, 300);
    });
} 