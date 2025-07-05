const Conversation = require('../models/Conversation');

class ConversationController {
  // Get all conversations for the current user
  static async getUserConversations(req, res) {
    try {
      let conversations = await Conversation.find({ participants: req.user.id })
        .populate('participants', 'firstName lastName email role')
        .populate('messages.sender', 'firstName lastName email')
        .sort({ updatedAt: -1 });

      // Filter out conversations deleted for this user
      conversations = conversations.filter(conv =>
        !conv.deletedFor || !conv.deletedFor.map(id => id.toString()).includes(req.user.id.toString())
      );

      conversations = conversations.map(conv => {
        let other = null;
        if (conv.participants && conv.participants.length > 1) {
          other = conv.participants.find(
            p => p._id.toString() !== req.user.id.toString()
          );
        }
        const otherName = other ? [other.firstName, other.lastName].filter(Boolean).join(' ') : 'Unknown';
        return {
          ...conv.toObject(),
          title: otherName
        };
      });

      res.status(200).json({ data: conversations });
    } catch (err) {
      console.error('Error getting user conversations:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get a single conversation by ID
  static async getConversationById(req, res) {
    try {
      const conversation = await Conversation.findById(req.params.id)
        .populate('participants', 'firstName lastName email role')
        .populate('messages.sender', 'firstName lastName email');

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      let other = conversation.participants.find(
        p => p._id.toString() !== req.user.id.toString()
      );
      const otherName = other ? [other.firstName, other.lastName].filter(Boolean).join(' ') : 'Unknown';

      const conversationWithTitle = {
        ...conversation.toObject(),
        title: otherName
      };

      res.status(200).json({ data: conversationWithTitle });
    } catch (err) {
      console.error('Error getting conversation by ID:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Create a new conversation
  static async createConversation(req, res) {
    try {
      const { participants, subject } = req.body;

      // Ensure the current user is a participant
      if (!participants.includes(req.user.id)) {
        participants.push(req.user.id);
      }

      // Prevent duplicate conversations
      const existingConversation = await Conversation.findOne({
        participants: { $all: participants, $size: participants.length }
      });

      if (existingConversation) {
        return res.status(200).json({ data: existingConversation });
      }

      const conversation = new Conversation({
        participants,
        subject: subject || 'New Conversation',
        messages: []
      });

      await conversation.save();

      const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'firstName lastName email role');

      res.status(201).json({ data: populatedConversation });
    } catch (err) {
      console.error('Error creating conversation:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Update a conversation (e.g., subject)
  static async updateConversation(req, res) {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      if (!conversation.participants.includes(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedConversation = await Conversation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('participants', 'firstName lastName email role');

      res.status(200).json({ data: updatedConversation });
    } catch (err) {
      console.error('Error updating conversation:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete a conversation
  static async deleteConversation(req, res) {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      if (!conversation.participants.includes(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // If user already deleted, just return success
      if (conversation.deletedFor && conversation.deletedFor.includes(req.user.id)) {
        return res.status(200).json({ data: { id: req.params.id } });
      }

      // Add user to deletedFor
      conversation.deletedFor = conversation.deletedFor || [];
      conversation.deletedFor.push(req.user.id);
      await conversation.save();

      // If all participants have deleted, permanently delete
      const allDeleted = conversation.participants.every(participantId =>
        conversation.deletedFor.map(id => id.toString()).includes(participantId.toString())
      );
      if (allDeleted) {
        await Conversation.findByIdAndDelete(req.params.id);
      }

      res.status(200).json({ data: { id: req.params.id } });
    } catch (err) {
      console.error('Error deleting conversation:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Mark all messages as read for the current user in a conversation
  static async markAsRead(req, res) {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      if (!conversation.participants.includes(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      conversation.messages.forEach(message => {
        if (message.receiver && message.receiver.toString() === req.user.id) {
          message.read = true;
        }
      });

      await conversation.save();

      const updatedConversation = await Conversation.findById(req.params.id)
        .populate('participants', 'firstName lastName email role')
        .populate('messages.sender', 'firstName lastName email');

      res.status(200).json({ data: updatedConversation });
    } catch (err) {
      console.error('Error marking conversation as read:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete a message from a conversation
  static async deleteMessage(req, res) {
    try {
      const { id: conversationId, messageId } = req.params;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      if (!conversation.participants.includes(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Find the message
      const messageIndex = conversation.messages.findIndex(
        msg => msg._id.toString() === messageId
      );

      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const message = conversation.messages[messageIndex];

      // Only allow users to delete their own messages
      if (message.sender.toString() !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own messages' });
      }

      // Remove the message
      conversation.messages.splice(messageIndex, 1);
      await conversation.save();

      // Update lastMessageTimestamp if this was the last message
      if (conversation.messages.length > 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        conversation.lastMessageTimestamp = lastMessage.timestamp;
      } else {
        conversation.lastMessageTimestamp = conversation.createdAt;
      }
      await conversation.save();

      const updatedConversation = await Conversation.findById(conversationId)
        .populate('participants', 'firstName lastName email role')
        .populate('messages.sender', 'firstName lastName email');

      res.status(200).json({ 
        data: updatedConversation,
        message: 'Message deleted successfully' 
      });
    } catch (err) {
      console.error('Error deleting message:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

// Export static methods
module.exports = {
  getUserConversations: ConversationController.getUserConversations,
  getConversationById: ConversationController.getConversationById,
  createConversation: ConversationController.createConversation,
  updateConversation: ConversationController.updateConversation,
  deleteConversation: ConversationController.deleteConversation,
  markAsRead: ConversationController.markAsRead,
  deleteMessage: ConversationController.deleteMessage
};
