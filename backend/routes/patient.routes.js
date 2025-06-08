const express = require('express');
const router = express.Router();

const {
  getPatientProfile,
  updatePatientProfile
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

// Other patient-specific routes can be added here later, for example:
// router.get('/appointments', getPatientAppointments);
// router.get('/medical-records/:recordId', viewMedicalRecordDetail);

module.exports = router;
