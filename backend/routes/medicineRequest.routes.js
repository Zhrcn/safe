console.log('medicineRequest.routes.js loaded');
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const controller = require('../controllers/medicineRequest.controller');

router.use(protect);
router.get('/', controller.getMedicineRequests);
router.post('/', controller.createMedicineRequest);

// Delete a medicine request by ID
router.delete('/:id', controller.deleteMedicineRequest);

// Pharmacist responds to a medicine request
router.patch('/:id/respond', controller.respondToMedicineRequest);

// Pharmacist: Get all requests for their pharmacy
router.get('/pharmacy', controller.getPharmacyMedicineRequests);

module.exports = router; 