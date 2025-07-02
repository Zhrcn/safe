const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctor,
  getDoctors
} = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
router.use(protect);
router.get('/', getDoctors);
router.get('/:id', getDoctor);
router
  .route('/profile')
  .get(getDoctorProfile)
  .patch(updateDoctorProfile);
module.exports = router;
