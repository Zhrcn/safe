require('dotenv').config({ path: '../config/config.env' });
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
const mongoose = require('mongoose');
const Log = require('../models/Log');

const mongoURI = "mongodb://localhost:27017/safe";

const logs = [
  {
    level: 'info',
    message: 'System started successfully.',
    meta: { service: 'core' },
    createdAt: new Date(),
  },
  {
    level: 'warn',
    message: 'High memory usage detected.',
    meta: { service: 'monitor' },
    createdAt: new Date(),
  },
  {
    level: 'error',
    message: 'Database connection failed.',
    meta: { service: 'db' },
    createdAt: new Date(),
  },
  {
    level: 'info',
    message: 'User admin logged in.',
    meta: { service: 'auth', user: 'admin' },
    createdAt: new Date(),
  },
  {
    level: 'info',
    message: 'Scheduled backup completed.',
    meta: { service: 'backup', duration: '2m 13s' },
    createdAt: new Date(),
  },
  {
    level: 'warn',
    message: 'API rate limit approaching threshold.',
    meta: { service: 'api', endpoint: '/v1/prescriptions' },
    createdAt: new Date(),
  },
  {
    level: 'error',
    message: 'Failed to send notification email.',
    meta: { service: 'notification', email: 'user@example.com' },
    createdAt: new Date(),
  },
  {
    level: 'info',
    message: 'Prescription created for patient.',
    meta: { service: 'prescription', patientId: '64f1a2b3c4d5e6f7a8b9c0d1' },
    createdAt: new Date(),
  },
];

async function seedLogs() {
  try {
    if (!mongoURI) throw new Error('MONGO_URI is not defined!');
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Log.deleteMany({});
    await Log.insertMany(logs);
    console.log('Logs seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding logs:', err);
    process.exit(1);
  }
}

seedLogs(); 