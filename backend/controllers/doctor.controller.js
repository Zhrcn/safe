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
    profileImage: doctorUser.profileImage,
    doctorId: doctorRecord._id,
    doctorUniqueId: doctorRecord.doctorId,
    specialization: doctorRecord.specialization || doctorRecord.specialty,
    qualifications: doctorRecord.qualifications,
    medicalLicenseNumber: doctorRecord.medicalLicenseNumber,
    yearsOfExperience: doctorRecord.yearsOfExperience || doctorRecord.experienceYears,
    consultationFee: doctorRecord.consultationFee,
    availability: doctorRecord.availability,
    workingHours: doctorRecord.workingHours,
    professionalBio: doctorRecord.professionalBio,
    education: doctorRecord.education || [],
    achievements: doctorRecord.achievements || [],
    experience: doctorRecord.experience || [],
    currentHospitalAffiliation: doctorRecord.currentHospitalAffiliation,
    rating: doctorRecord.rating,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile fetched successfully.'));
});

exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    profileImage,
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
  if (email) userFieldsToUpdate.email = email;
  if (dateOfBirth) userFieldsToUpdate.dateOfBirth = dateOfBirth;
  if (gender) userFieldsToUpdate.gender = gender;
  if (phoneNumber) userFieldsToUpdate.phoneNumber = phoneNumber;
  if (address && Object.keys(address).length > 0) userFieldsToUpdate.address = address;
  if (profileImage) userFieldsToUpdate.profileImage = profileImage;
  let updatedUser = await User.findById(userId);
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor user not found for update.'));
  }
  Object.assign(updatedUser, userFieldsToUpdate); 
  await updatedUser.save(); 
  updatedUser = updatedUser.toObject(); 
  delete updatedUser.password; 
  const doctorFieldsToUpdate = {};
  if (specialization) doctorFieldsToUpdate.specialty = specialization;
  if (qualifications) doctorFieldsToUpdate.qualifications = qualifications; 
  if (yearsOfExperience !== undefined) doctorFieldsToUpdate.experienceYears = yearsOfExperience;
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
    profileImage: updatedUser.profileImage,
    doctorId: updatedDoctorRecord._id,
    specialization: updatedDoctorRecord.specialization || updatedDoctorRecord.specialty,
    qualifications: updatedDoctorRecord.qualifications,
    medicalLicenseNumber: updatedDoctorRecord.medicalLicenseNumber,
    yearsOfExperience: updatedDoctorRecord.yearsOfExperience || updatedDoctorRecord.experienceYears,
    consultationFee: updatedDoctorRecord.consultationFee,
    availability: updatedDoctorRecord.availability,
    workingHours: updatedDoctorRecord.workingHours,
    professionalBio: updatedDoctorRecord.professionalBio,
    education: updatedDoctorRecord.education || [],
    achievements: updatedDoctorRecord.achievements || [],
    experience: updatedDoctorRecord.experience || [],
    currentHospitalAffiliation: updatedDoctorRecord.currentHospitalAffiliation,
    rating: updatedDoctorRecord.rating,
  };
  res.status(200).json(new ApiResponse(200, profile, 'Doctor profile updated successfully.'));
});

exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({})
        .populate('user', 'firstName lastName email phoneNumber profileImage')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');
    res.status(200).json(new ApiResponse(200, doctors, 'Doctors fetched successfully.'));
});

exports.getDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
        .populate('user', 'firstName lastName email phoneNumber profileImage')
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio');
    if (!doctor) {
        return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
    }
    res.status(200).json(new ApiResponse(200, doctor, 'Doctor fetched successfully.'));
});

exports.getDoctorPatients = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  
  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email phoneNumber profileImage'
      }
    })
    .sort({ date: -1 });

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

  if (doctor.patientsList && doctor.patientsList.length > 0) {
    const patientsFromList = await Patient.find({ _id: { $in: doctor.patientsList } })
      .populate('user', 'firstName lastName email phoneNumber profileImage')
      .populate('medicalFile');
    
    patientsFromList.forEach(patient => {
      if (!patientMap.has(patient._id.toString())) {
        patientMap.set(patient._id.toString(), {
          _id: patient._id,
          user: patient.user,
          medicalFile: patient.medicalFile,
          lastAppointment: null,
          appointmentCount: 0
        });
      }
    });
  }

  const patients = Array.from(patientMap.values());
  
  res.status(200).json(new ApiResponse(200, patients, 'Doctor patients fetched successfully.'));
});

