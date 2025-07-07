const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('doctorId', 'firstName lastName photo') 
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
      date: p.issueDate,
      endDate: p.expiryDate,
      medications: p.medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        route: m.route,
        instructions: m.instructions,
      })),
      notes: p.notes,
      status: p.status,
    }));

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
