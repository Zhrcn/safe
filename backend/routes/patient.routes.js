const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getProfile,
    updateProfile,
    getMedicalFile,
    updateMedicalFile,
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    getConsultations,
    createConsultation,
    updateConsultation,
    getPrescriptions,
    getActivePrescriptions,
    getMessages,
    sendMessage,
    getDashboardSummary,
    getLatestVitals,
    getMyMedicalRecords,
} = require('../controllers/patient.controller');
const {
    getDoctors,
    getDoctor,
} = require('../controllers/doctor.controller');
const {
    getPharmacists,
    getPharmacist,
} = require('../controllers/pharmacist.controller');
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/medical-file', protect, getMedicalFile);
router.put('/medical-file', protect, updateMedicalFile);
router.get('/medical-records', protect, getMyMedicalRecords);
router.get('/appointments', protect, getAppointments);
router.post('/appointments', protect, createAppointment);
router.put('/appointments/:id', protect, updateAppointment);
router.delete('/appointments/:id', protect, deleteAppointment);
router.get('/medications', protect, getMedications);
router.post('/medications', protect, addMedication);
router.put('/medications/:id', protect, updateMedication);
router.delete('/medications/:id', protect, deleteMedication);
router.get('/consultations', protect, getConsultations);
router.post('/consultations', protect, createConsultation);
router.put('/consultations/:id', protect, updateConsultation);
router.get('/prescriptions', protect, getPrescriptions);
router.get('/prescriptions/active', protect, getActivePrescriptions);
router.get('/messages', protect, getMessages);
router.post('/messages', protect, sendMessage);
router.get('/doctors', protect, getDoctors);
router.get('/doctors/:id', protect, getDoctor);
router.get('/pharmacists', protect, getPharmacists);
router.get('/pharmacists/:id', protect, getPharmacist);
router.get('/dashboard/summary', protect, getDashboardSummary);
router.get('/vitals/latest', protect, getLatestVitals);
module.exports = router;
