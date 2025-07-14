require('dotenv').config({ path: __dirname + '/../config/config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');

console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT
});

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for medical records seeding...'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomDateInLastYear = () => {
    const end = new Date();
    const start = new Date(end.getFullYear() - 1, 0, 1);
    return randomDate(start, end);
};

const generateVitalSigns = () => {
    return [
        {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 36.8,
            weight: 70,
            height: 175,
            bmi: 22.9,
            oxygenSaturation: 98,
            date: randomDateInLastYear(),
            notes: 'Normal vital signs'
        },
        {
            bloodPressure: '118/78',
            heartRate: 68,
            temperature: 36.6,
            weight: 69,
            height: 175,
            bmi: 22.5,
            oxygenSaturation: 99,
            date: randomDateInLastYear(),
            notes: 'Good health status'
        },
        {
            bloodPressure: '125/82',
            heartRate: 75,
            temperature: 37.1,
            weight: 71,
            height: 175,
            bmi: 23.2,
            oxygenSaturation: 97,
            date: randomDateInLastYear(),
            notes: 'Slight elevation in blood pressure'
        }
    ];
};

const generateAllergies = () => {
    const allergyTypes = [
        { name: 'Penicillin', severity: 'severe', reaction: 'Anaphylaxis', notes: 'Avoid all penicillin-based antibiotics' },
        { name: 'Peanuts', severity: 'moderate', reaction: 'Hives and swelling', notes: 'Carry epinephrine auto-injector' },
        { name: 'Dairy', severity: 'mild', reaction: 'Digestive discomfort', notes: 'Lactose intolerance' },
        { name: 'Sulfa drugs', severity: 'moderate', reaction: 'Skin rash', notes: 'Alternative antibiotics needed' },
        { name: 'Latex', severity: 'mild', reaction: 'Skin irritation', notes: 'Use latex-free products' }
    ];
    
    return allergyTypes.slice(0, Math.floor(Math.random() * 3) + 1).map(allergy => ({
        ...allergy,
        dateAdded: randomDateInLastYear()
    }));
};

const generateChronicConditions = () => {
    const conditions = [
        { name: 'Hypertension', status: 'managed', diagnosisDate: randomDateInLastYear(), notes: 'Controlled with medication' },
        { name: 'Type 2 Diabetes', status: 'managed', diagnosisDate: randomDateInLastYear(), notes: 'Diet and exercise management' },
        { name: 'Asthma', status: 'active', diagnosisDate: randomDateInLastYear(), notes: 'Inhaled corticosteroids prescribed' },
        { name: 'Hypothyroidism', status: 'managed', diagnosisDate: randomDateInLastYear(), notes: 'Levothyroxine therapy' },
        { name: 'Migraine', status: 'active', diagnosisDate: randomDateInLastYear(), notes: 'Triggers identified and avoided' }
    ];
    
    return conditions.slice(0, Math.floor(Math.random() * 2) + 1).map(condition => ({
        ...condition,
        dateAdded: randomDateInLastYear()
    }));
};

const generateDiagnoses = () => {
    const diagnoses = [
        { name: 'Upper Respiratory Infection', doctor: 'Dr. Ahmad Al-Assad', date: randomDateInLastYear(), notes: 'Viral infection, rest recommended' },
        { name: 'Gastritis', doctor: 'Dr. Fatima Al-Kurdi', date: randomDateInLastYear(), notes: 'Acid reflux, dietary changes advised' },
        { name: 'Anxiety Disorder', doctor: 'Dr. Omar Al-Halabi', date: randomDateInLastYear(), notes: 'Mild anxiety, counseling recommended' },
        { name: 'Seasonal Allergies', doctor: 'Dr. Layla Al-Homsi', date: randomDateInLastYear(), notes: 'Pollen allergy, antihistamines prescribed' }
    ];
    
    return diagnoses.slice(0, Math.floor(Math.random() * 2) + 1).map(diagnosis => ({
        ...diagnosis,
        dateAdded: randomDateInLastYear()
    }));
};

const generateLabResults = () => {
    const labTests = [
        {
            testName: 'Complete Blood Count (CBC)',
            labName: 'Al-Mouwasat Laboratory',
            date: randomDateInLastYear(),
            normalRange: '4.5-11.0 x10^9/L',
            unit: 'x10^9/L',
            results: { wbc: 7.2, rbc: 4.8, hemoglobin: 14.2, platelets: 250 },
            notes: 'All values within normal range'
        },
        {
            testName: 'Comprehensive Metabolic Panel',
            labName: 'Tishreen Medical Lab',
            date: randomDateInLastYear(),
            normalRange: '70-100 mg/dL',
            unit: 'mg/dL',
            results: { glucose: 95, creatinine: 0.9, bun: 15, sodium: 140, potassium: 4.0 },
            notes: 'Normal kidney and liver function'
        },
        {
            testName: 'Lipid Panel',
            labName: 'Al-Shami Laboratory',
            date: randomDateInLastYear(),
            normalRange: '<200 mg/dL',
            unit: 'mg/dL',
            results: { totalCholesterol: 180, hdl: 55, ldl: 100, triglycerides: 120 },
            notes: 'Good cholesterol levels'
        },
        {
            testName: 'Thyroid Function Test',
            labName: 'Ibn Al-Nafis Lab',
            date: randomDateInLastYear(),
            normalRange: '0.4-4.0 mIU/L',
            unit: 'mIU/L',
            results: { tsh: 2.1, t4: 1.2, t3: 3.1 },
            notes: 'Normal thyroid function'
        }
    ];
    
    return labTests.slice(0, Math.floor(Math.random() * 3) + 1).map(test => ({
        ...test,
        dateAdded: randomDateInLastYear()
    }));
};

