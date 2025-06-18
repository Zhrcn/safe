export const users = [
  {
    id: '1',
    username: 'patient1',
    password: 'password123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'patient',
    profile: {
      avatar: null,
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      conditions: ['Hypertension'],
      medications: ['Lisinopril'],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891'
      }
    }
  },
  {
    id: '2',
    username: 'doctor1',
    password: 'password123',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@example.com',
    role: 'doctor',
    profile: {
      avatar: null,
      phone: '+1234567892',
      specialization: 'Cardiology',
      license: 'MD123456',
      yearsOfExperience: 10,
      education: [
        {
          degree: 'MD',
          institution: 'Harvard Medical School',
          year: 2010
        }
      ],
      certifications: ['Board Certified in Cardiology'],
      languages: ['English', 'Spanish'],
      availability: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' }
      }
    }
  },
  {
    id: '3',
    username: 'pharmacist1',
    password: 'password123',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'pharmacist',
    profile: {
      avatar: null,
      phone: '+1234567893',
      license: 'PH123456',
      yearsOfExperience: 8,
      education: [
        {
          degree: 'PharmD',
          institution: 'University of California',
          year: 2012
        }
      ],
      certifications: ['Board Certified Pharmacist'],
      languages: ['English', 'French'],
      pharmacy: {
        name: 'City Pharmacy',
        address: '456 Oak St',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        phone: '+1234567894'
      }
    }
  }
]; 