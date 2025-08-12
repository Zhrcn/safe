const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { createNotification } = require('../utils/notification.utils');

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
    education,
    achievements,
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
  if (education) doctorFieldsToUpdate.education = education;
  if (achievements) doctorFieldsToUpdate.achievements = achievements;
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
        .select('specialization qualifications licenseNumber yearsOfExperience consultationFee availability workingHours professionalBio rating');
    res.status(200).json(new ApiResponse(200, doctors, 'Doctors fetched successfully.'));
});

exports.getDoctor = asyncHandler(async (req, res) => {
    let doctor = await Doctor.findById(req.params.id)
        .populate('user', 'firstName lastName email profileImage')
        .select('specialty experienceYears professionalBio');
    if (!doctor) {
        doctor = await Doctor.findOne({ user: req.params.id })
            .populate('user', 'firstName lastName email profileImage')
            .select('specialty experienceYears professionalBio');
    }
    if (!doctor) {
        const User = require('../models/User');
        const user = await User.findById(req.params.id).select('firstName lastName email profileImage');
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
        }
        return res.status(200).json(new ApiResponse(200, {
            _id: req.params.id,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage,
                email: user.email
            },
            specialty: null,
            experienceYears: null,
            professionalBio: null
        }, 'Doctor fetched successfully.'));
    }
    res.status(200).json(new ApiResponse(200, {
        _id: doctor._id,
        user: {
            firstName: doctor.user.firstName,
            lastName: doctor.user.lastName,
            profileImage: doctor.user.profileImage,
            email: doctor.user.email
        },
        specialty: doctor.specialty,
        experienceYears: doctor.experienceYears,
        professionalBio: doctor.professionalBio
    }, 'Doctor fetched successfully.'));
});

exports.getDoctorByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const doctor = await Doctor.findOne({ user: userId })
        .populate('user', 'firstName lastName email profileImage')
        .select('specialty experienceYears professionalBio');
    
    if (!doctor) {
        return res.status(404).json(new ApiResponse(404, null, 'Doctor not found for this user.'));
    }
    
    res.status(200).json(new ApiResponse(200, {
        _id: doctor._id,
        user: {
            firstName: doctor.user.firstName,
            lastName: doctor.user.lastName,
            profileImage: doctor.user.profileImage,
            email: doctor.user.email
        },
        specialty: doctor.specialty,
        experienceYears: doctor.experienceYears,
        professionalBio: doctor.professionalBio
    }, 'Doctor fetched successfully.'));
});

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

