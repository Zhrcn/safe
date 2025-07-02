const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

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
