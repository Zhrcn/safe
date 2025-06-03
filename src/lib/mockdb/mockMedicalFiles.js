/**
 * Mock Medical Files Data
 */

const mockMedicalFiles = {
    // Medical file for Sarah Johnson (user_3)
    'user_3': {
        _id: 'medical_file_1',
        patientId: 'user_3',
        basicInfo: {
            bloodType: 'O+',
            height: '165 cm',
            weight: '62 kg',
            allergies: ['Penicillin'],
            emergencyContact: {
                name: 'John Johnson',
                relationship: 'Husband',
                phone: '+963 11 765 4321'
            }
        },
        conditions: [
            {
                name: 'Hypertension',
                diagnosedDate: '2022-03-15',
                status: 'Active',
                notes: 'Mild hypertension, controlled with medication'
            }
        ],
        medications: [
            {
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                startDate: '2022-03-20',
                endDate: null,
                prescribedBy: 'Dr. Laila Al-hassan'
            },
            {
                name: 'Aspirin',
                dosage: '81mg',
                frequency: 'Once daily',
                startDate: '2022-03-20',
                endDate: null,
                prescribedBy: 'Dr. Laila Al-hassan'
            }
        ],
        vitalSigns: [
            {
                date: '2024-05-15',
                bloodPressure: '130/85',
                heartRate: '72',
                temperature: '98.6',
                respiratoryRate: '16',
                recordedBy: 'Dr. Laila Al-hassan'
            },
            {
                date: '2024-04-12',
                bloodPressure: '135/88',
                heartRate: '75',
                temperature: '98.4',
                respiratoryRate: '16',
                recordedBy: 'Dr. Laila Al-hassan'
            }
        ],
        labResults: [
            {
                date: '2024-05-15',
                name: 'Complete Blood Count',
                results: {
                    wbc: '7.5 x 10^9/L',
                    rbc: '4.8 x 10^12/L',
                    hemoglobin: '14.2 g/dL',
                    hematocrit: '42%',
                    platelets: '250 x 10^9/L'
                },
                notes: 'Within normal ranges',
                orderedBy: 'Dr. Laila Al-hassan'
            }
        ],
        immunizations: [
            {
                vaccine: 'Influenza',
                date: '2023-10-05',
                administeredBy: 'Central Clinic'
            },
            {
                vaccine: 'COVID-19',
                date: '2023-01-15',
                administeredBy: 'City Hospital'
            }
        ],
        procedures: [],
        notes: [
            {
                date: '2024-05-15',
                content: 'Patient reports feeling well. Blood pressure is well-controlled with current medication.',
                author: 'Dr. Laila Al-hassan'
            }
        ],
        createdAt: '2022-03-15T00:00:00.000Z',
        updatedAt: '2024-05-15T00:00:00.000Z'
    },

    // Medical file for John Smith (user_5)
    'user_5': {
        _id: 'medical_file_2',
        patientId: 'user_5',
        basicInfo: {
            bloodType: 'A+',
            height: '180 cm',
            weight: '85 kg',
            allergies: ['Sulfa drugs'],
            emergencyContact: {
                name: 'Mary Smith',
                relationship: 'Wife',
                phone: '+963 11 876 5432'
            }
        },
        conditions: [
            {
                name: 'Diabetes Type 2',
                diagnosedDate: '2021-08-10',
                status: 'Active',
                notes: 'Moderate diabetes, controlled with medication and diet'
            }
        ],
        medications: [
            {
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice daily with meals',
                startDate: '2021-08-15',
                endDate: null,
                prescribedBy: 'Dr. Laila Al-hassan'
            }
        ],
        vitalSigns: [
            {
                date: '2024-06-15',
                bloodPressure: '125/82',
                heartRate: '68',
                temperature: '98.4',
                respiratoryRate: '14',
                recordedBy: 'Dr. Laila Al-hassan'
            },
            {
                date: '2024-05-10',
                bloodPressure: '128/84',
                heartRate: '70',
                temperature: '98.6',
                respiratoryRate: '15',
                recordedBy: 'Dr. Laila Al-hassan'
            }
        ],
        labResults: [
            {
                date: '2024-06-15',
                name: 'Fasting Blood Glucose',
                results: {
                    glucose: '140 mg/dL'
                },
                notes: 'Slightly elevated',
                orderedBy: 'Dr. Laila Al-hassan'
            },
            {
                date: '2024-06-15',
                name: 'HbA1c',
                results: {
                    value: '6.8%'
                },
                notes: 'Improved since last check',
                orderedBy: 'Dr. Laila Al-hassan'
            }
        ],
        immunizations: [
            {
                vaccine: 'Influenza',
                date: '2023-10-12',
                administeredBy: 'Central Clinic'
            },
            {
                vaccine: 'COVID-19',
                date: '2023-02-10',
                administeredBy: 'City Hospital'
            }
        ],
        procedures: [
            {
                name: 'Eye Examination',
                date: '2024-03-15',
                notes: 'No diabetic retinopathy observed',
                performedBy: 'Dr. Noor Khalil'
            }
        ],
        notes: [
            {
                date: '2024-06-15',
                content: 'Patient reports following diet and exercise regimen. Blood glucose levels improving with current treatment.',
                author: 'Dr. Laila Al-hassan'
            }
        ],
        createdAt: '2021-08-15T00:00:00.000Z',
        updatedAt: '2024-06-15T00:00:00.000Z'
    }
};

export default mockMedicalFiles; 