const express = require('express');
const router = express.Router();

const {
  getPatientProfile,
  updatePatientProfile,
  getDashboardData,
  getUpcomingAppointments,
  getActiveMedications,
  getVitalSigns,
  getHealthMetrics
} = require('../controllers/patient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes below are protected and accessible only by users with the 'patient' role.
// The 'protect' middleware runs first, then 'authorize'.
router.use(protect);
router.use(authorize('patient')); // Ensures only patients can access these routes

// @route   GET /api/v1/patients/profile
// @route   PATCH /api/v1/patients/profile
router
  .route('/profile')
  .get(getPatientProfile)
  .patch(updatePatientProfile);

// Dashboard routes
router.get('/dashboard', getDashboardData);
router.get('/appointments/upcoming', getUpcomingAppointments);
router.get('/medications/active', getActiveMedications);
router.get('/vital-signs', getVitalSigns);
router.get('/health-metrics', getHealthMetrics);

// Other patient-specific routes can be added here later, for example:
// router.get('/appointments', getPatientAppointments);
// router.get('/medical-records/:recordId', viewMedicalRecordDetail);

module.exports = router;
