const express = require('express');
const router = express.Router();
const { 
  getUserConversations, 
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,
  markAsRead,
  deleteMessage
} = require('../controllers/conversation.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getUserConversations);
router.get('/:id', protect, getConversationById);
router.post('/', protect, createConversation);
router.put('/:id', protect, updateConversation);
router.delete('/:id', protect, deleteConversation);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id/messages/:messageId', protect, deleteMessage);

module.exports = router;
