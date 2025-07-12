const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctor,
  getDoctors,
  getDoctorPatients,
  getDoctorPatientById,
  addPatientById
} = require('../controllers/doctor.controller');
const { 
  getDoctorAppointments, 
  acceptAppointment, 
  rejectAppointment, 
  updateAppointment, 
  getAppointmentDetails,
  handleRescheduleRequest
} = require('../controllers/Doctor/doctorAppointment.controller');
const {
  getDashboardAnalytics,
  getComprehensiveAnalytics,
  getAppointmentsAnalytics,
  getPatientDistribution,
  getRecentAppointments,
  getAppointmentsByDate
} = require('../controllers/Doctor/dashboardAnalytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getDoctors);
router.get('/patients', authorize('doctor'), getDoctorPatients);
router.get('/patients/:id', authorize('doctor'), getDoctorPatientById);
// Dashboard Analytics Routes
router.get('/dashboard/analytics', authorize('doctor'), getDashboardAnalytics);
router.get('/analytics/comprehensive', authorize('doctor'), getComprehensiveAnalytics);
router.get('/appointments/analytics', authorize('doctor'), getAppointmentsAnalytics);
router.get('/patients/distribution', authorize('doctor'), getPatientDistribution);
router.get('/appointments/recent', authorize('doctor'), getRecentAppointments);
router.get('/appointments/date/:date', authorize('doctor'), getAppointmentsByDate);

// Appointment Routes
router.get('/appointments', authorize('doctor'), getDoctorAppointments);
router.get('/appointments/:appointmentId', authorize('doctor'), getAppointmentDetails);
router.patch('/appointments/:appointmentId/accept', authorize('doctor'), acceptAppointment);
router.patch('/appointments/:appointmentId/reject', authorize('doctor'), rejectAppointment);
router.patch('/appointments/:appointmentId', authorize('doctor'), updateAppointment);
router.post('/appointments/:appointmentId/reschedule-request', authorize('doctor'), handleRescheduleRequest);
router.get('/:id', getDoctor);
router
  .route('/profile')
  .get(getDoctorProfile)
  .patch(updateDoctorProfile);
router.post('/patients/add', authorize('doctor'), addPatientById);

module.exports = router;
