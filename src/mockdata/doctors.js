export const doctors = [
  {
    id: '1',
    user: {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phoneNumber: '0987654321',
      age: 35,
      address: '456 Doctor St',
      profileImage: '/doctors/doctor1.jpg',
      gender: 'female',
      isActive: true,
      role: 'doctor',
      isVerified: true,
      lastLogin: '2024-03-20T15:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-20T15:30:00Z',
    },
    medicalLicenseNumber: 'MD123456',
    specialty: 'Cardiology',
    experienceYears: 10,
    education: [
      {
        degree: 'MD',
        institution: 'Harvard Medical School',
        yearCompleted: 2010,
      },
      {
        degree: 'Cardiology Fellowship',
        institution: 'Johns Hopkins Hospital',
        yearCompleted: 2012,
      }
    ],
    achievements: ['Board Certified in Cardiology'],
    patientsList: ['1', '2'], 
    experience: [
      {
        title: 'Cardiologist',
        institution: {
          name: 'General Hospital',
          address: '123 Hospital St',
        },
        startDate: '2010-01-01T00:00:00Z',
        endDate: '2020-01-01T00:00:00Z',
        description: 'Worked as a cardiologist',
      },
    ],
    currentHospitalAffiliation: {
      name: 'City Hospital',
      address: '789 Hospital Ave',
      phoneNumber: '5551234567',
    },
    rating: 4.8,
    languages: ['English', 'Spanish'],
    availability: {
      monday: ['9:00 AM', '2:00 PM'],
      wednesday: ['10:00 AM', '3:00 PM'],
      friday: ['9:00 AM', '1:00 PM']
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
  },
  {
    id: '2',
    user: {
      id: '5',
      firstName: 'Michael',
      lastName: 'Chen',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      phoneNumber: '1234567890',
      age: 42,
      address: '789 Doctor Ave',
      profileImage: '/doctors/doctor2.jpg',
      gender: 'male',
      isActive: true,
      role: 'doctor',
      isVerified: true,
      lastLogin: '2024-03-20T14:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-20T14:30:00Z',
    },
    medicalLicenseNumber: 'MD789012',
    specialty: 'Dermatology',
    experienceYears: 12,
    education: [
      {
        degree: 'MD',
        institution: 'Stanford Medical School',
        yearCompleted: 2010,
      },
      {
        degree: 'Dermatology Residency',
        institution: 'UCLA Medical Center',
        yearCompleted: 2014,
      }
    ],
    achievements: ['Board Certified in Dermatology'],
    patientsList: ['1'], 
    experience: [
      {
        title: 'Dermatologist',
        institution: {
          name: 'Medical Center',
          address: '456 Medical Ave',
        },
        startDate: '2014-01-01T00:00:00Z',
        endDate: null,
        description: 'Currently working as a dermatologist',
      },
    ],
    currentHospitalAffiliation: {
      name: 'Medical Center',
      address: '456 Medical Ave',
      phoneNumber: '5559876543',
    },
    rating: 4.9,
    languages: ['English', 'Mandarin'],
    availability: {
      tuesday: ['9:00 AM', '4:00 PM'],
      thursday: ['10:00 AM', '3:00 PM']
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  {
    id: '3',
    user: {
      id: '6',
      firstName: 'Emily',
      lastName: 'Brown',
      name: 'Dr. Emily Brown',
      email: 'emily.brown@example.com',
      phoneNumber: '5551234567',
      age: 38,
      address: '321 Doctor Blvd',
      profileImage: '/doctors/doctor3.jpg',
      gender: 'female',
      isActive: true,
      role: 'doctor',
      isVerified: true,
      lastLogin: '2024-03-20T16:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-20T16:00:00Z',
    },
    medicalLicenseNumber: 'MD345678',
    specialty: 'Pediatrics',
    experienceYears: 8,
    education: [
      {
        degree: 'MD',
        institution: 'Yale Medical School',
        yearCompleted: 2012,
      },
      {
        degree: 'Pediatrics Residency',
        institution: 'Children\'s Hospital',
        yearCompleted: 2016,
      }
    ],
    achievements: ['Board Certified in Pediatrics'],
    patientsList: ['1'], 
    experience: [
      {
        title: 'Pediatrician',
        institution: {
          name: 'Children\'s Hospital',
          address: '789 Children St',
        },
        startDate: '2016-01-01T00:00:00Z',
        endDate: null,
        description: 'Currently working as a pediatrician',
      },
    ],
    currentHospitalAffiliation: {
      name: 'Children\'s Hospital',
      address: '789 Children St',
      phoneNumber: '5553456789',
    },
    rating: 4.7,
    languages: ['English', 'French'],
    availability: {
      monday: ['8:00 AM', '5:00 PM'],
      wednesday: ['8:00 AM', '5:00 PM'],
      friday: ['8:00 AM', '5:00 PM']
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z',
  }
]; 