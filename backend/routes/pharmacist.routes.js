// backend/routes/pharmacist.routes.js
const express = require('express');
const router = express.Router();

const {
  getPharmacistProfile,
  updatePharmacistProfile
} = require('../controllers/pharmacist.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes below are protected and accessible only by users with the 'pharmacist' role.
router.use(protect);
router.use(authorize('pharmacist'));

// @route   GET /api/v1/pharmacists/profile
// @route   PATCH /api/v1/pharmacists/profile
router
  .route('/profile')
  .get(getPharmacistProfile)
  .patch(updatePharmacistProfile);

// Future pharmacist-specific routes:
// router.get('/prescriptions/pending', getPendingPrescriptions);
// router.post('/prescriptions/:prescriptionId/dispense', dispensePrescription);
// router.get('/inventory', getPharmacyInventory); // If managing inventory
// router.post('/inventory/medications', addMedicationToInventory);

module.exports = router;
