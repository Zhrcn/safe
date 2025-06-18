const express = require('express');
const router = express.Router();
const {
  getConsultations,
  requestConsultation,
  updateConsultation,
  cancelConsultation
} = require('../controllers/consultation.controller');
const { protect } = require('../middleware/auth.middleware');
router.use(protect);
router.route('/')
  .get(getConsultations)
  .post(requestConsultation);
router.route('/:id')
  .patch(updateConsultation);
router.post('/:id/cancel', cancelConsultation);
module.exports = router;
