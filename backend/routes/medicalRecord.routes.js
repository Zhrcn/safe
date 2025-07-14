const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getMedicalRecords,
    addVitalSigns,
    addAllergy,
    addChronicCondition,
    addDiagnosis,
    addLabResult,
    addImagingReport,
    addMedication,
    updateRecordItem,
    deleteRecordItem
} = require('../controllers/medicalRecord.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = 'public/patient/medicalRecord/';
    if (req.url.includes('labtest')) dest += 'labtest';
    else if (req.url.includes('imaging')) dest += 'imaging';
    else dest += 'other';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(protect);

router.get('/', getMedicalRecords);

router.post('/vital-signs', addVitalSigns);
router.post('/allergies', addAllergy);
router.post('/chronic-conditions', addChronicCondition);
router.post('/diagnoses', addDiagnosis);
router.post('/lab-results', addLabResult);
router.post('/imaging-reports', addImagingReport);
router.post('/medications', addMedication);

router.put('/:category/:itemId', updateRecordItem);
router.delete('/:category/:itemId', deleteRecordItem);

router.post('/upload/labtest', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/patient/medicalRecord/labtest/${req.file.filename}`;
  res.json({ filePath });
});

router.post('/upload/imaging', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/patient/medicalRecord/imaging/${req.file.filename}`;
  res.json({ filePath });
});

module.exports = router; 