exports.getDoctorPatientById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const patientId = req.params.id;
  
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  
  const patient = await Patient.findById(patientId)
    .populate('user', 'firstName lastName email phoneNumber profileImage dateOfBirth gender address')
    .populate({
      path: 'medicalFile',
      populate: [
        { path: 'prescriptionsList' },
        { path: 'medicationHistory.medicine' },
      ]
    })
    .populate({
      path: 'consultations',
      populate: {
        path: 'doctor',
        select: 'firstName lastName specialization',
        populate: { path: 'user', select: 'firstName lastName' }
      }
    })
    .populate('appointments')
    .populate('medications.prescribedBy', 'firstName lastName')
    .populate('prescriptions.doctor', 'firstName lastName')
    .populate('prescriptions.medications');
    
  if (!patient) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
  }

  const isInList = doctor.patientsList.some(pid => pid.toString() === patient._id.toString());
  if (!isInList) {
    return res.status(403).json(new ApiResponse(403, null, 'You can only view patients in your patient list.'));
  }

  const appointments = await Appointment.find({ 
    doctor: doctor._id, 
    patient: patientId 
  }).sort({ date: -1 });
  
  const consultations = (patient.consultations || []).filter(
    c => c.doctor && c.doctor._id.toString() === doctor._id.toString()
  );

  const patientData = {
    _id: patient._id,
    user: patient.user,
    medicalFile: patient.medicalFile,
    appointments: appointments,
    lastAppointment: appointments.length > 0 ? appointments[0].date : null,
    appointmentCount: appointments.length,
    consultations: consultations,
    medications: patient.medications,
    prescriptions: patient.prescriptions,
  };

  // Debug: Log the patient data being sent
  console.log('Patient Data being sent:', JSON.stringify(patientData, null, 2));
  console.log('Medical File:', patientData.medicalFile);
  
  res.status(200).json(new ApiResponse(200, patientData, 'Patient details fetched successfully.'));
});

exports.addPatientById = asyncHandler(async (req, res) => {
  const userId = req.user.id; 
  const { patientId } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const patient = await Patient.findOne({ patientId });
  if (!patient) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
  }

  if (doctor.patientsList.some(pid => pid.toString() === patient._id.toString())) {
    return res.status(409).json(new ApiResponse(409, null, 'Patient already added to your list.'));
  }

  doctor.patientsList.push(patient._id);
  await doctor.save();

  res.status(200).json(new ApiResponse(200, { patientId: patient.patientId, patientMongoId: patient._id }, 'Patient added to your list successfully.'));
});

// Achievements Management
exports.addAchievement = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { achievement } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  doctor.achievements.push(achievement);
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.achievements, 'Achievement added successfully.'));
});

exports.updateAchievement = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { achievement } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  if (id >= doctor.achievements.length) {
    return res.status(404).json(new ApiResponse(404, null, 'Achievement not found.'));
  }

  doctor.achievements[id] = achievement;
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.achievements, 'Achievement updated successfully.'));
});

exports.deleteAchievement = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  if (id >= doctor.achievements.length) {
    return res.status(404).json(new ApiResponse(404, null, 'Achievement not found.'));
  }

  doctor.achievements.splice(id, 1);
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.achievements, 'Achievement deleted successfully.'));
});

// Education Management
exports.addEducation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { degree, institution, yearCompleted } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  doctor.education.push({ degree, institution, yearCompleted });
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.education, 'Education added successfully.'));
});

exports.updateEducation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { degree, institution, yearCompleted } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  if (id >= doctor.education.length) {
    return res.status(404).json(new ApiResponse(404, null, 'Education not found.'));
  }

  doctor.education[id] = { degree, institution, yearCompleted };
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.education, 'Education updated successfully.'));
});

exports.deleteEducation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  if (id >= doctor.education.length) {
    return res.status(404).json(new ApiResponse(404, null, 'Education not found.'));
  }

  doctor.education.splice(id, 1);
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.education, 'Education deleted successfully.'));
});

// Licenses Management (using experience field for licenses)
exports.addLicense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { title, institution, startDate, endDate, description } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  doctor.experience.push({ title, institution, startDate, endDate, description });
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.experience, 'License added successfully.'));
});

exports.updateLicense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, institution, startDate, endDate, description } = req.body;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  if (id >= doctor.experience.length) {
    return res.status(404).json(new ApiResponse(404, null, 'License not found.'));
  }

  doctor.experience[id] = { title, institution, startDate, endDate, description };
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.experience, 'License updated successfully.'));
});

exports.deleteLicense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  if (id >= doctor.experience.length) {
    return res.status(404).json(new ApiResponse(404, null, 'License not found.'));
  }

  doctor.experience.splice(id, 1);
  await doctor.save();

  res.status(200).json(new ApiResponse(200, doctor.experience, 'License deleted successfully.'));
});

// Get a medical file by its ID (for doctors)
exports.getMedicalFileById = asyncHandler(async (req, res) => {
  const medicalFileId = req.params.id;
  const medicalFile = await require('../models/MedicalFile').findById(medicalFileId)
    .populate('patientId', 'firstName lastName email phoneNumber address gender profileImage')
    .populate('prescriptionsList')
    .populate({
      path: 'medicationHistory.medicine',
      select: 'name genericName description',
    });
  if (!medicalFile) {
    return res.status(404).json(new ApiResponse(404, null, 'Medical file not found.'));
  }
  res.status(200).json(new ApiResponse(200, medicalFile, 'Medical file fetched successfully.'));
});
