const express = require('express');
const router = express.Router();
const {
  getConsultations,
  requestConsultation,
  answerConsultation,
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
router.route('/:id/answer')
  .put(answerConsultation);
router.route('/:id/follow-up')
  .post(addFollowUpQuestion);
router.route('/:id/messages')
  .get(getConsultationMessages);
router.route('/:id')
  .patch(updateConsultation)
  .delete(deleteConsultation);
module.exports = router;
