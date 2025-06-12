require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const mainRouter = require('./routes/index'); 
const errorHandler = require('./middleware/error.middleware'); 
const morgan = require('morgan');

// Require all Mongoose models to ensure they are registered
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
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`.red);
  console.error(err.stack);
  server.close(() => process.exit(1));
});