const generateImagingReports = () => {
    const imagingTypes = [
        {
            type: 'Chest X-Ray',
            date: randomDateInLastYear(),
            images: [{ src: '/public/case1/case1_0012.dcm' }],
            notes: 'Normal cardiac silhouette, clear lung fields'
        },
        {
            type: 'Abdominal Ultrasound',
            date: randomDateInLastYear(),
            images: [{ src: '/public/case1/case1_0014.dcm' }],
            notes: 'Normal liver, gallbladder, and kidneys'
        },
        {
            type: 'CT Scan - Head',
            date: randomDateInLastYear(),
            images: [{ src: '/public/case1/case1_00120.dcm' }],
            notes: 'No acute intracranial abnormalities'
        },
        {
            type: 'MRI - Knee',
            date: randomDateInLastYear(),
            images: [{ src: '/public/case1/case1_008.dcm' }],
            notes: 'Mild degenerative changes, no acute injury'
        }
    ];
    
    return imagingTypes.slice(0, Math.floor(Math.random() * 2) + 1).map(imaging => ({
        ...imaging,
        dateAdded: randomDateInLastYear()
    }));
};

const generateMedications = () => {
    const medications = [
        {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            status: 'active',
            startDate: randomDateInLastYear(),
            prescribedBy: 'Dr. Ahmad Al-Assad',
            notes: 'For blood pressure control'
        },
        {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            status: 'active',
            startDate: randomDateInLastYear(),
            prescribedBy: 'Dr. Fatima Al-Kurdi',
            notes: 'For diabetes management'
        },
        {
            name: 'Albuterol Inhaler',
            dosage: '90mcg',
            frequency: 'As needed',
            status: 'active',
            startDate: randomDateInLastYear(),
            prescribedBy: 'Dr. Omar Al-Halabi',
            notes: 'For asthma symptoms'
        },
        {
            name: 'Levothyroxine',
            dosage: '50mcg',
            frequency: 'Once daily',
            status: 'active',
            startDate: randomDateInLastYear(),
            prescribedBy: 'Dr. Layla Al-Homsi',
            notes: 'For hypothyroidism'
        },
        {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'As needed',
            status: 'active',
            startDate: randomDateInLastYear(),
            prescribedBy: 'Dr. Ahmad Al-Assad',
            notes: 'For pain and inflammation'
        }
    ];
    
    return medications.slice(0, Math.floor(Math.random() * 3) + 1).map(med => ({
        ...med,
        dateAdded: randomDateInLastYear()
    }));
};

const generateImmunizations = () => {
    const vaccines = [
        { name: 'COVID-19 Vaccine', date: randomDateInLastYear(), administeredBy: 'Dr. Ahmad Al-Assad', notes: 'Pfizer-BioNTech, 2 doses' },
        { name: 'Influenza Vaccine', date: randomDateInLastYear(), administeredBy: 'Dr. Fatima Al-Kurdi', notes: 'Annual flu shot' },
        { name: 'Tetanus Booster', date: randomDateInLastYear(), administeredBy: 'Dr. Omar Al-Halabi', notes: 'Tdap vaccine' },
        { name: 'Hepatitis B Vaccine', date: randomDateInLastYear(), administeredBy: 'Dr. Layla Al-Homsi', notes: '3-dose series completed' }
    ];
    
    return vaccines.slice(0, Math.floor(Math.random() * 3) + 1).map(vaccine => ({
        ...vaccine,
        dateAdded: randomDateInLastYear()
    }));
};

const generateSurgicalHistory = () => {
    const surgeries = [
        { procedure: 'Appendectomy', date: randomDateInLastYear(), hospital: 'Al-Mouwasat University Hospital', notes: 'Laparoscopic procedure, recovery uneventful' },
        { procedure: 'Tonsillectomy', date: randomDateInLastYear(), hospital: 'Tishreen Military Hospital', notes: 'Recurrent tonsillitis, successful surgery' },
        { procedure: 'Cataract Surgery', date: randomDateInLastYear(), hospital: 'Al-Shami Hospital', notes: 'Right eye, improved vision' }
    ];
    
    return surgeries.slice(0, Math.floor(Math.random() * 2) + 1).map(surgery => ({
        ...surgery,
        dateAdded: randomDateInLastYear()
    }));
};

