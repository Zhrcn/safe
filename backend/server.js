require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
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

// CORS configuration
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

// API routes
app.use('/api/v1', mainRouter);

// Development: Proxy frontend requests to Next.js dev server
if (process.env.NODE_ENV === 'development') {
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1': '/api/v1', // Don't rewrite API routes
    },
    onProxyReq: (proxyReq, req, res) => {
      // Skip proxy for API routes
      if (req.path.startsWith('/api/v1')) {
        return false;
      }
    }
  }));
} else {
  // Production: Serve static files from Next.js build
  app.use(express.static(path.join(__dirname, '../.next/static')));
  
  // Handle all other routes by serving the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../.next/server/pages/index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5001; 
const server = app.listen(PORT, () => {
  console.log(`Unified Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
  if (process.env.NODE_ENV === 'development') {
    console.log(`Frontend proxied from: http://localhost:3000`.green.bold);
    console.log(`Backend API available at: http://localhost:${PORT}/api/v1`.green.bold);
  } else {
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