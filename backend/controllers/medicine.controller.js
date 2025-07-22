const Medicine = require('../models/Medicine');

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
