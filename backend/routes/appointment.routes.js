const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentById,
  updateAppointmentDetails,
  requestReschedule
} = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
router.post(
  '/',
  protect,
  authorize('patient'),
  createAppointment
);
router.get(
  '/',
  protect,
  authorize('patient', 'doctor'), 
  getAppointments
);
router.patch(
  '/:id/status',
  protect,
  authorize('patient', 'doctor'), 
  updateAppointmentStatus
);
router.get(
  '/:id',
  protect,
  authorize('patient', 'doctor'), 
  getAppointmentById
);
router.patch(
  '/:id',
  protect,
  authorize('patient'), 
  updateAppointmentDetails
);
router.post(
  '/:id/reschedule-request',
  protect,
  authorize('patient'),
  requestReschedule
);
module.exports = router;
