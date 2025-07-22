const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
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
} = require('../controllers/doctorMedicalRecord.controller');

router.use(protect);
router.use(authorize('doctor'));

router.get('/:patientId', getPatientMedicalRecords);

router.post('/:patientId/vital-signs', addPatientVitalSigns);
router.post('/:patientId/allergies', addPatientAllergy);
router.post('/:patientId/chronic-conditions', addPatientChronicCondition);
router.post('/:patientId/diagnoses', addPatientDiagnosis);
router.post('/:patientId/lab-results', addPatientLabResult);
router.post('/:patientId/imaging-reports', addPatientImagingReport);
router.post('/:patientId/medications', addPatientMedication);
router.post('/:patientId/immunizations', addPatientImmunization);
router.post('/:patientId/surgical-history', addPatientSurgicalHistory);
router.post('/:patientId/documents', addPatientDocument);
router.post('/:patientId/family-history', addPatientFamilyHistory);
router.post('/:patientId/social-history', addPatientSocialHistory);
router.post('/:patientId/general-history', addPatientGeneralHistory);

router.put('/:patientId/:category/:itemId', updatePatientRecordItem);
router.delete('/:patientId/:category/:itemId', deletePatientRecordItem);

module.exports = router; 