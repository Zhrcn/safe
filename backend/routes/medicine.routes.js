const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');
const medicineRequestController = require('../controllers/medicineRequest.controller');
const { protect } = require('../middleware/auth.middleware');

let requests = [
  {
    id: '1',
    medicineName: 'Paracetamol',
    pharmacyName: 'City Pharmacy',
    status: 'pending',
    available: null,
    message: '',
    createdAt: new Date(),
  },
];

router.get('/', medicineController.getAllMedicines);
router.post('/', medicineController.createMedicine);

module.exports = router;
