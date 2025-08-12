const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');

router.get('/', prescriptionController.getPrescriptions);
router.get('/:id', prescriptionController.getPrescriptionById);
router.put('/:id', prescriptionController.updatePrescriptionById);
router.patch('/:id', prescriptionController.updatePrescriptionById);
router.post('/', prescriptionController.createPrescription);
router.post('/:prescriptionId/dispense', prescriptionController.dispensePrescription);

router.post('/test/trigger-event', (req, res) => {
  const { eventType, prescriptionId, userId } = req.body;
  const { getIO } = require('../utils/socket.utils');
  const io = getIO();

  if (!io) {
    return res.status(500).json({ error: 'Socket.io not available' });
  }

  const testData = {
    prescriptionId: prescriptionId || 'test-prescription-id',
    message: `Test ${eventType} event`,
    prescription: {
      id: prescriptionId || 'test-prescription-id',
      patientName: 'Test Patient',
      doctorName: 'Test Doctor',
      status: 'active',
      medications: []
    },
    type: eventType
  };

  if (userId) {
    io.to(userId).emit(`prescription:${eventType}`, testData);
    console.log(`🔔 Test: Emitted prescription:${eventType} to user:`, userId);
  } else {
    io.emit(`prescription:${eventType}`, testData);
    console.log(`🔔 Test: Broadcasted prescription:${eventType} to all users`);
  }

  res.json({ 
    success: true, 
    message: `Test event 'prescription:${eventType}' triggered`,
    data: testData
  });
});

module.exports = router;
