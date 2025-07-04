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

// All routes require authentication
router.use(protect);

// Get all medications for the authenticated patient
router.get('/', getPatientMedications);

// Get a single medication
router.get('/:id', getMedication);

// Create a new medication
router.post('/', createMedication);

// Update a medication
router.put('/:id', updateMedication);

// Delete a medication
router.delete('/:id', deleteMedication);

// Update medication reminders
router.patch('/:id/reminders', updateReminders);

// Request medication refill
router.post('/:id/refill', requestRefill);

module.exports = router; 