const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
require('dotenv').config({ path: './config.env' });

async function testAnalytics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const doctor = await Doctor.findOne().populate('user');
    if (!doctor) {
      console.log('No doctor found in database');
      return;
    }

    console.log('Found doctor:', doctor.user.firstName, doctor.user.lastName);

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'firstName lastName email gender age'
        }
      });

    console.log('Total appointments:', appointments.length);

    const prescriptions = await Prescription.find({ doctorId: doctor.user._id });
    console.log('Total prescriptions:', prescriptions.length);

    const totalPatients = new Set(appointments.map(apt => apt.patient._id.toString())).size;
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
    const upcomingAppointments = appointments.filter(apt => 
      apt.status === 'scheduled' && new Date(apt.date) > new Date()
    ).length;
    const prescriptionsIssued = prescriptions.length;

    console.log('\n=== Analytics Summary ===');
    console.log('Total Patients:', totalPatients);
    console.log('Total Appointments:', totalAppointments);
    console.log('Completed Appointments:', completedAppointments);
    console.log('Cancelled Appointments:', cancelledAppointments);
    console.log('Upcoming Appointments:', upcomingAppointments);
    console.log('Prescriptions Issued:', prescriptionsIssued);

    const patientGenderMap = new Map();
    appointments.forEach(apt => {
      const patientId = apt.patient._id.toString();
      if (!patientGenderMap.has(patientId)) {
        patientGenderMap.set(patientId, apt.patient.user.gender || 'other');
      }
    });

    const genderCounts = { male: 0, female: 0, other: 0 };
    patientGenderMap.forEach(gender => {
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    console.log('\n=== Patient Distribution ===');
    console.log('Male:', genderCounts.male);
    console.log('Female:', genderCounts.female);
    console.log('Other:', genderCounts.other);

    const appointmentTypeCounts = {};
    appointments.forEach(apt => {
      appointmentTypeCounts[apt.type] = (appointmentTypeCounts[apt.type] || 0) + 1;
    });

    console.log('\n=== Appointment Types ===');
    Object.entries(appointmentTypeCounts).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });

    console.log('\nAnalytics test completed successfully!');

  } catch (error) {
    console.error('Error testing analytics:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testAnalytics(); 