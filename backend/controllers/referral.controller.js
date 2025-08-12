const Referral = require('../models/Referral');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const ApiResponse = require('../utils/apiResponse');

exports.createReferral = asyncHandler(async (req, res) => {
  const { patientId, toDoctorId, reason, notes, urgency } = req.body;
  const fromDoctor = await Doctor.findOne({ user: req.user.id }).populate('user');
  if (!fromDoctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Referring doctor not found.'));
  }
  const patient = await Patient.findById(patientId).populate('user');
  if (!patient) {
    return res.status(404).json(new ApiResponse(404, null, 'Patient not found.'));
  }
  const patientBrief = {
    name: `${patient.user.firstName} ${patient.user.lastName}`,
    age: patient.user.age,
    gender: patient.user.gender,
    medicalId: patient.patientId,
    email: patient.user.email,
    phone: patient.user.phoneNumber,
    condition: patient.condition || '',
    profileImage: patient.user.profileImage || '',
  };
  const toDoctor = await Doctor.findById(toDoctorId);
  if (!toDoctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Receiving doctor not found.'));
  }
  const referral = await Referral.create({
    patient: patient._id,
    fromDoctor: fromDoctor._id,
    toDoctor: toDoctor._id,
    reason,
    notes,
    urgency
  });
  await Notification.create({
    user: toDoctor.user,
    title: 'New Patient Referral',
    message: `You have received a referral for a patient.`,
    type: 'referral',
    data: {
      referralId: referral._id,
      patientId: patient._id,
      patientUserId: patient.user._id,
      patientBrief,
      fromDoctorUserId: fromDoctor.user._id,
      fromDoctorName: `${fromDoctor.user.firstName} ${fromDoctor.user.lastName}`,
      fromDoctorId: fromDoctor._id,
      reason,
      notes,
      urgency
    }
  });
  res.status(201).json(new ApiResponse(201, referral, 'Referral created.'));
});

exports.updateReferralStatus = asyncHandler(async (req, res) => {
  const { referralId } = req.params;
  const { status } = req.body; 
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid status.'));
  }
  const referral = await Referral.findById(referralId);
  if (!referral) {
    return res.status(404).json(new ApiResponse(404, null, 'Referral not found.'));
  }
  const toDoctor = await Doctor.findOne({ user: req.user.id });
  if (!toDoctor || !referral.toDoctor.equals(toDoctor._id)) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized.'));
  }
  referral.status = status;
  await referral.save();
  if (status === 'accepted') {
    if (!toDoctor.patientsList.includes(referral.patient)) {
      toDoctor.patientsList.push(referral.patient);
      await toDoctor.save();
    }
  }
  await Notification.create({
    user: referral.fromDoctor,
    title: 'Referral Update',
    message: `Your referral was ${status}.`,
    type: 'referral',
    data: {
      referralId: referral._id,
      patientId: referral.patient,
      patientUserId: referral.user,
      toDoctorUserId: toDoctor.user,
      toDoctorId: toDoctor._id,
      status
    }
  });
  res.json(new ApiResponse(200, referral, `Referral ${status}.`));
});

exports.getReferralsForDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user.id });
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }
  const sent = await Referral.find({ fromDoctor: doctor._id })
    .populate('patient')
    .populate('toDoctor');
  const received = await Referral.find({ toDoctor: doctor._id })
    .populate('patient')
    .populate('fromDoctor');
  res.json(new ApiResponse(200, { sent, received }, 'Referrals fetched.'));
});
  
exports.getReferralsForPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const referrals = await Referral.find({ patient: patientId })
    .populate('fromDoctor')
    .populate('toDoctor');
  res.json(new ApiResponse(200, referrals, 'Patient referrals fetched.'));
}); 