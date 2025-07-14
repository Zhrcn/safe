console.log('medicineRequest.routes.js loaded');
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const controller = require('../controllers/medicineRequest.controller');

router.use(protect);
router.get('/', controller.getMedicineRequests);
router.post('/', controller.createMedicineRequest);

module.exports = router; 