const generateDocuments = () => {
    const documents = [
        { title: 'Medical Certificate', type: 'Certificate', url: '/documents/medical-cert.pdf', date: randomDateInLastYear(), notes: 'Annual health check certificate' },
        { title: 'Insurance Form', type: 'Form', url: '/documents/insurance-form.pdf', date: randomDateInLastYear(), notes: 'Health insurance coverage form' },
        { title: 'Prescription Copy', type: 'Prescription', url: '/documents/prescription.pdf', date: randomDateInLastYear(), notes: 'Current medication prescription' }
    ];
    
    return documents.slice(0, Math.floor(Math.random() * 2) + 1).map(doc => ({
        ...doc,
        dateAdded: randomDateInLastYear()
    }));
};

const generateFamilyHistory = () => {
    const familyConditions = [
        { condition: 'Diabetes', relationship: 'Father', notes: 'Type 2 diabetes, diagnosed at age 50' },
        { condition: 'Hypertension', relationship: 'Mother', notes: 'Controlled with medication' },
        { condition: 'Heart Disease', relationship: 'Grandfather', notes: 'Myocardial infarction at age 65' },
        { condition: 'Cancer', relationship: 'Aunt', notes: 'Breast cancer, treated successfully' }
    ];
    
    return familyConditions.slice(0, Math.floor(Math.random() * 3) + 1).map(condition => ({
        ...condition,
        dateAdded: randomDateInLastYear()
    }));
};

const generateSocialHistory = () => {
    const socialAspects = [
        { aspect: 'Smoking', details: 'Former smoker, quit 5 years ago' },
        { aspect: 'Alcohol', details: 'Occasional social drinking' },
        { aspect: 'Exercise', details: 'Regular walking 3 times per week' },
        { aspect: 'Diet', details: 'Mediterranean diet, low sodium' },
        { aspect: 'Occupation', details: 'Office worker, sedentary job' }
    ];
    
    return socialAspects.slice(0, Math.floor(Math.random() * 4) + 1).map(aspect => ({
        ...aspect,
        dateAdded: randomDateInLastYear()
    }));
};

const generateGeneralHistory = () => {
    const historyQuestions = [
        { question: 'Do you have any allergies?', answer: 'Yes, penicillin and peanuts' },
        { question: 'Any chronic conditions?', answer: 'Hypertension and mild asthma' },
        { question: 'Current medications?', answer: 'Lisinopril and albuterol inhaler' },
        { question: 'Previous surgeries?', answer: 'Appendectomy in 2020' },
        { question: 'Family history of heart disease?', answer: 'Yes, grandfather had heart attack' }
    ];
    
    return historyQuestions.slice(0, Math.floor(Math.random() * 4) + 1).map(entry => ({
        ...entry,
        dateAdded: randomDateInLastYear()
    }));
};

const seedMedicalRecords = async () => {
    try {
        await MedicalRecord.deleteMany({});
        console.log('Cleared existing medical records');

        const patients = await User.find({ role: 'patient' });
        console.log(`Found ${patients.length} patients to seed medical records for`);

        if (patients.length === 0) {
            console.log('No patients found. Please run the main seed file first to create patients.');
            return;
        }

        const medicalRecords = [];

        for (const patient of patients) {
            const medicalRecord = {
                patientId: patient._id,
                vitalSigns: generateVitalSigns(),
                allergies: generateAllergies(),
                chronicConditions: generateChronicConditions(),
                diagnoses: generateDiagnoses(),
                labResults: generateLabResults(),
                imagingReports: generateImagingReports(),
                medications: generateMedications(),
                immunizations: generateImmunizations(),
                surgicalHistory: generateSurgicalHistory(),
                documents: generateDocuments(),
                familyHistory: generateFamilyHistory(),
                socialHistory: generateSocialHistory(),
                generalHistory: generateGeneralHistory(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            medicalRecords.push(medicalRecord);
        }

        const createdRecords = await MedicalRecord.insertMany(medicalRecords);
        console.log(`Successfully created ${createdRecords.length} medical records`);

        const totalVitalSigns = createdRecords.reduce((sum, record) => sum + record.vitalSigns.length, 0);
        const totalAllergies = createdRecords.reduce((sum, record) => sum + record.allergies.length, 0);
        const totalMedications = createdRecords.reduce((sum, record) => sum + record.medications.length, 0);
        const totalLabResults = createdRecords.reduce((sum, record) => sum + record.labResults.length, 0);

        console.log('\nMedical Records Statistics:');
        console.log(`- Total patients with medical records: ${createdRecords.length}`);
        console.log(`- Total vital signs entries: ${totalVitalSigns}`);
        console.log(`- Total allergies recorded: ${totalAllergies}`);
        console.log(`- Total medications: ${totalMedications}`);
        console.log(`- Total lab results: ${totalLabResults}`);

        console.log('\nMedical records seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding medical records:', error);
        process.exit(1);
    }
};

seedMedicalRecords(); 