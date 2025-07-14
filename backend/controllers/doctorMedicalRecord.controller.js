const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const MedicalFile = require('../models/MedicalFile');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
const { Types } = mongoose;

// Helper function to verify doctor has access to patient
const verifyDoctorPatientAccess = async (doctorId, patientId) => {
    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    const isInList = doctor.patientsList.some(pid => pid.toString() === patientId.toString());
    if (!isInList) {
        throw new Error('You can only manage medical records for patients in your patient list');
    }
    
    return doctor;
};

// Get patient medical records (for doctors)
const getPatientMedicalRecords = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    res.status(200).json(new ApiResponse(200, patient.medicalFile, 'Patient medical records retrieved successfully.'));
});

// Add vital signs to patient
const addPatientVitalSigns = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { bloodPressure, heartRate, temperature, weight, height, bmi, oxygenSaturation, notes } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
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
        date: new Date(),
        doctorId: doctorId
    };
    
    patient.medicalFile.vitalSigns.push(vitalSign);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, vitalSign, 'Vital signs added successfully.'));
});

// Add allergy to patient
const addPatientAllergy = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { name, severity, reaction, notes } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const allergy = {
        _id: new Types.ObjectId(),
        name,
        severity,
        reaction,
        notes,
        doctorId: doctorId
    };
    
    patient.medicalFile.allergies.push(allergy);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, allergy, 'Allergy added successfully.'));
});

// Add chronic condition to patient
const addPatientChronicCondition = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { name, status, diagnosisDate, notes } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const condition = {
        _id: new Types.ObjectId(),
        name,
        status,
        diagnosisDate,
        notes,
        doctorId: doctorId
    };
    
    patient.medicalFile.chronicConditions.push(condition);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, condition, 'Chronic condition added successfully.'));
});

// Add diagnosis to patient
const addPatientDiagnosis = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { conditionName, diagnosedBy, date, notes, treatmentPlan, status } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const diagnosis = {
        _id: new Types.ObjectId(),
        conditionName,
        doctorId: doctorId,
        diagnosedBy: doctorId,
        date: date || new Date(),
        notes,
        treatmentPlan,
        status: status || 'active'
    };
    
    patient.medicalFile.diagnoses.push(diagnosis);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, diagnosis, 'Diagnosis added successfully.'));
});

// Add lab result to patient
const addPatientLabResult = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { testName, labName, date, normalRange, unit, results, notes, documents } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const labResult = {
        _id: new Types.ObjectId(),
        testName,
        date: date || new Date(),
        results,
        normalRange,
        unit,
        labName,
        doctorId: doctorId,
        documents: documents || []
    };
    
    patient.medicalFile.labResults.push(labResult);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, labResult, 'Lab result added successfully.'));
});

// Add imaging report to patient
const addPatientImagingReport = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { type, date, images, notes, findings, location } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const imagingReport = {
        _id: new Types.ObjectId(),
        type,
        date: date || new Date(),
        findings,
        location,
        doctorId: doctorId,
        images: images || []
    };
    
    patient.medicalFile.imagingReports.push(imagingReport);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, imagingReport, 'Imaging report added successfully.'));
});

// Add medication to patient
const addPatientMedication = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { name, dose, frequency, route, startDate, endDate, active, instructions } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const medication = {
        _id: new Types.ObjectId(),
        name,
        dose,
        frequency,
        route,
        startDate: startDate || new Date(),
        endDate,
        active: active !== undefined ? active : true,
        instructions,
        prescribedBy: doctorId,
        doctorId: doctorId
    };
    
    patient.medicalFile.medicationHistory.push(medication);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, medication, 'Medication added successfully.'));
});

// Add immunization to patient
const addPatientImmunization = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { name, dateAdministered, nextDoseDate, manufacturer, batchNumber, administeredBy } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const immunization = {
        _id: new Types.ObjectId(),
        name,
        dateAdministered: dateAdministered || new Date(),
        nextDoseDate,
        manufacturer,
        batchNumber,
        administeredBy,
        doctorId: doctorId
    };
    
    patient.medicalFile.immunizations.push(immunization);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, immunization, 'Immunization added successfully.'));
});

// Add surgical history to patient
const addPatientSurgicalHistory = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { name, date, hospital, surgeon, notes, complications, outcome } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const surgicalHistory = {
        _id: new Types.ObjectId(),
        name,
        date: date || new Date(),
        hospital,
        surgeon,
        notes,
        complications,
        outcome,
        doctorId: doctorId
    };
    
    patient.medicalFile.surgicalHistory.push(surgicalHistory);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, surgicalHistory, 'Surgical history added successfully.'));
});

