require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path');
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

// CORS configuration for development
if (process.env.NODE_ENV === 'development') {
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
}

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/v1', mainRouter);

// Serve static files from Next.js build
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the Next.js build
  app.use(express.static(path.join(__dirname, '../out')));
  
  // Handle all other routes by serving the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../out/index.html'));
  });
} else {
  // Development: just show API status
  app.get('/', (req, res) => {
    res.send('Express Server for SAFE App is running! (Development Mode)');
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5001; 
const server = app.listen(PORT, () => {
  console.log(`Unified Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend and Backend served on: http://localhost:${PORT}`.green.bold);
  }
});

// --- SOCKET.IO SETUP ---
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const ChatHandler = require('./socketHandlers/chatHandler');

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

// Initialize chat handler
new ChatHandler(io);

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