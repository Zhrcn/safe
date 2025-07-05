export const mockPharmacistProfile = {
  id: 'pharm_001',
  user: {
    id: '7',
    firstName: 'John',
    lastName: 'Smith',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phoneNumber: '5551234567',
    age: 40,
    address: '123 Pharmacy St',
    profileImage: '/pharmacists/pharmacist1.jpg',
    gender: 'male',
    isActive: true,
    role: 'pharmacist',
    isVerified: true,
    lastLogin: '2024-03-20T15:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
  },
  licenseNumber: 'PH123456',
  pharmacyName: 'City Pharmacy',
  yearsOfExperience: 8,
  qualifications: ['PharmD', 'BCPS'],
  professionalBio: 'Experienced pharmacist with a focus on patient care and medication therapy management.',
  education: [
    {
      degree: 'PharmD',
      institution: 'University of California',
      year: 2016
    }
  ],
  languages: ['English', 'French'],
  specialties: ['Compounding', 'Medication Therapy Management'],
  workingHours: [
    {
      day: 'Monday',
      startTime: '08:00',
      endTime: '18:00',
      isClosed: false,
    },
    {
      day: 'Tuesday',
      startTime: '08:00',
      endTime: '18:00',
      isClosed: false,
    },
    {
      day: 'Wednesday',
      startTime: '08:00',
      endTime: '18:00',
      isClosed: false,
    },
    {
      day: 'Thursday',
      startTime: '08:00',
      endTime: '18:00',
      isClosed: false,
    },
    {
      day: 'Friday',
      startTime: '08:00',
      endTime: '18:00',
      isClosed: false,
    },
    {
      day: 'Saturday',
      startTime: '09:00',
      endTime: '17:00',
      isClosed: false,
    },
    {
      day: 'Sunday',
      startTime: '10:00',
      endTime: '16:00',
      isClosed: true,
    },
  ],
  status: 'active',
  rating: 4.7,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-03-20T15:30:00Z',
};