// Add document to patient
const addPatientDocument = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { title, type, url, tags } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const document = {
        _id: new Types.ObjectId(),
        title,
        type,
        url,
        uploadDate: new Date(),
        tags: tags || [],
        doctorId: doctorId
    };
    
    patient.medicalFile.attachedDocuments.push(document);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, document, 'Document added successfully.'));
});

// Add family history to patient
const addPatientFamilyHistory = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { relation, condition, notes } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const familyHistory = {
        _id: new Types.ObjectId(),
        relation,
        condition,
        notes,
        doctorId: doctorId
    };
    
    patient.medicalFile.familyMedicalHistory.push(familyHistory);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, familyHistory, 'Family history added successfully.'));
});

// Add social history to patient
const addPatientSocialHistory = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { smokingStatus, alcoholUse, occupation, livingSituation } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    // Update social history (it's a single object, not an array)
    patient.medicalFile.socialHistory = {
        smokingStatus,
        alcoholUse,
        occupation,
        livingSituation,
        doctorId: doctorId,
        lastUpdated: new Date()
    };
    
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, patient.medicalFile.socialHistory, 'Social history updated successfully.'));
});

// Add general history to patient
const addPatientGeneralHistory = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { visitReason, diagnosisSummary, treatmentSummary, notes } = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const generalHistory = {
        _id: new Types.ObjectId(),
        date: new Date(),
        doctorId: doctorId,
        visitReason,
        diagnosisSummary,
        treatmentSummary,
        notes
    };
    
    patient.medicalFile.generalMedicalHistory.push(generalHistory);
    await patient.medicalFile.save();
    
    res.status(201).json(new ApiResponse(201, generalHistory, 'General history added successfully.'));
});

// Update record item (only if created by the doctor)
const updatePatientRecordItem = asyncHandler(async (req, res) => {
    const { patientId, category, itemId } = req.params;
    const updateData = req.body;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const categoryArray = patient.medicalFile[category];
    if (!categoryArray) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid category'));
    }
    
    if (!itemId || itemId === 'undefined') {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid item ID'));
    }
    
    const itemIndex = categoryArray.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
        return res.status(404).json(new ApiResponse(404, null, 'Item not found'));
    }
    
    const item = categoryArray[itemIndex];
    if (!item) {
        return res.status(404).json(new ApiResponse(404, null, 'Item not found'));
    }
    const recordDoctorId = item.doctorId || item.diagnosedBy || item.prescribedBy;
    if (recordDoctorId && doctorId) {
        if (recordDoctorId.toString() !== doctorId.toString()) {
            return res.status(403).json(new ApiResponse(403, null, 'You can only edit records you created'));
        }
    }
    
    categoryArray[itemIndex] = { ...item.toObject(), ...updateData };
    await patient.medicalFile.save();
    
    res.status(200).json(new ApiResponse(200, categoryArray[itemIndex], 'Record updated successfully.'));
});

// Delete record item (only if created by the doctor)
const deletePatientRecordItem = asyncHandler(async (req, res) => {
    const { patientId, category, itemId } = req.params;
    const doctorId = req.user._id;
    
    await verifyDoctorPatientAccess(doctorId, patientId);
    
    // Find patient and get their medical file
    const patient = await Patient.findById(patientId).populate('medicalFile');
    
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
    }
    
    if (!patient.medicalFile) {
        return res.status(404).json(new ApiResponse(404, null, 'Medical file not found for patient.'));
    }
    
    const categoryArray = patient.medicalFile[category];
    if (!categoryArray) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid category'));
    }
    
    if (!itemId || itemId === 'undefined') {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid item ID'));
    }
    
    const itemIndex = categoryArray.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
        return res.status(404).json(new ApiResponse(404, null, 'Item not found'));
    }
    
    const item = categoryArray[itemIndex];
    if (!item) {
        return res.status(404).json(new ApiResponse(404, null, 'Item not found'));
    }
    const recordDoctorId = item.doctorId || item.diagnosedBy || item.prescribedBy;
    if (recordDoctorId && doctorId) {
        if (recordDoctorId.toString() !== doctorId.toString()) {
            return res.status(403).json(new ApiResponse(403, null, 'You can only delete records you created'));
        }
    }
    
    categoryArray.splice(itemIndex, 1);
    await patient.medicalFile.save();
    
    res.status(200).json(new ApiResponse(200, null, 'Record deleted successfully.'));
});

module.exports = {
    getPatientMedicalRecords,
    addPatientVitalSigns,
    addPatientAllergy,
    addPatientChronicCondition,
    addPatientDiagnosis,
    addPatientLabResult,
    addPatientImagingReport,
    addPatientMedication,
    addPatientImmunization,
    addPatientSurgicalHistory,
    addPatientDocument,
    addPatientFamilyHistory,
    addPatientSocialHistory,
    addPatientGeneralHistory,
    updatePatientRecordItem,
    deletePatientRecordItem
}; 