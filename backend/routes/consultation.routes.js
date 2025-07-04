const express = require('express');
const router = express.Router();
const {
  getConsultations,
  requestConsultation,
  updateConsultation,
  deleteConsultation,
  addFollowUpQuestion,
  getConsultationMessages
} = require('../controllers/consultation.controller');
const { protect } = require('../middleware/auth.middleware');
router.use(protect);
router.route('/')
  .get(getConsultations)
  .post(requestConsultation);
router.route('/:id')
  .patch(updateConsultation)
  .delete(deleteConsultation);
router.route('/:id/follow-up')
  .post(addFollowUpQuestion);
router.route('/:id/messages')
  .get(getConsultationMessages);
module.exports = router;
