const MedicineRequest = require('../models/MedicineRequest');
const Pharmacist = require('../models/Pharmacist');

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

exports.deleteMedicineRequest = async (req, res) => {
  try {
    const request = await MedicineRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Medicine request not found.' });
    }
    if (request.doctor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this request.' });
    }
    await request.deleteOne();
    res.status(200).json({ message: 'Medicine request deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.respondToMedicineRequest = async (req, res) => {
  try {
    const { available, message } = req.body;
    const request = await MedicineRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Medicine request not found.' });
    }
    const pharmacist = await Pharmacist.findOne({ user: req.user.id });
    if (!pharmacist || request.pharmacy.toString() !== pharmacist._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to respond to this request.' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request has already been responded to.' });
    }
    request.status = 'responded';
    request.available = available;
    request.message = message || '';
    await request.save();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPharmacyMedicineRequests = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findOne({ user: req.user.id });
    if (!pharmacist) {
      return res.status(404).json({ error: 'Pharmacist profile not found.' });
    }
    const requests = await MedicineRequest.find({ pharmacy: pharmacist._id })
      .populate({
        path: 'doctor',
        select: 'firstName lastName email profileImage'
      })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 