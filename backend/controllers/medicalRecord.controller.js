const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const MedicalRecord = require('../models/MedicalRecord');
const ErrorResponse = require('../utils/errorResponse');
const { createNotification } = require('../utils/notification.utils');

const getMedicalRecords = asyncHandler(async (req, res) => {
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    res.status(200).json(new ApiResponse(200, medicalRecord, 'Medical records retrieved successfully.'));
});

const addVitalSigns = asyncHandler(async (req, res) => {
    const { bloodPressure, heartRate, temperature, weight, height, bmi, oxygenSaturation, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const vitalSign = {
        bloodPressure,
        heartRate,
        temperature,
        weight,
        height,
        bmi,
        oxygenSaturation,
        notes,
        date: new Date()
    };
    
    medicalRecord.vitalSigns.push(vitalSign);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, vitalSign, 'Vital signs added successfully.'));
});

const addAllergy = asyncHandler(async (req, res) => {
    const { name, severity, reaction, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const allergy = {
        name,
        severity,
        reaction,
        notes,
        dateAdded: new Date()
    };
    
    medicalRecord.allergies.push(allergy);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, allergy, 'Allergy added successfully.'));
});

const addChronicCondition = asyncHandler(async (req, res) => {
    const { name, status, diagnosisDate, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const condition = {
        name,
        status,
        diagnosisDate,
        notes,
        dateAdded: new Date()
    };
    
    medicalRecord.chronicConditions.push(condition);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, condition, 'Chronic condition added successfully.'));
});

const addDiagnosis = asyncHandler(async (req, res) => {
    const { name, doctor, date, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const diagnosis = {
        name,
        doctor,
        date,
        notes,
        dateAdded: new Date()
    };
    
    medicalRecord.diagnoses.push(diagnosis);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, diagnosis, 'Diagnosis added successfully.'));
});

const addLabResult = asyncHandler(async (req, res) => {
    const { testName, labName, date, normalRange, unit, results, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const labResult = {
        testName,
        labName,
        date,
        normalRange,
        unit,
        results,
        notes,
        dateAdded: new Date()
    };
    
    medicalRecord.labResults.push(labResult);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, labResult, 'Lab result added successfully.'));
});

const addImagingReport = asyncHandler(async (req, res) => {
    const { type, date, images, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const imagingReport = {
        type,
        date,
        images: images || [],
        notes,
        dateAdded: new Date()
    };
    
    medicalRecord.imagingReports.push(imagingReport);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, imagingReport, 'Imaging report added successfully.'));
});

const addMedication = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, status, startDate, endDate, prescribedBy, notes } = req.body;
    
    let medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        medicalRecord = await MedicalRecord.create({
            patientId: req.user._id
        });
    }
    
    const medication = {
        name,
        dosage,
        frequency,
        status,
        startDate,
        endDate,
        prescribedBy,
        notes,
        dateAdded: new Date()
    };
    
    medicalRecord.medications.push(medication);
    await medicalRecord.save();
    
    res.status(201).json(new ApiResponse(201, medication, 'Medication added successfully.'));
});

const updateRecordItem = asyncHandler(async (req, res) => {
    const { category, itemId } = req.params;
    const updateData = req.body;
    
    const medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        res.status(404);
        throw new Error('Medical record not found');
    }
    
    const categoryArray = medicalRecord[category];
    if (!categoryArray) {
        res.status(400);
        throw new Error('Invalid category');
    }
    
    const itemIndex = categoryArray.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
        res.status(404);
        throw new Error('Item not found');
    }
    
    categoryArray[itemIndex] = { ...categoryArray[itemIndex].toObject(), ...updateData };
    await medicalRecord.save();
    
    res.status(200).json(new ApiResponse(200, categoryArray[itemIndex], 'Record updated successfully.'));
});

const deleteRecordItem = asyncHandler(async (req, res) => {
    const { category, itemId } = req.params;
    
    const medicalRecord = await MedicalRecord.findOne({ patientId: req.user._id });
    
    if (!medicalRecord) {
        res.status(404);
        throw new Error('Medical record not found');
    }
    
    const categoryArray = medicalRecord[category];
    if (!categoryArray) {
        res.status(400);
        throw new Error('Invalid category');
    }
    
    const itemIndex = categoryArray.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
        res.status(404);
        throw new Error('Item not found');
    }
    
    categoryArray.splice(itemIndex, 1);
    await medicalRecord.save();
    
    res.status(200).json(new ApiResponse(200, null, 'Record deleted successfully.'));
});

module.exports = {
    getMedicalRecords,
    addVitalSigns,
    addAllergy,
    addChronicCondition,
    addDiagnosis,
    addLabResult,
    addImagingReport,
    addMedication,
    updateRecordItem,
    deleteRecordItem
}; 