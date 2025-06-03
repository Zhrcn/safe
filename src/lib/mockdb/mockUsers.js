/**
 * Mock Users Data
 */

const mockUsers = [
    {
        _id: 'user_1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTJJp.yLiazXfrxvyNEBbUOrOktkLi', // admin123
        role: 'admin',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    },
    {
        _id: 'user_2',
        name: 'Dr. Laila Al-hassan',
        email: 'doctor@example.com',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTJJp.yLiazXfrxvyNEBbUOrOktkLi', // doctor123
        role: 'doctor',
        isActive: true,
        doctorProfile: {
            specialization: 'General Practice',
            licenseNumber: 'LIC12345',
            education: 'M.D. from Damascus University',
            experience: '15 years',
            hospitalAffiliation: 'City Hospital'
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    },
    {
        _id: 'user_3',
        name: 'Sarah Johnson',
        email: 'patient@example.com',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTJJp.yLiazXfrxvyNEBbUOrOktkLi', // patient123
        role: 'patient',
        isActive: true,
        patientProfile: {
            dateOfBirth: '1990-05-15',
            gender: 'Female',
            phoneNumber: '+963 11 123 4567',
            address: 'Damascus, Syria',
            emergencyContact: {
                name: 'John Johnson',
                relationship: 'Husband',
                phoneNumber: '+963 11 765 4321'
            },
            bloodType: 'O+',
            allergies: ['Penicillin'],
            chronicConditions: ['Hypertension']
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    },
    {
        _id: 'user_4',
        name: 'Pharmacist User',
        email: 'pharmacist@example.com',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTJJp.yLiazXfrxvyNEBbUOrOktkLi', // pharmacist123
        role: 'pharmacist',
        isActive: true,
        pharmacistProfile: {
            licenseNumber: 'PHARM12345',
            education: 'Pharm.D. from Aleppo University',
            experience: '8 years',
            pharmacyName: 'Central Pharmacy'
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    },
    {
        _id: 'user_5',
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTJJp.yLiazXfrxvyNEBbUOrOktkLi', // patient123
        role: 'patient',
        isActive: true,
        patientProfile: {
            dateOfBirth: '1978-08-23',
            gender: 'Male',
            phoneNumber: '+963 11 234 5678',
            address: 'Aleppo, Syria',
            emergencyContact: {
                name: 'Mary Smith',
                relationship: 'Wife',
                phoneNumber: '+963 11 876 5432'
            },
            bloodType: 'A+',
            allergies: ['Sulfa drugs'],
            chronicConditions: ['Diabetes Type 2']
        },
        createdAt: '2023-01-05T00:00:00.000Z',
        updatedAt: '2023-01-05T00:00:00.000Z'
    },
    {
        _id: 'user_6',
        name: 'Dr. Ahmad Rami',
        email: 'dr.rami@example.com',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTJJp.yLiazXfrxvyNEBbUOrOktkLi', // doctor123
        role: 'doctor',
        isActive: true,
        doctorProfile: {
            specialization: 'Cardiology',
            licenseNumber: 'LIC56789',
            education: 'M.D. from Cairo University',
            experience: '20 years',
            hospitalAffiliation: 'Heart Specialty Center'
        },
        createdAt: '2023-01-08T00:00:00.000Z',
        updatedAt: '2023-01-08T00:00:00.000Z'
    }
];

export default mockUsers; 