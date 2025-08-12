const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const referralController = require('../controllers/referral.controller');

router.post('/', protect, referralController.createReferral);
router.patch('/:referralId/status', protect, referralController.updateReferralStatus);
router.get('/doctor', protect, referralController.getReferralsForDoctor);
router.get('/patient/:patientId', protect, referralController.getReferralsForPatient);

module.exports = router; 