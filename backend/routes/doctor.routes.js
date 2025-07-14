console.log('doctor.routes.js loaded');
const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctor,
  getDoctors,
  getDoctorPatients,
  getDoctorPatientById,
  addPatientById,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addEducation,
  updateEducation,
  deleteEducation,
  addLicense,
  updateLicense,
  deleteLicense,
  getMedicalFileById
} = require('../controllers/doctor.controller');
const { 
  getDoctorAppointments, 
  acceptAppointment, 
  rejectAppointment, 
  updateAppointment, 
  getAppointmentDetails,
  handleRescheduleRequest,
  createAppointment
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
const medicineRequestController = require('../controllers/medicineRequest.controller');

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
router.post('/appointments', authorize('doctor'), createAppointment);
router
  .route('/profile')
  .get(getDoctorProfile)
  .patch(updateDoctorProfile);

// Achievements Routes
router.post('/achievements', authorize('doctor'), addAchievement);
router.put('/achievements/:id', authorize('doctor'), updateAchievement);
router.delete('/achievements/:id', authorize('doctor'), deleteAchievement);

// Education Routes
router.post('/education', authorize('doctor'), addEducation);
router.put('/education/:id', authorize('doctor'), updateEducation);
router.delete('/education/:id', authorize('doctor'), deleteEducation);

// Licenses Routes
router.post('/licenses', authorize('doctor'), addLicense);
router.put('/licenses/:id', authorize('doctor'), updateLicense);
router.delete('/licenses/:id', authorize('doctor'), deleteLicense);

router.get('/:id', getDoctor);
router.post('/patients/add', authorize('doctor'), addPatientById);
router.get('/medical-file/:id', protect, authorize('doctor'), getMedicalFileById);

// Medicine request endpoints
router.get('/medicine/requests', protect, medicineRequestController.getMedicineRequests);
router.post('/medicine/requests', protect, medicineRequestController.createMedicineRequest);

module.exports = router;
