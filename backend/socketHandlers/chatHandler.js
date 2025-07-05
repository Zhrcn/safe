const Conversation = require('../models/Conversation');
const { createNotification } = require('../utils/notification.utils');

class ChatHandler {
  constructor(io) {
    this.io = io;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('A user connected:', socket.id, 'User ID:', socket.userId);

      // Join conversation room
      socket.on('join_conversation', ({ conversationId }) => {
        this.handleJoinConversation(socket, conversationId);
      });

      // Leave conversation room
      socket.on('leave_conversation', ({ conversationId }) => {
        this.handleLeaveConversation(socket, conversationId);
      });

      // Send message
      socket.on('send_message', async ({ conversationId, message }, callback) => {
        await this.handleSendMessage(socket, conversationId, message, callback);
      });

      // Get messages
      socket.on('get_messages', async ({ conversationId }, callback) => {
        await this.handleGetMessages(socket, conversationId, callback);
      });

      // Typing indicator
      socket.on('typing', ({ conversationId, userId }) => {
        this.handleTyping(socket, conversationId, userId);
      });

      // Delete message
      socket.on('delete_message', async ({ conversationId, messageId }, callback) => {
        await this.handleDeleteMessage(socket, conversationId, messageId, callback);
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  handleJoinConversation(socket, conversationId) {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  }

  handleLeaveConversation(socket, conversationId) {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  }

  async handleSendMessage(socket, conversationId, message, callback) {
    console.log('ChatHandler send_message:', { conversationId, message });
    
    try {
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        console.error('ChatHandler: Conversation not found', conversationId);
        return callback({ error: 'Conversation not found' });
      }

      // Validate participant
      const participantIds = conversation.participants.map(id => id.toString());
      if (!participantIds.includes(socket.userId)) {
        console.error('ChatHandler: User not a participant', { userId: socket.userId, participantIds });
        return callback({ error: 'You are not a participant in this conversation' });
      }

      // Validate message structure
      if (!message.content || !message.receiver) {
        console.error('ChatHandler: Invalid message structure', message);
        return callback({ error: 'Message must have content and receiver' });
      }

      // Ensure receiver is a participant
      const receiverId = message.receiver.toString();
      if (!participantIds.includes(receiverId)) {
        console.error('ChatHandler: Receiver not a participant', { receiverId, participantIds });
        return callback({ error: 'Receiver must be a participant in this conversation' });
      }

      // Create the message object
      const newMessage = {
        content: message.content,
        sender: socket.userId,
        receiver: receiverId,
        timestamp: new Date(),
        read: false
      };

      // Add message to conversation
      conversation.messages.push(newMessage);
      await conversation.save();

      // Get the populated message
      const populatedConversation = await Conversation.findById(conversationId)
        .populate('messages.sender', 'firstName lastName email')
        .populate('messages.receiver', 'firstName lastName email');
      
      const populatedMessage = populatedConversation.messages[populatedConversation.messages.length - 1];

      console.log('ChatHandler: Message saved successfully', { conversationId, messageId: populatedMessage._id });
      
      // Create notification for the receiver if they are not the sender
      if (receiverId !== socket.userId) {
        await this.createMessageNotification(socket.user, message.content, receiverId, conversationId);
      }
      
      // Emit to all participants in the conversation
      this.io.to(conversationId).emit('receive_message', { 
        conversationId, 
        message: populatedMessage 
      });
      
      // Send success response
      callback({ 
        success: true, 
        data: { 
          conversationId, 
          message: populatedMessage 
        } 
      });
      
    } catch (err) {
      console.error('ChatHandler send_message error:', err);
      callback({ error: err.message });
    }
  }

  async handleGetMessages(socket, conversationId, callback) {
    console.log('[ChatHandler] get_messages request received:', { conversationId, userId: socket.userId });
    
    try {
      const conversation = await Conversation.findById(conversationId)
        .populate('messages.sender', 'firstName lastName email')
        .populate('messages.receiver', 'firstName lastName email');
      
      if (!conversation) {
        console.error('[ChatHandler] Conversation not found:', conversationId);
        return callback({ error: 'Conversation not found' });
      }
      
      // Check if user is a participant
      const participantIds = conversation.participants.map(id => id.toString());
      if (!participantIds.includes(socket.userId)) {
        console.error('[ChatHandler] User not a participant:', { userId: socket.userId, participantIds });
        return callback({ error: 'You are not a participant in this conversation' });
      }
      
      console.log('[ChatHandler] Messages returned. Count:', conversation.messages.length);
      callback({ success: true, messages: conversation.messages });
    } catch (err) {
      console.error('[ChatHandler] get_messages error:', err);
      callback({ error: err.message });
    }
  }

  async handleDeleteMessage(socket, conversationId, messageId, callback) {
    console.log('[ChatHandler] delete_message request received:', { conversationId, messageId, userId: socket.userId });
    
    try {
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        return callback({ error: 'Conversation not found' });
      }

      // Check if user is a participant
      const participantIds = conversation.participants.map(id => id.toString());
      if (!participantIds.includes(socket.userId)) {
        return callback({ error: 'You are not a participant in this conversation' });
      }

      // Find the message
      const messageIndex = conversation.messages.findIndex(
        msg => msg._id.toString() === messageId
      );

      if (messageIndex === -1) {
        return callback({ error: 'Message not found' });
      }

      const message = conversation.messages[messageIndex];

      // Only allow users to delete their own messages
      if (message.sender.toString() !== socket.userId) {
        return callback({ error: 'You can only delete your own messages' });
      }

      // Remove the message
      conversation.messages.splice(messageIndex, 1);
      await conversation.save();

      // Update lastMessageTimestamp
      if (conversation.messages.length > 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        conversation.lastMessageTimestamp = lastMessage.timestamp;
      } else {
        conversation.lastMessageTimestamp = conversation.createdAt;
      }
      await conversation.save();

      // Emit message deleted event to all participants
      this.io.to(conversationId).emit('message_deleted', { 
        conversationId, 
        messageId 
      });

      callback({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
      console.error('[ChatHandler] delete_message error:', err);
      callback({ error: err.message });
    }
  }

  handleTyping(socket, conversationId, userId) {
    socket.to(conversationId).emit('typing', { conversationId, userId });
  }

  handleDisconnect(socket) {
    console.log('User disconnected:', socket.id);
  }

  async createMessageNotification(sender, messageContent, receiverId, conversationId) {
    const senderName = sender.firstName && sender.lastName 
      ? `${sender.firstName} ${sender.lastName}` 
      : sender.email || 'Someone';
    
    const notificationTitle = `New Message from ${senderName}`;
    const notificationMessage = messageContent.length > 50 
      ? `${messageContent.substring(0, 50)}...` 
      : messageContent;
    
    await createNotification(
      receiverId,
      notificationTitle,
      notificationMessage,
      'message',
      conversationId,
      'Conversation'
    );
    
    console.log('Notification created for receiver:', receiverId);
  }
}

module.exports = ChatHandler; 