export const mockPharmacistProfile = {
    id: "pharm_001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@safepharmacy.com",
    phone: "+1 (555) 123-4567",
    pharmacyName: "SAFE Central Pharmacy",
    address: "123 Healthcare Ave, Medical District",
    licenseNumber: "PHARM-2024-001",
    specialization: "Clinical Pharmacy",
    experience: "15 years",
    rating: 4.8,
    totalPrescriptions: 1250,
    activePrescriptions: 45,
    profileImage: "/images/pharmacist-profile.jpg"
};

export const mockInventory = [
    {
        id: "inv_001",
        name: "Amoxicillin 500mg",
        category: "Antibiotics",
        quantity: 150,
        unit: "capsules",
        expiryDate: "2024-12-31",
        price: 25.99,
        supplier: "MedSupply Co.",
        reorderLevel: 50,
        status: "In Stock"
    },
    {
        id: "inv_002",
        name: "Ibuprofen 400mg",
        category: "Pain Relief",
        quantity: 300,
        unit: "tablets",
        expiryDate: "2025-06-30",
        price: 15.99,
        supplier: "HealthPlus Inc.",
        reorderLevel: 100,
        status: "In Stock"
    },
    {
        id: "inv_003",
        name: "Omeprazole 20mg",
        category: "Gastrointestinal",
        quantity: 200,
        unit: "capsules",
        expiryDate: "2024-09-30",
        price: 30.99,
        supplier: "MedSupply Co.",
        reorderLevel: 75,
        status: "Low Stock"
    },
    {
        id: "inv_004",
        name: "Metformin 500mg",
        category: "Diabetes",
        quantity: 250,
        unit: "tablets",
        expiryDate: "2025-03-31",
        price: 20.99,
        supplier: "HealthPlus Inc.",
        reorderLevel: 80,
        status: "In Stock"
    },
    {
        id: "inv_005",
        name: "Atorvastatin 40mg",
        category: "Cardiovascular",
        quantity: 180,
        unit: "tablets",
        expiryDate: "2024-11-30",
        price: 35.99,
        supplier: "MedSupply Co.",
        reorderLevel: 60,
        status: "In Stock"
    }
];

export const mockPrescriptions = [
    {
        id: "rx_001",
        patientName: "John Smith",
        patientId: "pat_001",
        doctorName: "Dr. Michael Brown",
        doctorId: "doc_001",
        date: "2024-03-15",
        status: "Pending",
        medications: [
            {
                name: "Amoxicillin 500mg",
                dosage: "1 capsule",
                frequency: "3 times daily",
                duration: "7 days",
                instructions: "Take with food"
            }
        ],
        notes: "Complete full course of antibiotics"
    },
    {
        id: "rx_002",
        patientName: "Emma Wilson",
        patientId: "pat_002",
        doctorName: "Dr. Lisa Chen",
        doctorId: "doc_002",
        date: "2024-03-14",
        status: "Ready for Pickup",
        medications: [
            {
                name: "Ibuprofen 400mg",
                dosage: "1 tablet",
                frequency: "Every 6 hours",
                duration: "5 days",
                instructions: "Take with water"
            },
            {
                name: "Omeprazole 20mg",
                dosage: "1 capsule",
                frequency: "Once daily",
                duration: "14 days",
                instructions: "Take before breakfast"
            }
        ],
        notes: "Take pain medication as needed"
    },
    {
        id: "rx_003",
        patientName: "Robert Johnson",
        patientId: "pat_003",
        doctorName: "Dr. Sarah Miller",
        doctorId: "doc_003",
        date: "2024-03-13",
        status: "Completed",
        medications: [
            {
                name: "Metformin 500mg",
                dosage: "1 tablet",
                frequency: "Twice daily",
                duration: "30 days",
                instructions: "Take with meals"
            }
        ],
        notes: "Regular blood sugar monitoring required"
    },
    {
        id: "rx_004",
        patientName: "Maria Garcia",
        patientId: "pat_004",
        doctorName: "Dr. James Wilson",
        doctorId: "doc_004",
        date: "2024-03-12",
        status: "Pending",
        medications: [
            {
                name: "Atorvastatin 40mg",
                dosage: "1 tablet",
                frequency: "Once daily",
                duration: "30 days",
                instructions: "Take at bedtime"
            }
        ],
        notes: "Regular cholesterol check required"
    }
];

export const mockNotifications = [
    {
        id: "notif_001",
        type: "prescription",
        title: "New Prescription",
        message: "New prescription received from Dr. Michael Brown",
        timestamp: "2024-03-15T10:30:00Z",
        read: false
    },
    {
        id: "notif_002",
        type: "inventory",
        title: "Low Stock Alert",
        message: "Omeprazole 20mg is running low (25 units remaining)",
        timestamp: "2024-03-15T09:15:00Z",
        read: false
    },
    {
        id: "notif_003",
        type: "system",
        title: "System Update",
        message: "New features have been added to the dashboard",
        timestamp: "2024-03-14T16:45:00Z",
        read: true
    }
];

export const mockStats = {
    totalPrescriptions: 1250,
    activePrescriptions: 45,
    pendingPrescriptions: 12,
    completedPrescriptions: 1193,
    totalInventory: 1080,
    lowStockItems: 3,
    outOfStockItems: 0,
    monthlyRevenue: 45678.90,
    averagePrescriptionValue: 36.54
}; 