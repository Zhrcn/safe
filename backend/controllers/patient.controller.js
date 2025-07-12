const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');
const ErrorResponse = require('../utils/errorResponse');
const getProfile = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .select('-password')
        .populate('medicalFile')
        .populate({
            path: 'user',
            select: 'firstName lastName email phoneNumber address dateOfBirth profileImage gender age',
        });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    
    // Add patientId to the response
    const patientResponse = patient.toObject();
    patientResponse.patientId = patient.patientId;
    
    res.status(200).json(new ApiResponse(200, patientResponse, 'Patient profile retrieved successfully.'));
});
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { firstName, lastName, email, phone, address, dateOfBirth, emergencyContact } = req.body;
    // Update User info
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phoneNumber = phone;
    if (address !== undefined) user.address = address;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    await user.save();
    // Update Patient emergency contacts
    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
        return res.status(404).json(new ApiResponse(404, null, 'Patient not found'));
    }
    if (emergencyContact !== undefined) {
        patient.emergencyContacts = [emergencyContact];
        await patient.save();
    }
    // Return updated profile
    const updatedPatient = await Patient.findOne({ user: userId })
        .select('-password')
        .populate('medicalFile')
        .populate({
            path: 'user',
            select: 'firstName lastName email phoneNumber address dateOfBirth profileImage gender',
        });
    res.status(200).json(new ApiResponse(200, updatedPatient, 'Patient profile updated successfully.'));
});
const getMedicalFile = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .select('medicalFile')
        .populate('medicalFile');
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.status(200).json(new ApiResponse(200, patient.medicalFile, 'Medical file retrieved successfully.'));
});
const updateMedicalFile = asyncHandler(async (req, res) => {
    const { height, weight, bloodType, allergies, chronicConditions } = req.body;
    const patient = await Patient.findOne({ user: req.user._id })
        .populate('medicalFile');
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    patient.medicalFile.height = height || patient.medicalFile.height;
    patient.medicalFile.weight = weight || patient.medicalFile.weight;
    patient.medicalFile.bloodType = bloodType || patient.medicalFile.bloodType;
    patient.medicalFile.allergies = allergies || patient.medicalFile.allergies;
    patient.medicalFile.chronicConditions = chronicConditions || patient.medicalFile.chronicConditions;
    await patient.medicalFile.save();
    res.status(200).json(new ApiResponse(200, patient.medicalFile, 'Medical file updated successfully.'));
});
const getAppointments = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    
    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({ _id: { $in: patient.appointments } })
        .populate('patient', 'firstName lastName email profilePictureUrl')
        .populate({
            path: 'doctor',
            select: 'user specialty',
            populate: {
                path: 'user',
                select: 'firstName lastName'
            }
        })
        .sort({ date: -1, time: -1 });
    
    res.status(200).json(new ApiResponse(200, appointments, 'Appointments retrieved successfully.'));
});
const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, time, reason, type } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const Appointment = require('../models/Appointment');
    const appointment = await Appointment.create({
        patient: patient._id,
        doctor: doctorId,
        date,
        time,
        reason,
        type,
        status: 'pending'
    });
    patient.appointments.push(appointment._id);
    await patient.save();
    res.status(201).json(new ApiResponse(201, appointment, 'Appointment created successfully.'));
});
const updateAppointment = asyncHandler(async (req, res) => {
    const { date, time, reason, status, type, notes } = req.body;
    const Appointment = require('../models/Appointment');
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }
    if (!['pending', 'confirmed'].includes(appointment.status)) {
        res.status(400);
        throw new Error(`Appointment cannot be edited as its status is '${appointment.status}'.`);
    }
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    if (appointment.patient.toString() !== patient._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to edit this appointment');
    }
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;
    appointment.type = type || appointment.type;
    appointment.notes = notes || appointment.notes;
    await appointment.save();
    res.status(200).json(new ApiResponse(200, appointment, 'Appointment updated successfully.'));
});
const deleteAppointment = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const Appointment = require('../models/Appointment');
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }
    patient.appointments = patient.appointments.filter(
        appId => appId.toString() !== req.params.id
    );
    await patient.save();
    await appointment.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'Appointment deleted successfully.'));
});
const getMedications = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .populate('medications');
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.status(200).json(new ApiResponse(200, patient.medications, 'Medications retrieved successfully.'));
});
const addMedication = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, startDate, endDate } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const medication = {
        name,
        dosage,
        frequency,
        startDate,
        endDate,
        status: 'active'
    };
    patient.medications.push(medication);
    await patient.save();
    res.status(201).json(new ApiResponse(201, medication, 'Medication added successfully.'));
});
const updateMedication = asyncHandler(async (req, res) => {
    const { dosage, frequency, endDate, status } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    const medication = patient.medications.id(req.params.id);
    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }
    medication.dosage = dosage || medication.dosage;
    medication.frequency = frequency || medication.frequency;
    medication.endDate = endDate || medication.endDate;
    medication.status = status || medication.status;
    await patient.save();
    res.status(200).json(new ApiResponse(200, medication, 'Medication updated successfully.'));
});
const deleteMedication = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });
    const medication = patient.medications.id(req.params.id);
    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }
    medication.remove();
    await patient.save();
    res.status(200).json(new ApiResponse(200, null, 'Medication deleted successfully.'));
});
const getConsultations = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .populate({
            path: 'consultations',
            populate: {
                path: 'doctor',
                select: 'name specialty hospital'
            }
        });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.status(200).json(new ApiResponse(200, patient.consultations, 'Consultations retrieved successfully.'));
});
const createConsultation = asyncHandler(async (req, res) => {
    const { doctorId, date, symptoms, notes } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const consultation = {
        doctor: doctorId,
        date,
        symptoms,
        notes,
        status: 'scheduled'
    };
    patient.consultations.push(consultation);
    await patient.save();
    res.status(201).json(new ApiResponse(201, consultation, 'Consultation created successfully.'));
});
const updateConsultation = asyncHandler(async (req, res) => {
    const { symptoms, notes, status } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    const consultation = patient.consultations.id(req.params.id);
    if (!consultation) {
        res.status(404);
        throw new Error('Consultation not found');
    }
    consultation.symptoms = symptoms || consultation.symptoms;
    consultation.notes = notes || consultation.notes;
    consultation.status = status || consultation.status;
    await patient.save();
    res.status(200).json(new ApiResponse(200, consultation, 'Consultation updated successfully.'));
});
const getPrescriptions = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .populate({
            path: 'prescriptions',
            populate: {
                path: 'doctor',
                select: 'name specialty hospital'
            }
        });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.status(200).json(new ApiResponse(200, patient.prescriptions, 'Prescriptions retrieved successfully.'));
});
const getActivePrescriptions = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .populate({
            path: 'prescriptions',
            match: { status: 'active' },
            populate: {
                path: 'doctor',
                select: 'name specialty hospital'
            }
        });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.status(200).json(new ApiResponse(200, patient.prescriptions, 'Active prescriptions retrieved successfully.'));
});
const getMessages = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
        .populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'name role'
            }
        });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.status(200).json(new ApiResponse(200, patient.messages, 'Messages retrieved successfully.'));
});
const sendMessage = asyncHandler(async (req, res) => {
    const { recipientId, content } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const message = {
        sender: req.user.id,
        recipient: recipientId,
        content,
        status: 'sent'
    };
    patient.messages.push(message);
    await patient.save();
    res.status(201).json(new ApiResponse(201, message, 'Message sent successfully.'));
});
const getDashboardSummary = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user.id })
        .select('medicalFile appointments medications')
        .populate('medicalFile')
        .populate({
            path: 'appointments',
            match: { status: 'scheduled' },
            options: { limit: 5 },
            populate: {
                path: 'doctor',
                populate: {
                    path: 'user',
                    select: 'firstName lastName'
                },
                select: 'user specialty hospital'
            }
        })
        .populate({
            path: 'medications',
            match: { status: 'active' },
            options: { limit: 5 }
        });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const summary = {
        profile: {
            id: patient._id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            address: patient.address
        },
        medicalFile: patient.medicalFile,
        appointments: patient.appointments,
        medications: patient.medications
    };
    res.status(200).json(new ApiResponse(200, summary, 'Dashboard summary retrieved successfully.'));
});
const getLatestVitals = asyncHandler(async (req, res) => {
    const Patient = require('../models/Patient');
    const MedicalFile = require('../models/MedicalFile');
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    const medicalFile = await MedicalFile.findById(patient.medicalFile);
    if (!medicalFile || !medicalFile.vitalSigns || medicalFile.vitalSigns.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, 'No vital signs found.'));
    }
    const latestVitals = medicalFile.vitalSigns[medicalFile.vitalSigns.length - 1];
    res.status(200).json(new ApiResponse(200, latestVitals, 'Latest vital signs retrieved successfully.'));
});
module.exports = {
    getProfile,
    updateProfile,
    getMedicalFile,
    updateMedicalFile,
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    getConsultations,
    createConsultation,
    updateConsultation,
    getPrescriptions,
    getActivePrescriptions,
    getMessages,
    sendMessage,
    getDashboardSummary,
    getLatestVitals,
};
