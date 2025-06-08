const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentById,
  updateAppointmentDetails // Added this
} = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');


router.post(
  '/',
  protect,
  authorize('patient'),
  createAppointment
);

// Route for patients and doctors to get their appointments
// @route   GET /api/v1/appointments
// @desc    Get appointments for the logged-in user
// @access  Private (Patient or Doctor)
router.get(
  '/',
  protect,
  authorize('patient', 'doctor'), // Allows both roles
  getAppointments
);

// Route for patients or doctors to update an appointment's status
// @route   PATCH /api/v1/appointments/:id/status
// @desc    Update status of a specific appointment
// @access  Private (Patient or Doctor involved in appointment)
router.patch(
  '/:id/status',
  protect,
  authorize('patient', 'doctor'), // Controller handles specific logic
  updateAppointmentStatus
);

// Route for patients or doctors to get a single appointment by ID
// @route   GET /api/v1/appointments/:id
// @desc    Get details of a specific appointment
// @access  Private (Patient or Doctor involved in appointment)
router.get(
  '/:id',
  protect,
  authorize('patient', 'doctor'), // Controller handles specific logic
  getAppointmentById
);

// Route for patients to update their appointment details
// @route   PATCH /api/v1/appointments/:id
// @desc    Patient updates details of their appointment
// @access  Private (Patient only)
router.patch(
  '/:id',
  protect,
  authorize('patient'), // Only patients can update details
  updateAppointmentDetails
);

module.exports = router;
