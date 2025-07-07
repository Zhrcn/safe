# Database Seeding Guide

This directory contains scripts to populate the SAFE Medical Health Platform database with sample data.

## Available Seed Scripts

### 1. Main Seed Script (`seed.js`)
Populates the database with all basic entities:
- Users (Admin, Doctors, Patients, Pharmacists)
- Medical Files
- Appointments
- Consultations
- Prescriptions
- Medicines
- Conversations
- Notifications

**Usage:**
```bash
cd backend/seeders
node seed.js
```

### 2. Medical Records Seed Script (`addMedicalRecords.js`)
Populates the database with comprehensive patient medical records:
- Vital Signs
- Allergies
- Chronic Conditions
- Diagnoses
- Lab Results
- Imaging Reports
- Medications
- Immunizations
- Surgical History
- Documents
- Family History
- Social History
- General Medical History

**Usage:**
```bash
cd backend/seeders
node addMedicalRecords.js
```

### 3. Medical Records Runner (`runMedicalRecordsSeed.js`)
Simple runner script for medical records seeding.

**Usage:**
```bash
cd backend/seeders
node runMedicalRecordsSeed.js
```

### 4. Appointments Seed Script (`addAppointments.js`)
Adds sample appointments to the database.

**Usage:**
```bash
cd backend/seeders
node addAppointments.js
```

## Seeding Order

For a complete database setup, run the scripts in this order:

1. **First, run the main seed:**
   ```bash
   node seed.js
   ```

2. **Then, run the medical records seed:**
   ```bash
   node addMedicalRecords.js
   ```

3. **Optionally, add appointments:**
   ```bash
   node addAppointments.js
   ```

## Prerequisites

- MongoDB connection string must be configured in `config/config.env`
- Node.js and npm must be installed
- All required dependencies must be installed (`npm install` in backend directory)

## Sample Data Generated

### Medical Records Include:
- **Vital Signs**: Blood pressure, heart rate, temperature, weight, height, BMI, oxygen saturation
- **Allergies**: Common allergies like penicillin, peanuts, dairy, sulfa drugs, latex
- **Chronic Conditions**: Hypertension, diabetes, asthma, hypothyroidism, migraines
- **Diagnoses**: Various medical diagnoses with doctor information
- **Lab Results**: CBC, metabolic panel, lipid panel, thyroid function tests
- **Imaging Reports**: X-rays, ultrasounds, CT scans, MRIs
- **Medications**: Common medications with dosages and prescribing information
- **Immunizations**: COVID-19, flu, tetanus, hepatitis B vaccines
- **Surgical History**: Common procedures like appendectomy, tonsillectomy
- **Documents**: Medical certificates, insurance forms, prescriptions
- **Family History**: Genetic conditions in family members
- **Social History**: Smoking, alcohol, exercise, diet, occupation
- **General History**: Medical history questions and answers

### Data Characteristics:
- Realistic Syrian names and locations
- Syrian hospitals and medical facilities
- Dates within the last year
- Varied severity levels for conditions
- Multiple entries per category for comprehensive testing

## Environment Variables

Make sure your `config/config.env` file contains:
```
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Troubleshooting

### Common Issues:

1. **"No patients found" error:**
   - Run the main seed script first to create patients
   - Ensure the User model has patients with role='patient'

2. **MongoDB connection error:**
   - Check your MONGO_URI in config.env
   - Ensure MongoDB is running and accessible

3. **Permission errors:**
   - Make sure you have write permissions to the database
   - Check if the database user has appropriate roles

### Logs:
- The scripts provide detailed console output
- Check for any error messages in the console
- Statistics are displayed after successful seeding

## Notes

- All existing data will be cleared before seeding
- Each patient will get a unique medical record
- Data is randomized to provide variety
- Dates are set within the last year for relevance
- Syrian context is maintained throughout the data 