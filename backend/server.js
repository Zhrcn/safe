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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

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
        if (callback) {
          console.log('SocketIO: calling callback with error: Conversation not found');
          return callback({ error: 'Conversation not found' });
        }
        return;
      }
      // Validate sender and receiver
      if (!message.sender || !message.receiver) {
        console.error('SocketIO: sender or receiver missing in message', message);
        if (callback) {
          console.log('SocketIO: calling callback with error: Sender and receiver are required.');
          return callback({ error: 'Sender and receiver are required.' });
        }
        return;
      }
      // Ensure sender and receiver are participants
      const senderId = message.sender.toString();
      const receiverId = message.receiver.toString();
      const participantIds = conversation.participants.map(id => id.toString());
      if (!participantIds.includes(senderId) || !participantIds.includes(receiverId)) {
        console.error('SocketIO: sender or receiver not a participant', { senderId, receiverId, participantIds });
        if (callback) {
          console.log('SocketIO: calling callback with error: Sender and receiver must be participants.');
          return callback({ error: 'Sender and receiver must be participants.' });
        }
        return;
      }
      // Convert sender/receiver to ObjectId
      message.sender = require('mongoose').Types.ObjectId(senderId);
      message.receiver = require('mongoose').Types.ObjectId(receiverId);
      conversation.messages.push(message);
      await conversation.save();
      const savedMessage = conversation.messages[conversation.messages.length - 1];
      console.log('SocketIO: Message saved and emitting', { conversationId, savedMessage });
      io.to(conversationId).emit('receive_message', { conversationId, message: savedMessage });
      console.log('SocketIO: Emitted receive_message to room', conversationId);
      if (callback) {
        console.log('SocketIO: calling callback with data:', { conversationId, message: savedMessage });
        callback({ data: { conversationId, message: savedMessage } });
      }
    } catch (err) {
      console.error('SocketIO send_message error:', err);
      if (callback) {
        console.log('SocketIO: calling callback with error:', err.message);
        callback({ error: err.message });
      }
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