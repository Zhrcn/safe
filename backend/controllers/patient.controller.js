// backend/controllers/patient.controller.js
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalFile = require('../models/MedicalFile');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get patient profile
// @route   GET /api/v1/patients/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
        .select('-password')
        .populate('medicalFile');

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    res.status(200).json(new ApiResponse(200, patient, 'Patient profile retrieved successfully.'));
});

// @desc    Update patient profile
// @route   PUT /api/v1/patients/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    patient.name = name || patient.name;
    patient.email = email || patient.email;
    patient.phone = phone || patient.phone;
    patient.address = address || patient.address;

    await patient.save();

    res.status(200).json(new ApiResponse(200, patient, 'Patient profile updated successfully.'));
});

// @desc    Get patient medical file
// @route   GET /api/v1/patients/medical-file
// @access  Private
const getMedicalFile = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
        .select('medicalFile')
        .populate('medicalFile');

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    res.status(200).json(new ApiResponse(200, patient.medicalFile, 'Medical file retrieved successfully.'));
});

// @desc    Update patient medical file
// @route   PUT /api/v1/patients/medical-file
// @access  Private
const updateMedicalFile = asyncHandler(async (req, res) => {
    const { height, weight, bloodType, allergies, chronicConditions } = req.body;

    const patient = await Patient.findById(req.user.id)
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

// @desc    Get patient appointments
// @route   GET /api/v1/patients/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
        .populate({
            path: 'appointments',
            populate: {
                path: 'doctor',
                select: 'name specialty hospital'
            }
        });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    res.status(200).json(new ApiResponse(200, patient.appointments, 'Appointments retrieved successfully.'));
});

// @desc    Create appointment
// @route   POST /api/v1/patients/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, time, reason } = req.body;

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    const appointment = {
        doctor: doctorId,
        date,
        time,
        reason,
        status: 'scheduled'
    };

    patient.appointments.push(appointment);
    await patient.save();

    res.status(201).json(new ApiResponse(201, appointment, 'Appointment created successfully.'));
});

// @desc    Update appointment
// @route   PUT /api/v1/patients/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
    const { date, time, reason, status } = req.body;

    const patient = await Patient.findById(req.user.id);
    const appointment = patient.appointments.id(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;
    appointment.status = status || appointment.status;

    await patient.save();

    res.status(200).json(new ApiResponse(200, appointment, 'Appointment updated successfully.'));
});

// @desc    Delete appointment
// @route   DELETE /api/v1/patients/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id);
    const appointment = patient.appointments.id(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    appointment.remove();
    await patient.save();

    res.status(200).json(new ApiResponse(200, null, 'Appointment deleted successfully.'));
});

// @desc    Get patient medications
// @route   GET /api/v1/patients/medications
// @access  Private
const getMedications = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
        .populate('medications');

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    res.status(200).json(new ApiResponse(200, patient.medications, 'Medications retrieved successfully.'));
});

// @desc    Add medication
// @route   POST /api/v1/patients/medications
// @access  Private
const addMedication = asyncHandler(async (req, res) => {
    const { name, dosage, frequency, startDate, endDate } = req.body;

    const patient = await Patient.findById(req.user.id);

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

// @desc    Update medication
// @route   PUT /api/v1/patients/medications/:id
// @access  Private
const updateMedication = asyncHandler(async (req, res) => {
    const { dosage, frequency, endDate, status } = req.body;

    const patient = await Patient.findById(req.user.id);
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

// @desc    Delete medication
// @route   DELETE /api/v1/patients/medications/:id
// @access  Private
const deleteMedication = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id);
    const medication = patient.medications.id(req.params.id);

    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }

    medication.remove();
    await patient.save();

    res.status(200).json(new ApiResponse(200, null, 'Medication deleted successfully.'));
});

// @desc    Get patient consultations
// @route   GET /api/v1/patients/consultations
// @access  Private
const getConsultations = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
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

// @desc    Create consultation
// @route   POST /api/v1/patients/consultations
// @access  Private
const createConsultation = asyncHandler(async (req, res) => {
    const { doctorId, date, symptoms, notes } = req.body;

    const patient = await Patient.findById(req.user.id);

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

// @desc    Update consultation
// @route   PUT /api/v1/patients/consultations/:id
// @access  Private
const updateConsultation = asyncHandler(async (req, res) => {
    const { symptoms, notes, status } = req.body;

    const patient = await Patient.findById(req.user.id);
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

// @desc    Get patient prescriptions
// @route   GET /api/v1/patients/prescriptions
// @access  Private
const getPrescriptions = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
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

// @desc    Get active prescriptions
// @route   GET /api/v1/patients/prescriptions/active
// @access  Private
const getActivePrescriptions = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
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

// @desc    Get patient messages
// @route   GET /api/v1/patients/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.user.id)
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

// @desc    Send message
// @route   POST /api/v1/patients/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { recipientId, content } = req.body;

    const patient = await Patient.findById(req.user.id);

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

// @desc    Get dashboard summary
// @route   GET /api/v1/patients/dashboard/summary
// @access  Private
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
                select: 'name specialty hospital'
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
};
