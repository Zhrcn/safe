const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

exports.getDoctorProfile = asyncHandler(async (req, res, next) => {
  const doctorUser = await User.findById(req.user.id).select('-password');
  if (!doctorUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor user not found.'));
  }
  const doctorRecord = await Doctor.findOne({ user: req.user.id });
  if (!doctorRecord) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor-specific record not found.'));
  }
  const profile = {
    _id: doctorUser._id,
    userId: doctorUser._id,
    firstName: doctorUser.firstName,
    lastName: doctorUser.lastName,
    email: doctorUser.email,
    role: doctorUser.role,
    dateOfBirth: doctorUser.dateOfBirth,
    gender: doctorUser.gender,
    phoneNumber: doctorUser.phoneNumber,
    address: doctorUser.address,
    profilePictureUrl: doctorUser.profilePictureUrl,
    doctorId: doctorRecord._id,
    specialization: doctorRecord.specialization,
    qualifications: doctorRecord.qualifications,
    licenseNumber: doctorRecord.licenseNumber,
    yearsOfExperience: doctorRecord.yearsOfExperience,
    consultationFee: doctorRecord.consultationFee,
    availability: doctorRecord.availability,
    workingHours: doctorRecord.workingHours,
    professionalBio: doctorRecord.professionalBio,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile fetched successfully.'));
});

exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    profilePictureUrl,
    specialization,
    qualifications, 
    yearsOfExperience,
    consultationFee,
    workingHours,
    professionalBio,
  } = req.body;
  const userFieldsToUpdate = {};
  if (firstName) userFieldsToUpdate.firstName = firstName;
  if (lastName) userFieldsToUpdate.lastName = lastName;
  if (dateOfBirth) userFieldsToUpdate.dateOfBirth = dateOfBirth;
  if (gender) userFieldsToUpdate.gender = gender;
  if (phoneNumber) userFieldsToUpdate.phoneNumber = phoneNumber;
  if (address && Object.keys(address).length > 0) userFieldsToUpdate.address = address;
  if (profilePictureUrl) userFieldsToUpdate.profilePictureUrl = profilePictureUrl;
  let updatedUser = await User.findById(userId);
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor user not found for update.'));
  }
  Object.assign(updatedUser, userFieldsToUpdate); 
  await updatedUser.save(); 
  updatedUser = updatedUser.toObject(); 
  delete updatedUser.password; 
  const doctorFieldsToUpdate = {};
  if (specialization) doctorFieldsToUpdate.specialization = specialization;
  if (qualifications) doctorFieldsToUpdate.qualifications = qualifications; 
  if (yearsOfExperience !== undefined) doctorFieldsToUpdate.yearsOfExperience = yearsOfExperience;
  if (consultationFee !== undefined) doctorFieldsToUpdate.consultationFee = consultationFee;
  if (workingHours) doctorFieldsToUpdate.workingHours = workingHours; 
  if (professionalBio) doctorFieldsToUpdate.professionalBio = professionalBio;
  let updatedDoctorRecord = await Doctor.findOne({ user: userId });
  if (!updatedDoctorRecord) {
     return res.status(404).json(new ApiResponse(404, null, 'Doctor-specific record not found for update.'));
  }
  Object.assign(updatedDoctorRecord, doctorFieldsToUpdate);
  await updatedDoctorRecord.save();
  const profile = {
    _id: updatedUser._id,
    userId: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    role: updatedUser.role,
    dateOfBirth: updatedUser.dateOfBirth,
    gender: updatedUser.gender,
    phoneNumber: updatedUser.phoneNumber,
    address: updatedUser.address,
    profilePictureUrl: updatedUser.profilePictureUrl,
    doctorId: updatedDoctorRecord._id,
    specialization: updatedDoctorRecord.specialization,
    qualifications: updatedDoctorRecord.qualifications,
    licenseNumber: updatedDoctorRecord.licenseNumber,
    yearsOfExperience: updatedDoctorRecord.yearsOfExperience,
    consultationFee: updatedDoctorRecord.consultationFee,
    availability: updatedDoctorRecord.availability,
    workingHours: updatedDoctorRecord.workingHours,
    professionalBio: updatedDoctorRecord.professionalBio,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile updated successfully.'));
});

exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({})
        .populate('user', 'firstName lastName email phoneNumber profilePictureUrl')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');
    res.status(200).json(new ApiResponse(200, doctors, 'Doctors fetched successfully.'));
});

exports.getDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
        .populate('user', 'firstName lastName email phoneNumber profilePictureUrl')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');
    if (!doctor) {
        return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
    }
    res.status(200).json(new ApiResponse(200, doctor, 'Doctor fetched successfully.'));
});

exports.getDoctorPatients = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // First, find the doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  
  // Find all appointments for this doctor
  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email phoneNumber profilePictureUrl'
      }
    })
    .sort({ date: -1 });

  // Extract unique patients from appointments
  const patientMap = new Map();
  appointments.forEach(appointment => {
    if (appointment.patient && !patientMap.has(appointment.patient._id.toString())) {
      patientMap.set(appointment.patient._id.toString(), {
        _id: appointment.patient._id,
        user: appointment.patient.user,
        medicalFile: appointment.patient.medicalFile,
        lastAppointment: appointment.date,
        appointmentCount: 1
      });
    } else if (appointment.patient) {
      const existingPatient = patientMap.get(appointment.patient._id.toString());
      existingPatient.appointmentCount += 1;
      if (appointment.date > existingPatient.lastAppointment) {
        existingPatient.lastAppointment = appointment.date;
      }
    }
  });

  const patients = Array.from(patientMap.values());
  
  res.status(200).json(new ApiResponse(200, patients, 'Doctor patients fetched successfully.'));
});

exports.getDoctorPatientById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const patientId = req.params.id;
  
  // First, find the doctor record for this user
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  
  // Find the patient by ID
  const patient = await Patient.findById(patientId)
    .populate('user', 'firstName lastName email phoneNumber profilePictureUrl dateOfBirth gender address')
    .populate('medicalFile');
    
  if (!patient) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
  }
  
  // Check if this doctor has any appointments with this patient
  const appointment = await Appointment.findOne({ 
    doctor: doctor._id, 
    patient: patientId 
  });
  
  if (!appointment) {
    return res.status(403).json(new ApiResponse(403, null, 'You can only view patients you have appointments with.'));
  }
  
  // Get all appointments for this patient with this doctor
  const appointments = await Appointment.find({ 
    doctor: doctor._id, 
    patient: patientId 
  }).sort({ date: -1 });
  
  const patientData = {
    _id: patient._id,
    user: patient.user,
    medicalFile: patient.medicalFile,
    appointments: appointments,
    lastAppointment: appointments.length > 0 ? appointments[0].date : null,
    appointmentCount: appointments.length
  };
  
  res.status(200).json(new ApiResponse(200, patientData, 'Patient details fetched successfully.'));
});
