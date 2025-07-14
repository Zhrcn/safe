const MedicineRequest = require('../models/MedicineRequest');
const Pharmacist = require('../models/Pharmacist');

// Create a new medicine request
exports.createMedicineRequest = async (req, res) => {
  try {
    const { pharmacyId, medicineName } = req.body;
    if (!pharmacyId || !medicineName) {
      return res.status(400).json({ error: 'pharmacyId and medicineName are required.' });
    }
    const pharmacy = await Pharmacist.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found.' });
    }
    const request = await MedicineRequest.create({
      doctor: req.user.id,
      pharmacy: pharmacyId,
      medicineName,
      status: 'pending',
      available: null,
      message: ''
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all medicine requests for the current doctor
exports.getMedicineRequests = async (req, res) => {
  try {
    const requests = await MedicineRequest.find({ doctor: req.user.id })
      .populate({
        path: 'pharmacy',
        select: 'pharmacyName user',
        populate: { path: 'user', select: 'firstName lastName email profileImage' }
      })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 