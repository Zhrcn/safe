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

// Get all conversations for the current user
router.get('/', protect, getUserConversations);

// Get a specific conversation by ID
router.get('/:id', protect, getConversationById);

// Create a new conversation
router.post('/', protect, createConversation);

// Update a conversation
router.put('/:id', protect, updateConversation);

// Delete a conversation
router.delete('/:id', protect, deleteConversation);

// Mark conversation as read
router.put('/:id/read', protect, markAsRead);

// Delete a message from a conversation
router.delete('/:id/messages/:messageId', protect, deleteMessage);

module.exports = router;
