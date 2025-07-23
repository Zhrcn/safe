const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');

router.get('/', prescriptionController.getPrescriptions);
router.get('/:id', prescriptionController.getPrescriptionById);
router.put('/:id', prescriptionController.updatePrescriptionById);
router.patch('/:id', prescriptionController.updatePrescriptionById);
router.post('/', prescriptionController.createPrescription);

module.exports = router;
