const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { createNotification } = require('../utils/notification.utils');
const { getIO } = require('../utils/socket.utils');

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate({
        path: 'doctorId',
        populate: { path: 'user', select: 'firstName lastName profileImage' }
      })
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');

    const data = prescriptions.map(p => ({
      id: p._id,
      doctorName: p.doctorId && p.doctorId.user
        ? `${p.doctorId.user.firstName} ${p.doctorId.user.lastName}`
        : null,
      doctorSpecialty: p.doctorId ? p.doctorId.specialty : null,
      doctorPhoto: p.doctorId && p.doctorId.user && p.doctorId.user.profileImage
        ? p.doctorId.user.profileImage
        : null,
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

    if (req.body.medications) {
      p.medications.forEach(med => {
        const updateMed = req.body.medications.find(u => u._id === String(med._id));
        if (updateMed && updateMed.refillCount !== undefined) {
          med.refillCount = updateMed.refillCount;
        }
      });
    }

    if (req.body.status) {
      p.status = req.body.status;
      console.log('Prescription status set to:', p.status);
    }

    await p.save();

    if (p.status === 'filled' && Array.isArray(req.body.medications)) {
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ user: p.patientId });
      if (patient) {
        let newMeds = [];
        req.body.medications.forEach(updateMed => {
          const med = p.medications.find(m => String(m._id) === String(updateMed._id));
          if (!med) return;
          const alreadyExists = patient.medications.some(pm =>
            pm.name === med.name &&
            pm.dosage === med.dosage &&
            pm.frequency === med.frequency
          );
          if (!alreadyExists) {
            const newMed = {
              name: med.name,
              dosage: med.dosage,
              frequency: med.frequency,
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              prescribedBy: p.doctorId,
              status: 'active',
              notes: med.instructions || ''
            };
            patient.medications.push(newMed);
            newMeds.push(newMed);
          }
        });
        await patient.save();
        if (newMeds.length > 0) {
          await createNotification(
            patient.user.toString(),
            'New Medication Added',
            `New medication(s) have been dispensed: ${newMeds.map(m => m.name).join(', ')}`,
            'medication',
            p._id.toString(),
            'Prescription'
          );
        }
      }
    }

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
    if (updated.patientId && updated.patientId._id) {
      await createNotification(
        updated.patientId._id.toString(),
        'Prescription Updated',
        'A prescription has been updated for you.',
        'prescription',
        updated._id.toString(),
        'Prescription'
      );

      try {
        const io = getIO();
        io.to(updated.patientId._id.toString()).emit('prescription:updated', {
          prescriptionId: updated._id.toString(),
          message: 'Your prescription has been updated',
          prescription: data,
          type: 'updated'
        });
        console.log('🔔 Backend: Emitted prescription:updated event to patient:', updated.patientId._id.toString());
      } catch (error) {
        console.error('❌ Backend: Error emitting prescription update event:', error);
      }
    }
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
    if (p.patientId && p.patientId._id) {
      await createNotification(
        p.patientId._id.toString(),
        'New Prescription',
        'A new prescription has been issued for you.',
        'prescription',
        p._id.toString(),
        'Prescription'
      );

      try {
        const io = getIO();
        io.to(p.patientId._id.toString()).emit('prescription:new', {
          prescriptionId: p._id.toString(),
          message: `New prescription from Dr. ${p.doctorId?.firstName || 'Doctor'}`,
          prescription: data,
          type: 'created'
        });
        console.log('🔔 Backend: Emitted prescription:new event to patient:', p.patientId._id.toString());
      } catch (error) {
        console.error('❌ Backend: Error emitting prescription creation event:', error);
      }
    }
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dispensePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { medications, pharmacistId, pharmacyNotes } = req.body;

    const prescription = await Prescription.findById(prescriptionId)
      .populate('doctorId', 'firstName lastName photo')
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    if (medications && Array.isArray(medications)) {
      prescription.medications.forEach(med => {
        const updateMed = medications.find(u => u._id === String(med._id));
        if (updateMed && updateMed.refillCount !== undefined) {
          med.refillCount = updateMed.refillCount;
        }
      });
    }

    prescription.dispenseHistory.push({
      pharmacistId,
      dispenseDate: new Date(),
      quantityDispensed: medications ? JSON.stringify(medications) : '',
      pharmacyNotes
    });

    const allFullyDispensed = prescription.medications.every(med => 
      (med.refillCount || 0) >= (med.refillLimit || 1)
    );

    if (allFullyDispensed) {
      prescription.status = 'filled';
    } else {
      prescription.status = 'partially_filled';
    }

    await prescription.save();

    const updated = await Prescription.findById(prescription._id)
      .populate('doctorId', 'firstName lastName photo')
      .populate('patientId', 'firstName lastName')
      .populate('medications.medicineId', 'name');

    const data = {
      id: updated._id,
      doctorName: updated.doctorId ? `${updated.doctorId.firstName} ${updated.doctorId.lastName}` : null,
      doctorSpecialty: updated.doctorId ? updated.doctorId.specialty : null,
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
        refillCount: m.refillCount,
        refillLimit: m.refillLimit,
      })),
      notes: updated.notes,
      status: updated.status,
      dispenseHistory: updated.dispenseHistory
    };

    if (updated.patientId && updated.patientId._id) {
      try {
        const io = getIO();
        io.to(updated.patientId._id.toString()).emit('prescription:dispensed', {
          prescriptionId: updated._id.toString(),
          message: 'Your prescription has been dispensed',
          prescription: data,
          dispenseData: {
            medications,
            pharmacistId,
            pharmacyNotes,
            dispenseDate: new Date()
          },
          type: 'dispensed'
        });
      } catch (error) {
      }

      await createNotification(
        updated.patientId._id.toString(),
        'Prescription Dispensed',
        'Your prescription has been dispensed successfully.',
        'prescription',
        updated._id.toString(),
        'Prescription'
      );
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
