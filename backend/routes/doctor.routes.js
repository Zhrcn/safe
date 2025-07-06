const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctor,
  getDoctors,
  getDoctorPatients,
  getDoctorPatientById
} = require('../controllers/doctor.controller');
const { 
  getDoctorAppointments, 
  acceptAppointment, 
  rejectAppointment, 
  updateAppointment, 
  getAppointmentDetails,
  handleRescheduleRequest
} = require('../controllers/Doctor/doctorAppointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getDoctors);
router.get('/patients', authorize('doctor'), getDoctorPatients);
router.get('/patients/:id', authorize('doctor'), getDoctorPatientById);
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

module.exports = router;