export const mockInventory = [
  {
    id: 'inv_001',
    name: 'Aspirin 100mg',
    genericName: 'Acetylsalicylic Acid',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '100mg',
    manufacturer: 'Bayer',
    quantity: 500,
    unit: 'tablets',
    price: 5.99,
    cost: 3.50,
    expiryDate: '2025-12-31',
    reorderLevel: 100,
    location: 'Shelf A1',
    isActive: true,
    description: 'Over-the-counter pain reliever and fever reducer',
    sideEffects: ['Stomach upset', 'Bleeding risk'],
    interactions: ['Blood thinners', 'Other NSAIDs'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z'
  },
  {
    id: 'inv_002',
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    category: 'Blood Pressure',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'AstraZeneca',
    quantity: 200,
    unit: 'tablets',
    price: 15.99,
    cost: 8.75,
    expiryDate: '2025-06-30',
    reorderLevel: 50,
    location: 'Shelf B2',
    isActive: true,
    description: 'ACE inhibitor for treating high blood pressure',
    sideEffects: ['Dry cough', 'Dizziness', 'Fatigue'],
    interactions: ['Diuretics', 'Lithium', 'NSAIDs'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z'
  },
  {
    id: 'inv_003',
    name: 'Metformin 500mg',
    genericName: 'Metformin',
    category: 'Diabetes',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Merck',
    quantity: 300,
    unit: 'tablets',
    price: 12.99,
    cost: 6.25,
    expiryDate: '2025-09-15',
    reorderLevel: 75,
    location: 'Shelf C3',
    isActive: true,
    description: 'Oral diabetes medicine for type 2 diabetes',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
    interactions: ['Alcohol', 'Contrast dye', 'Other diabetes medications'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z'
  },
  {
    id: 'inv_004',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '250mg',
    manufacturer: 'Pfizer',
    quantity: 150,
    unit: 'capsules',
    price: 8.99,
    cost: 4.50,
    expiryDate: '2024-12-31',
    reorderLevel: 25,
    location: 'Shelf D4',
    isActive: true,
    description: 'Penicillin antibiotic for bacterial infections',
    sideEffects: ['Diarrhea', 'Nausea', 'Rash'],
    interactions: ['Probenecid', 'Allopurinol', 'Oral contraceptives'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z'
  }
];

export const mockPrescriptions = [
  {
    id: 'pres_001',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    medications: [
      {
        id: 'med_001',
        name: 'Lisinopril 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning with or without food',
        quantity: 30,
        refills: 3
      }
    ],
    diagnosis: 'Hypertension',
    status: 'pending',
    priority: 'normal',
    prescribedDate: '2024-03-20T10:00:00Z',
    expiryDate: '2024-04-20T10:00:00Z',
    notes: 'Monitor blood pressure regularly',
    isActive: true,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 'pres_002',
    patientId: '3',
    patientName: 'Jane Wilson',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    medications: [
      {
        id: 'med_002',
        name: 'Metformin 500mg',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take with meals to reduce stomach upset',
        quantity: 60,
        refills: 2
      }
    ],
    diagnosis: 'Type 2 Diabetes',
    status: 'dispensed',
    priority: 'normal',
    prescribedDate: '2024-03-19T14:30:00Z',
    expiryDate: '2024-04-19T14:30:00Z',
    notes: 'Start with low dose and increase gradually',
    isActive: true,
    createdAt: '2024-03-19T14:30:00Z',
    updatedAt: '2024-03-20T09:00:00Z'
  },
  {
    id: 'pres_003',
    patientId: '4',
    patientName: 'Mike Johnson',
    doctorId: '5',
    doctorName: 'Dr. Robert Brown',
    medications: [
      {
        id: 'med_003',
        name: 'Amoxicillin 250mg',
        dosage: '250mg',
        frequency: 'Three times daily',
        duration: '10 days',
        instructions: 'Take on empty stomach',
        quantity: 30,
        refills: 0
      }
    ],
    diagnosis: 'Bacterial Infection',
    status: 'pending',
    priority: 'high',
    prescribedDate: '2024-03-20T16:00:00Z',
    expiryDate: '2024-03-30T16:00:00Z',
    notes: 'Complete full course of antibiotics',
    isActive: true,
    createdAt: '2024-03-20T16:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z'
  }
];

export const mockNotifications = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Aspirin 100mg is running low. Current stock: 50 tablets',
    type: 'inventory_alert',
    isRead: false,
    priority: 'medium',
    createdAt: '2024-03-20T15:30:00Z'
  },
  {
    id: '2',
    title: 'New Prescription',
    message: 'New prescription received for patient John Doe',
    type: 'prescription',
    isRead: false,
    priority: 'normal',
    createdAt: '2024-03-20T15:00:00Z'
  },
  {
    id: '3',
    title: 'Expiry Warning',
    message: 'Amoxicillin 250mg expires in 30 days',
    type: 'expiry_warning',
    isRead: true,
    priority: 'low',
    createdAt: '2024-03-20T14:30:00Z'
  },
  {
    id: '4',
    title: 'Order Confirmed',
    message: 'Order #ORD-2024-001 has been confirmed and shipped',
    type: 'order_update',
    isRead: false,
    priority: 'normal',
    createdAt: '2024-03-20T14:00:00Z'
  }
];

export const mockStats = {
  totalPrescriptions: 156,
  pendingPrescriptions: 23,
  dispensedToday: 12,
  totalInventory: 1250,
  lowStockItems: 8,
  expiringSoon: 15,
  monthlyRevenue: 15420.50,
  averageOrderValue: 45.30,
  customerSatisfaction: 4.8,
  prescriptionAccuracy: 99.2,
  inventoryTurnover: 3.2,
  topSellingMedication: 'Lisinopril 10mg',
  totalCustomers: 89,
  newCustomersThisMonth: 12
}; 