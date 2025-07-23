const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('doctorId', 'firstName lastName photo')
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');

    const doctorIds = prescriptions.map(p => p.doctorId?._id).filter(Boolean);
    const doctorSpecialties = await Doctor.find({ user: { $in: doctorIds } }).select('user specialty');
    const specialtyMap = {};
    doctorSpecialties.forEach(doc => {
      specialtyMap[doc.user.toString()] = doc.specialty;
    });

    const data = prescriptions.map(p => ({
      id: p._id,
      doctorName: p.doctorId ? `${p.doctorId.firstName} ${p.doctorId.lastName}` : null,
      doctorSpecialty: p.doctorId && specialtyMap[p.doctorId._id.toString()] ? specialtyMap[p.doctorId._id.toString()] : null,
      doctorPhoto: p.doctorId && p.doctorId.photo ? p.doctorId.photo : null,
      patientName: p.patientId ? `${p.patientId.firstName} ${p.patientId.lastName}` : null,
      date: p.issueDate,
      endDate: p.expiryDate,
      medications: p.medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        route: m.route,
        instructions: m.instructions,
        refillCount: m.refillCount,
        refillLimit: m.refillLimit,
      })),
      notes: p.notes,
      status: p.status,
    }));

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const p = await Prescription.findById(req.params.id)
      .populate('doctorId', 'firstName lastName photo')
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');
    if (!p) return res.status(404).json({ error: 'Prescription not found' });

    // Optionally, fetch doctor specialty as in getPrescriptions
    let doctorSpecialty = null;
    if (p.doctorId?._id) {
      const doc = await Doctor.findOne({ user: p.doctorId._id }).select('specialty');
      doctorSpecialty = doc ? doc.specialty : null;
    }

    const data = {
      id: p._id,
      doctorName: p.doctorId ? `${p.doctorId.firstName} ${p.doctorId.lastName}` : null,
      doctorSpecialty,
      doctorPhoto: p.doctorId && p.doctorId.photo ? p.doctorId.photo : null,
      patientName: p.patientId ? `${p.patientId.firstName} ${p.patientId.lastName}` : null,
      date: p.issueDate,
      endDate: p.expiryDate,
      medications: p.medications.map(m => ({
        _id: m._id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        route: m.route,
        instructions: m.instructions,
        dispensed: m.dispensed,
        refillCount: m.refillCount,
        refillLimit: m.refillLimit,
      })),
      notes: p.notes,
      status: p.status,
    };
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePrescriptionById = async (req, res) => {
  try {
    const p = await Prescription.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Prescription not found' });

    // Debug logging
    if (req.body.medications) {
      console.log('PATCH medications:', req.body.medications);
      p.medications.forEach(med => console.log('DB med _id:', med._id.toString()));
      req.body.medications.forEach(updateMed => {
        const med = p.medications.id(updateMed._id);
        if (med && updateMed.refillCount !== undefined) {
          med.refillCount = updateMed.refillCount;
        }
      });
    }

    // Update status if provided
    if (req.body.status) {
      p.status = req.body.status;
    }

    await p.save();

    // Populate and return updated prescription (same as getPrescriptionById)
    const updated = await Prescription.findById(p._id)
      .populate('doctorId', 'firstName lastName photo')
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');
    let doctorSpecialty = null;
    if (updated.doctorId?._id) {
      const doc = await Doctor.findOne({ user: updated.doctorId._id }).select('specialty');
      doctorSpecialty = doc ? doc.specialty : null;
    }
    const data = {
      id: updated._id,
      doctorName: updated.doctorId ? `${updated.doctorId.firstName} ${updated.doctorId.lastName}` : null,
      doctorSpecialty,
      doctorPhoto: updated.doctorId && updated.doctorId.photo ? updated.doctorId.photo : null,
      patientName: updated.patientId ? `${updated.patientId.firstName} ${updated.patientId.lastName}` : null,
      date: updated.issueDate,
      endDate: updated.expiryDate,
      medications: updated.medications.map(m => ({
        _id: m._id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        route: m.route,
        instructions: m.instructions,
        dispensed: m.dispensed,
        refillCount: m.refillCount,
        refillLimit: m.refillLimit,
      })),
      notes: updated.notes,
      status: updated.status,
    };
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medications, diagnosis, notes, status, issueDate, expiryDate } = req.body;
    if (!patientId || !doctorId || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const prescription = new Prescription({
      patientId,
      doctorId,
      medications,
      diagnosis,
      notes,
      status: status || 'active',
      issueDate: issueDate || new Date(),
      expiryDate: expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await prescription.save();
    // Populate and return created prescription (same as getPrescriptionById)
    const p = await Prescription.findById(prescription._id)
      .populate('doctorId', 'firstName lastName photo')
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');
    let doctorSpecialty = null;
    if (p.doctorId?._id) {
      const doc = await Doctor.findOne({ user: p.doctorId._id }).select('specialty');
      doctorSpecialty = doc ? doc.specialty : null;
    }
    const data = {
      id: p._id,
      doctorName: p.doctorId ? `${p.doctorId.firstName} ${p.doctorId.lastName}` : null,
      doctorSpecialty,
      doctorPhoto: p.doctorId && p.doctorId.photo ? p.doctorId.photo : null,
      patientName: p.patientId ? `${p.patientId.firstName} ${p.patientId.lastName}` : null,
      date: p.issueDate,
      endDate: p.expiryDate,
      medications: p.medications.map(m => ({
        _id: m._id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        route: m.route,
        instructions: m.instructions,
        dispensed: m.dispensed,
        refillCount: m.refillCount,
        refillLimit: m.refillLimit,
      })),
      notes: p.notes,
      status: p.status,
    };
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
