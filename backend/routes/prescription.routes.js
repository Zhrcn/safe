const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');

router.get('/', prescriptionController.getPrescriptions);

module.exports = router;
