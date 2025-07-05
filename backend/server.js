require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const mainRouter = require('./routes/index'); 
const errorHandler = require('./middleware/error.middleware'); 
const morgan = require('morgan');

require('./models/User');
require('./models/Medicine');
require('./models/Doctor');
require('./models/Pharmacist');
require('./models/Appointment');
require('./models/Prescription');
require('./models/Conversation');
require('./models/Consultation');
require('./models/MedicalFile');
require('./models/Notification');
require('./models/Patient');
require('./models/medication');

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://192.168.1.100:3000',
    'https://safe-5gxi.vercel.app',
    'https://safe-webapp.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', mainRouter);

app.get('/', (req, res) => {
  res.send('Express Server for SAFE App is running!');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001; 
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
});

// --- SOCKET.IO SETUP ---
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://192.168.1.100:3000',
      'https://safe-5gxi.vercel.app',
      'https://safe-webapp.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  }
});

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id, 'User ID:', socket.userId);

  socket.on('join_conversation', ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('leave_conversation', ({ conversationId }) => {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  socket.on('send_message', async ({ conversationId, message }, callback) => {
    console.log('SocketIO send_message:', { conversationId, message });
    try {
      const Conversation = require('./models/Conversation');
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        console.error('SocketIO: Conversation not found', conversationId);
        return callback({ error: 'Conversation not found' });
      }

      // Validate that the authenticated user is a participant
      const participantIds = conversation.participants.map(id => id.toString());
      if (!participantIds.includes(socket.userId)) {
        console.error('SocketIO: User not a participant', { userId: socket.userId, participantIds });
        return callback({ error: 'You are not a participant in this conversation' });
      }

      // Validate message structure
      if (!message.content || !message.receiver) {
        console.error('SocketIO: Invalid message structure', message);
        return callback({ error: 'Message must have content and receiver' });
      }

      // Ensure receiver is a participant
      const receiverId = message.receiver.toString();
      if (!participantIds.includes(receiverId)) {
        console.error('SocketIO: Receiver not a participant', { receiverId, participantIds });
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
      const savedMessage = conversation.messages[conversation.messages.length - 1];
      
      // Populate sender and receiver details
      const populatedConversation = await Conversation.findById(conversationId)
        .populate('messages.sender', 'firstName lastName email')
        .populate('messages.receiver', 'firstName lastName email');
      
      const populatedMessage = populatedConversation.messages[populatedConversation.messages.length - 1];

      console.log('SocketIO: Message saved successfully', { conversationId, messageId: savedMessage._id });
      
      // Emit to all participants in the conversation
      io.to(conversationId).emit('receive_message', { 
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
      console.error('SocketIO send_message error:', err);
      callback({ error: err.message });
    }
  });

  // Handle typing indicator
  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('typing', { conversationId, userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`.red);
  console.error(err.stack);
  server.close(() => process.exit(1));
});

module.exports.io = io;