exports.getDoctorPatients = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  
  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate({
      path: 'patient',
      populate: [
        { path: 'user', select: 'firstName lastName email phoneNumber profileImage dateOfBirth age' },
        { path: 'medicalFile' }
      ]
    })
    .sort({ date: -1 });

  const patientMap = new Map();
  appointments.forEach(appointment => {
    if (appointment.patient && !patientMap.has(appointment.patient._id.toString())) {
      let age = appointment.patient.user?.age;
      if (!age && appointment.patient.user?.dateOfBirth) {
        age = calculateAge(appointment.patient.user.dateOfBirth);
      }
      let condition = null;
      if (appointment.patient.medicalFile && Array.isArray(appointment.patient.medicalFile.chronicConditions) && appointment.patient.medicalFile.chronicConditions.length > 0) {
        const sorted = [...appointment.patient.medicalFile.chronicConditions].sort((a, b) => new Date(b.diagnosisDate || 0) - new Date(a.diagnosisDate || 0));
        condition = sorted[0].name;
      } else if (appointment.patient.medicalFile && Array.isArray(appointment.patient.medicalFile.diagnoses) && appointment.patient.medicalFile.diagnoses.length > 0) {
        const sorted = [...appointment.patient.medicalFile.diagnoses].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        condition = sorted[0].name;
      }
      patientMap.set(appointment.patient._id.toString(), {
        _id: appointment.patient._id,
        patientId: appointment.patient.patientId,
        user: appointment.patient.user,
        medicalFile: appointment.patient.medicalFile,
        lastAppointment: appointment.date,
        appointmentCount: 1,
        age,
        condition
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
      .populate('user', 'firstName lastName email phoneNumber profileImage dateOfBirth age')
      .populate('medicalFile');
    
    patientsFromList.forEach(patient => {
      let age = patient.user?.age;
      if (!age && patient.user?.dateOfBirth) {
        age = calculateAge(patient.user.dateOfBirth);
      }
      let condition = null;
      if (patient.medicalFile && Array.isArray(patient.medicalFile.chronicConditions) && patient.medicalFile.chronicConditions.length > 0) {
        const sorted = [...patient.medicalFile.chronicConditions].sort((a, b) => new Date(b.diagnosisDate || 0) - new Date(a.diagnosisDate || 0));
        condition = sorted[0].name;
      } else if (patient.medicalFile && Array.isArray(patient.medicalFile.diagnoses) && patient.medicalFile.diagnoses.length > 0) {
        const sorted = [...patient.medicalFile.diagnoses].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        condition = sorted[0].name;
      }
      if (!patientMap.has(patient._id.toString())) {
        patientMap.set(patient._id.toString(), {
          _id: patient._id,
          patientId: patient.patientId,
          user: patient.user,
          medicalFile: patient.medicalFile,
          lastAppointment: null,
          appointmentCount: 0,
          age,
          condition
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
    .populate('user', 'firstName lastName username email phoneNumber profileImage dateOfBirth gender address')
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
  await createNotification(
    patient.user._id.toString(),
    'Added to Doctor Profile',
    'You have been added to a doctor\'s patient list.',
    'general',
    doctor._id.toString(),
    'Doctor'
  );
  res.status(200).json(new ApiResponse(200, { patientId: patient.patientId, patientMongoId: patient._id }, 'Patient added to your list successfully.'));
});

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

exports.getDoctorsForMobile = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .populate('user', 'firstName lastName email phoneNumber profileImage address dateOfBirth gender')
      .lean();

    const formattedDoctors = doctors.map(doctor => {
      let specialties = [];
      if (doctor.specialties && Array.isArray(doctor.specialties) && doctor.specialties.length > 0) {
        specialties = doctor.specialties;
      } else if (doctor.specialty) {
        specialties = [doctor.specialty];
      } else if (doctor.specialization) {
        specialties = [doctor.specialization];
      }

      let hospital = null;
      if (doctor.currentHospitalAffiliation && doctor.currentHospitalAffiliation.name) {
        hospital = doctor.currentHospitalAffiliation.name;
      } else if (doctor.hospital) {
        hospital = doctor.hospital;
      }

      const experienceYears = doctor.experienceYears || doctor.yearsOfExperience || doctor.yearsOfExperience;

      return {
        _id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.user ? `${doctor.user.firstName || ''} ${doctor.user.lastName || ''}`.trim() : '',
        specialties: specialties,
        rating: doctor.rating || 0,
        yearsExperience: experienceYears,
        hospital: hospital,
        address: doctor.user?.address || null,
        avatar: doctor.user?.profileImage || null,
        email: doctor.user?.email || null,
        phoneNumber: doctor.user?.phoneNumber || null,
        medicalLicenseNumber: doctor.medicalLicenseNumber || null,
        education: doctor.education || [],
        achievements: doctor.achievements || [],
        professionalBio: doctor.professionalBio || null,
        consultationFee: doctor.consultationFee || null,
        availability: doctor.availability || null,
        workingHours: doctor.workingHours || null,
        currentHospitalAffiliation: doctor.currentHospitalAffiliation || null,
        user: {
          _id: doctor.user?._id,
          firstName: doctor.user?.firstName,
          lastName: doctor.user?.lastName,
          email: doctor.user?.email,
          phoneNumber: doctor.user?.phoneNumber,
          profileImage: doctor.user?.profileImage,
          address: doctor.user?.address,
          dateOfBirth: doctor.user?.dateOfBirth,
          gender: doctor.user?.gender
        }
      };
    });

    res.status(200).json(new ApiResponse(200, formattedDoctors, 'Doctors fetched successfully for mobile app.'));
  } catch (error) {
    console.error('Error in getDoctorsForMobile:', error);
    res.status(500).json(new ApiResponse(500, null, 'Error fetching doctors for mobile app.'));
  }
});
"console.log(JSON.stringify(patients[0], null, 2));"  
