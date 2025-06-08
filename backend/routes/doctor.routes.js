// backend/routes/doctor.routes.js
const express = require('express');
const router = express.Router();

const {
  getDoctorProfile,
  updateDoctorProfile
} = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes below are protected and accessible only by users with the 'doctor' role.
router.use(protect);
router.use(authorize('doctor'));

// @route   GET /api/v1/doctors/profile
// @route   PATCH /api/v1/doctors/profile
router
  .route('/profile')
  .get(getDoctorProfile)
  .patch(updateDoctorProfile);

// Future doctor-specific routes:
// router.get('/appointments', getDoctorAppointments);
// router.patch('/appointments/:appointmentId/status', updateAppointmentStatus);
// router.get('/patients', getLinkedPatients); // List of patients linked to this doctor
// router.get('/patients/:patientId/medical-summary', getPatientMedicalSummaryForDoctor);
// router.post('/availability', updateDoctorAvailability); // More complex availability management

module.exports = router;
