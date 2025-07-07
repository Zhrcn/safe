const express = require('express');
const router = express.Router();
const {
  getPatientMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  updateReminders,
  requestRefill
} = require('../controllers/medication.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getPatientMedications);

router.get('/:id', getMedication);

router.post('/', createMedication);

router.put('/:id', updateMedication);

router.delete('/:id', deleteMedication);

router.patch('/:id/reminders', updateReminders);

router.post('/:id/refill', requestRefill);

module.exports = router; 