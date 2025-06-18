const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMedicalFileById, updateEmergencyContact, updateInsuranceDetails } = require('../controllers/medicalFile.controller');
router.route('/:id').get(protect, getMedicalFileById);
router.patch('/:id/emergency-contact', protect, updateEmergencyContact);
router.patch('/:id/insurance', protect, updateInsuranceDetails);
module.exports = router;
