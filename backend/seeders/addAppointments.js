require('dotenv').config({ path: __dirname + '/../config/config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

console.log('Adding appointments for doctors...');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for adding appointments...'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const addAppointments = async () => {
  try {
    const doctors = await Doctor.find({}).populate('user');
    const patients = await Patient.find({}).populate('user');
    
    console.log(`Found ${doctors.length} doctors and ${patients.length} patients`);

    if (doctors.length === 0 || patients.length === 0) {
      console.log('No doctors or patients found. Please run the main seeder first.');
      process.exit(1);
    }

    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      console.log(`Creating appointments for Dr. ${doctor.user.firstName} ${doctor.user.lastName}`);
      
      for (let j = 0; j < 3; j++) {
        const patient = patients[j % patients.length];
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + j + 1); 
        
        const appointment = await Appointment.create({
          patient: patient._id,
          doctor: doctor._id, 
          date: appointmentDate,
          time: `${9 + j}:00`, 
          type: ['consultation', 'checkup', 'follow-up'][j % 3],
          status: ['pending', 'confirmed', 'scheduled'][j % 3],
          reason: `Appointment ${j + 1} with Dr. ${doctor.user.firstName}`,
          notes: `Patient: ${patient.user.firstName} ${patient.user.lastName}`
        });
        
        console.log(`Created appointment: ${appointment._id} for ${patient.user.firstName} with Dr. ${doctor.user.firstName}`);
      }
    }

    const totalAppointments = await Appointment.countDocuments();
    console.log(`Total appointments in database: ${totalAppointments}`);
    
    for (const doctor of doctors) {
      const doctorAppointments = await Appointment.find({ doctor: doctor._id })
        .populate('patient', 'user')
        .populate('doctor', 'user');
      
      console.log(`\nDr. ${doctor.user.firstName} ${doctor.user.lastName} has ${doctorAppointments.length} appointments:`);
      doctorAppointments.forEach(apt => {
        console.log(`- ${apt.patient.user.firstName} ${apt.patient.user.lastName} on ${apt.date.toDateString()} at ${apt.time} (${apt.status})`);
      });
    }

    console.log('\nAppointments added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding appointments:', error);
    process.exit(1);
  }
};

addAppointments(); 