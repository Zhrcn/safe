const express = require('express');
const router = express.Router();
const { getUserConversations } = require('../controllers/conversation.controller');
const { protect } = require('../middleware/auth.middleware'); // adjust if needed

router.get('/', protect, getUserConversations);

module.exports = router;
