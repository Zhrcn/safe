const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const doctorRoutes = require('./doctor.routes');
const pharmacistRoutes = require('./pharmacist.routes');
const appointmentRoutes = require('./appointment.routes'); 
const notificationRoutes = require('./notification.routes');


router.use('/auth', authRoutes);

router.use('/patients', patientRoutes);

router.use('/doctors', doctorRoutes);

router.use('/pharmacists', pharmacistRoutes);

router.use('/appointments', appointmentRoutes);

router.use('/notifications', notificationRoutes);


router.get('/', (req, res) => {
  res.send('SAFE App Backend API v1');
});

module.exports = router;
