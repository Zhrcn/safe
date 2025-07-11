const express = require('express');
const router = express.Router();
const { getSystemLogs } = require('../controllers/log.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getSystemLogs);

module.exports = router; 