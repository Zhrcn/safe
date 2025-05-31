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
 * @param {string} searchTerm 
 * @returns {Promise<Array>} 
 */
export async function getInventory(searchTerm = '') {

    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredInventory = searchTerm
                ? MOCK_INVENTORY.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : MOCK_INVENTORY;
            resolve(filteredInventory);
        }, 300); 
    });
}

/**
 * @param {string} searchTerm 
 * @returns {Promise<Array>} 
 */
export async function getPrescriptions(searchTerm = '') {
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
 * @param {number} id 
 * @param {string} status 
 * @returns {Promise<Object>} 
 */
export async function updatePrescriptionStatus(id, status) {
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
 * @param {string} searchTerm 
 * @returns {Promise<Array>} 
 */
export async function getOrders(searchTerm = '') {
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
 * @param {number} id 
 * @param {string} status 
 * @returns {Promise<Object>} 
 */
export async function updateOrderStatus(id, status) {
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
 * @returns {Promise<Object>} 
 */
export async function getPharmacistProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PHARMACIST_PROFILE);
        }, 300);
    });
}

/**
 * @param {Object} item 
 * @returns {Promise<Object>} 
 */
export async function updateInventoryItem(item) {
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
 * @param {Object} item 
 * @returns {Promise<Object>} 
 */
export async function addInventoryItem(item) {
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

/**
 * Fetches dashboard data for the pharmacist dashboard
 * @returns {Promise<Object>} Dashboard data for the pharmacist dashboard
 */
export async function getPharmacistDashboardData() {
    try {
        const response = await fetch('/api/dashboard/pharmacist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pharmacist dashboard data:', error);
        throw error;
    }
}

/**
 * Fetches pending prescriptions
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @returns {Promise<Object>} Prescriptions data
 */
export async function getPendingPrescriptions(options = {}) {
    try {
        const { page = 1, limit = 10 } = options;
        
        const response = await fetch(`/api/prescriptions?page=${page}&limit=${limit}&status=active&filled=false`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch pending prescriptions');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pending prescriptions:', error);
        throw error;
    }
}

/**
 * Fills a prescription
 * @param {string} prescriptionId - Prescription ID
 * @param {Object} fillData - Fill data including notes
 * @returns {Promise<Object>} Updated prescription
 */
export async function fillPrescription(prescriptionId, fillData) {
    try {
        const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            },
            body: JSON.stringify({
                status: 'Filled',
                filledBy: {
                    notes: fillData.notes || '',
                    date: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fill prescription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error filling prescription:', error);
        throw error;
    }
}

/**
 * Fetches patient prescriptions
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @param {string} options.status - Filter by status
 * @returns {Promise<Object>} Prescriptions data
 */
export async function getPatientPrescriptions(patientId, options = {}) {
    try {
        const { page = 1, limit = 10, status } = options;
        
        let url = `/api/prescriptions?page=${page}&limit=${limit}&patientId=${patientId}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch patient prescriptions');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching patient prescriptions:', error);
        throw error;
    }
}

/**
 * Searches for patients
 * @param {string} searchTerm - Search term
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @returns {Promise<Object>} Patients data
 */
export async function searchPatients(searchTerm, options = {}) {
    try {
        const { page = 1, limit = 10 } = options;
        
        const response = await fetch(`/api/users/patients?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to search patients');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching patients:', error);
        throw error;
    }
} 