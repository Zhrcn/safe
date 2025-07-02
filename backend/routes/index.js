const express = require('express');
const router = express.Router();
const authRoutes = require('../routes/auth.routes');
const patientRoutes = require('../routes/patient.routes');
const doctorRoutes = require('../routes/doctor.routes');
const pharmacistRoutes = require('../routes/pharmacist.routes');
const appointmentRoutes = require('../routes/appointment.routes'); 
const notificationRoutes = require('../routes/notification.routes');
const medicalFileRoutes = require('../routes/medicalFile.routes');
const consultationRoutes = require('../routes/consultation.routes');
const prescriptionRoutes = require('../routes/prescription.routes');
const medicineRoutes = require('../routes/medicine.routes');
const conversationRoutes = require('../routes/conversation.routes');

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/pharmacists', pharmacistRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/medical-files', medicalFileRoutes);
router.use('/medical-records', medicalFileRoutes);
router.use('/consultations', consultationRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/doctor/medicine', medicineRoutes);
router.use('/conversations', conversationRoutes);

router.get('/', (req, res) => {
  res.send('SAFE App Backend API v1');
});

module.exports = router;
