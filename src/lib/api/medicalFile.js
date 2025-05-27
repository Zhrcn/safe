// DEV MODE: Set to true to bypass real API calls and return mock data
const DEV_MODE = true;

// Mock data for development
const MOCK_MEDICAL_FILE = {
    _id: 'mock_medical_file_123',
    patientId: 'dev_patient_123',
    allergies: [
        { allergen: 'Peanuts', severity: 'High', reaction: 'Anaphylaxis', diagnosed: '2020-05-15' },
        { allergen: 'Penicillin', severity: 'Medium', reaction: 'Rash', diagnosed: '2019-01-10' }
    ],
    conditions: [
        {
            name: 'Hypertension',
            diagnosedDate: '2021-03-20',
            status: 'Active',
            notes: 'Controlled with medication'
        },
        {
            name: 'Asthma',
            diagnosedDate: '2015-07-12',
            status: 'Managed',
            notes: 'Occasional flare-ups during spring'
        }
    ],
    medications: [
        {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            startDate: '2021-03-25',
            endDate: null,
            prescribedBy: 'Dr. Smith'
        },
        {
            name: 'Albuterol Inhaler',
            dosage: '2 puffs',
            frequency: 'As needed',
            startDate: '2015-07-15',
            endDate: null,
            prescribedBy: 'Dr. Johnson'
        }
    ],
    immunizations: [
        {
            vaccine: 'Influenza',
            date: '2023-10-15',
            administeredBy: 'Walgreens Pharmacy'
        },
        {
            vaccine: 'COVID-19',
            date: '2021-04-30',
            administeredBy: 'Community Health Clinic'
        }
    ],
    vitalSigns: [
        {
            date: '2023-11-10',
            bloodPressure: '120/80',
            heartRate: 72,
            respiratoryRate: 16,
            temperature: 98.6,
            weight: 170,
            height: 5.9,
            notes: 'Annual checkup'
        }
    ],
    accessLog: [
        {
            accessedBy: 'dev_doctor_123',
            action: 'view',
            accessDate: '2023-11-10T14:30:00Z'
        }
    ],
    lastUpdated: '2023-11-10T14:30:00Z'
};

// Helper function to get auth token
function getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('safe_auth_token');
}

// Fetch entire medical file
export async function getMedicalFile() {
    // DEV MODE: Return mock data
    if (DEV_MODE) {
        console.log('DEV MODE: Returning mock medical file data');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(MOCK_MEDICAL_FILE);
            }, 500); // Simulate network delay
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/medical-file', {
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch medical file');
    }
    return response.json();
}

// Fetch specific section
export async function getMedicalFileSection(section) {
    // DEV MODE: Return mock data for the specific section
    if (DEV_MODE) {
        console.log(`DEV MODE: Returning mock ${section} data`);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(MOCK_MEDICAL_FILE[section] || []);
            }, 300); // Simulate network delay
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}`, {
        headers
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${section}`);
    }
    return response.json();
}

// Add item to a section
export async function addToMedicalFile(section, data) {
    // DEV MODE: Simulate adding an item
    if (DEV_MODE) {
        console.log(`DEV MODE: Adding to ${section}`, data);
        return new Promise(resolve => {
            setTimeout(() => {
                const mockItem = {
                    ...data,
                    _id: `mock_${section}_item_${Date.now()}`
                };
                resolve(mockItem);
            }, 400);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to add ${section}`);
    }
    return response.json();
}

// Update item in a section
export async function updateMedicalFileItem(section, itemId, data) {
    // DEV MODE: Simulate updating an item
    if (DEV_MODE) {
        console.log(`DEV MODE: Updating ${section} item ${itemId}`, data);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ ...data, _id: itemId });
            }, 400);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}?id=${itemId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to update ${section}`);
    }
    return response.json();
}

// Delete item from a section
export async function deleteMedicalFileItem(section, itemId) {
    // DEV MODE: Simulate deleting an item
    if (DEV_MODE) {
        console.log(`DEV MODE: Deleting ${section} item ${itemId}`);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, message: `${section} item deleted` });
            }, 400);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}?id=${itemId}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        throw new Error(`Failed to delete ${section}`);
    }
    return response.json();
}

// Update entire medical file
export async function updateMedicalFile(data) {
    // DEV MODE: Simulate updating the entire file
    if (DEV_MODE) {
        console.log('DEV MODE: Updating entire medical file', data);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ ...MOCK_MEDICAL_FILE, ...data, lastUpdated: new Date().toISOString() });
            }, 600);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/medical-file', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update medical file');
    }
    return response.json();
} 