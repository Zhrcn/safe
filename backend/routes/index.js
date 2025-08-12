const express = require('express');
const router = express.Router();
const authRoutes = require('../routes/auth.routes');
const patientRoutes = require('../routes/patient.routes');
const doctorRoutes = require('../routes/doctor.routes');
const pharmacistRoutes = require('../routes/pharmacist.routes');
const appointmentRoutes = require('../routes/appointment.routes'); 
const notificationRoutes = require('../routes/notification.routes');
const medicalFileRoutes = require('../routes/medicalFile.routes');
const medicalRecordRoutes = require('../routes/medicalRecord.routes');
const doctorMedicalRecordRoutes = require('../routes/doctorMedicalRecord.routes');
const consultationRoutes = require('../routes/consultation.routes');
const prescriptionRoutes = require('../routes/prescription.routes');
const medicineRoutes = require('../routes/medicine.routes');
const medicationRoutes = require('../routes/medication.routes');
const conversationRoutes = require('../routes/conversation.routes');
const logRoutes = require('../routes/log.routes');
const uploadRoutes = require('../routes/upload.routes');
const medicineRequestRoutes = require('../routes/medicineRequest.routes');
const distributorRoutes = require('../routes/distributor.routes');
const orderRoutes = require('../routes/order.routes');
const referralRoutes = require('../routes/referral.routes');

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/pharmacists', pharmacistRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/medical-files', medicalFileRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/doctor-medical-records', doctorMedicalRecordRoutes);
router.use('/consultations', consultationRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medicines', medicineRoutes);
router.use('/medications', medicationRoutes);
router.use('/conversations', conversationRoutes);
router.use('/logs', logRoutes);
router.use('/users', require('../routes/user.routes'));
router.use('/upload', uploadRoutes);
router.use('/medicine-requests', medicineRequestRoutes);
router.use('/distributors', distributorRoutes);
router.use('/orders', orderRoutes);
router.use('/referrals', referralRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SAFE Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

router.get('/', (req, res) => {
  res.send('SAFE App Backend API v1');
});

module.exports = router;
