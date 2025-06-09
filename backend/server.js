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
// Prioritize models that are referenced by others
require('./models/User');
require('./models/Medicine'); // Required by Prescription, MedicalFile
require('./models/Doctor'); // Required by Appointment, Consultation, Prescription
require('./models/Pharmacist'); // Required by Prescription
require('./models/Appointment');
require('./models/Prescription'); // Should be before MedicalFile, Patient
require('./models/Conversation');
require('./models/Consultation');
require('./models/healthMetric.model');
require('./models/vitalSign.model');
require('./models/Notification');

// Models that reference others, or are more complex
require('./models/MedicalFile');
require('./models/Patient');
require('./models/medication'); // references Patient, Doctor

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(cors()); 

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

