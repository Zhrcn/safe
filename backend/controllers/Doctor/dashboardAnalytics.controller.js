const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Appointment = require('../../models/Appointment');
const Doctor = require('../../models/Doctor');
const Patient = require('../../models/Patient');
const Prescription = require('../../models/Prescription');
const User = require('../../models/User');
const MedicalFile = require('../../models/MedicalFile');

// Get comprehensive analytics for doctor
exports.getComprehensiveAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const doctor = await Doctor.findOne({ user: userId });
  
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Get date range for analytics (last 7 months for trends)
  const sevenMonthsAgo = new Date();
  sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all appointments for this doctor
  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email gender age'
      }
    });

  // Get prescriptions for this doctor
  const prescriptions = await Prescription.find({ doctorId: userId });

  // Calculate basic statistics
  const totalPatients = new Set(appointments.map(apt => apt.patient._id.toString())).size;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date) > new Date()
  ).length;
  const prescriptionsIssued = prescriptions.length;

  // Calculate new patients this month
  const newPatientsThisMonth = appointments
    .filter(apt => new Date(apt.createdAt) >= thirtyDaysAgo)
    .reduce((acc, apt) => {
      const patientId = apt.patient._id.toString();
      if (!acc.has(patientId)) {
        acc.add(patientId);
        return acc;
      }
      return acc;
    }, new Set()).size;

  // Calculate appointment trends (last 7 months)
  const appointmentTrends = {
    labels: [],
    data: []
  };

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    appointmentTrends.labels.push(monthName);
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthAppointments = appointments.filter(apt => 
      new Date(apt.date) >= monthStart && new Date(apt.date) <= monthEnd
    ).length;
    
    appointmentTrends.data.push(monthAppointments);
  }

  // Calculate prescription trends (last 7 months)
  const prescriptionTrends = {
    labels: [],
    data: []
  };

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    prescriptionTrends.labels.push(monthName);
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthPrescriptions = prescriptions.filter(pres => 
      new Date(pres.issueDate) >= monthStart && new Date(pres.issueDate) <= monthEnd
    ).length;
    
    prescriptionTrends.data.push(monthPrescriptions);
  }

  // Calculate patient distribution by gender
  const patientGenderMap = new Map();
  appointments.forEach(apt => {
    const patientId = apt.patient._id.toString();
    if (!patientGenderMap.has(patientId)) {
      patientGenderMap.set(patientId, apt.patient.user.gender || 'other');
    }
  });

  const genderCounts = { male: 0, female: 0, other: 0 };
  patientGenderMap.forEach(gender => {
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;
  });

  const patientDistribution = {
    labels: ['Male', 'Female', 'Other'],
    data: [genderCounts.male, genderCounts.female, genderCounts.other]
  };

  // Calculate appointment type distribution
  const appointmentTypeCounts = {};
  appointments.forEach(apt => {
    appointmentTypeCounts[apt.type] = (appointmentTypeCounts[apt.type] || 0) + 1;
  });

  const appointmentTypeDistribution = {
    labels: Object.keys(appointmentTypeCounts).map(type => 
      type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')
    ),
    data: Object.values(appointmentTypeCounts)
  };

  // Calculate average patient age
  const patientAges = [];
  const patientAgeMap = new Map();
  appointments.forEach(apt => {
    const patientId = apt.patient._id.toString();
    if (!patientAgeMap.has(patientId) && apt.patient.user.age) {
      patientAges.push(apt.patient.user.age);
      patientAgeMap.set(patientId, apt.patient.user.age);
    }
  });

  const avgPatientAge = patientAges.length > 0 
    ? Math.round(patientAges.reduce((sum, age) => sum + age, 0) / patientAges.length)
    : 0;

  // Calculate gender age distribution
  const genderAgeData = { male: [], female: [], other: [] };
  patientAgeMap.forEach((age, patientId) => {
    const gender = patientGenderMap.get(patientId) || 'other';
    genderAgeData[gender].push(age);
  });

  const genderAgeDistribution = {
    labels: ['Male', 'Female', 'Other'],
    data: [
      genderAgeData.male.length > 0 ? Math.round(genderAgeData.male.reduce((sum, age) => sum + age, 0) / genderAgeData.male.length) : 0,
      genderAgeData.female.length > 0 ? Math.round(genderAgeData.female.reduce((sum, age) => sum + age, 0) / genderAgeData.female.length) : 0,
      genderAgeData.other.length > 0 ? Math.round(genderAgeData.other.reduce((sum, age) => sum + age, 0) / genderAgeData.other.length) : 0
    ]
  };

  // Calculate no-show rate
  const noShowAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
  const noShowRate = totalAppointments > 0 ? noShowAppointments / totalAppointments : 0;

  // Calculate busiest day and hour
  const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const hourCounts = {};
  
  appointments.forEach(apt => {
    const day = new Date(apt.date).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
    
    if (apt.time && apt.time !== 'TBD') {
      const hour = apt.time.split(':')[0];
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const busiestDay = Object.keys(dayCounts).length > 0 
    ? days[Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b)]
    : 'No data';
  
  const busiestHour = Object.keys(hourCounts).length > 0
    ? Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b)
    : '09';
  const busiestHourFormatted = `${busiestHour}:00`;

  // Calculate average appointment duration (placeholder - would need actual duration data)
  const avgAppointmentDuration = 32; // minutes

  // Get top medical conditions from patient medical files
  const patientIds = [...new Set(appointments.map(apt => apt.patient._id))];
  let topConditions = [];
  
  try {
    const medicalFiles = await MedicalFile.find({ patientId: { $in: patientIds } });
    
    const conditionCounts = {};
    medicalFiles.forEach(file => {
      if (file.chronicConditions) {
        file.chronicConditions.forEach(condition => {
          conditionCounts[condition.name] = (conditionCounts[condition.name] || 0) + 1;
        });
      }
      if (file.diagnoses) {
        file.diagnoses.forEach(diagnosis => {
          conditionCounts[diagnosis.conditionName] = (conditionCounts[diagnosis.conditionName] || 0) + 1;
        });
      }
    });

    topConditions = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  } catch (error) {
    console.error('Error fetching medical conditions:', error);
    // Fallback to empty array if there's an error
    topConditions = [];
  }

  // Get recent patients
  const recentPatients = appointments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(apt => ({
      name: `${apt.patient.user.firstName} ${apt.patient.user.lastName}`,
      lastVisit: apt.date.toISOString().split('T')[0]
    }));

  const analytics = {
    totalPatients,
    newPatientsThisMonth,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    upcomingAppointments,
    prescriptionsIssued,
    appointmentTrends,
    patientDistribution,
    topConditions,
    prescriptionTrends,
    appointmentTypeDistribution,
    avgAppointmentDuration,
    avgPatientAge,
    genderAgeDistribution,
    noShowRate,
    busiestDay,
    busiestHour: busiestHourFormatted,
    recentPatients
  };

  res.status(200).json(new ApiResponse(200, analytics, 'Comprehensive analytics fetched successfully.'));
});

// Get dashboard analytics overview
exports.getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const doctor = await Doctor.findOne({ user: userId });
  
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Get date range for analytics (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get appointments in the last 30 days
  const appointments = await Appointment.find({
    doctor: doctor._id,
    date: { $gte: thirtyDaysAgo }
  });

  // Calculate analytics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  
  // Calculate revenue (assuming consultation fee is stored in doctor model)
  const revenue = completedAppointments * (doctor.consultationFee || 0);
  
  // Get unique patients
  const uniquePatientIds = [...new Set(appointments.map(apt => apt.patient.toString()))];
  const totalPatients = uniquePatientIds.length;

  // Calculate average rating (if you have a rating system)
  const averageRating = 4.5; // Placeholder - implement actual rating calculation

  const analytics = {
    totalPatients,
    totalAppointments,
    completedAppointments,
    pendingAppointments,
    revenue,
    averageRating
  };

  res.status(200).json(new ApiResponse(200, analytics, 'Dashboard analytics fetched successfully.'));
});

// Get appointments analytics for charts
exports.getAppointmentsAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period = 'week' } = req.query;
  const doctor = await Doctor.findOne({ user: userId });
  
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  let startDate, labels, data;
  
  if (period === 'week') {
    // Last 7 days
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    data = new Array(7).fill(0);
    
    const appointments = await Appointment.find({
      doctor: doctor._id,
      date: { $gte: startDate }
    });

    appointments.forEach(appointment => {
      const dayOfWeek = appointment.date.getDay();
      data[dayOfWeek] = (data[dayOfWeek] || 0) + 1;
    });
    
    // Reorder data to start with Monday
    const reorderedData = [...data.slice(1), data[0]];
    data = reorderedData;
    
  } else if (period === 'month') {
    // Last 30 days
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    labels = [];
    data = new Array(30).fill(0);
    
    const appointments = await Appointment.find({
      doctor: doctor._id,
      date: { $gte: startDate }
    });

    appointments.forEach(appointment => {
      const dayIndex = Math.floor((new Date() - appointment.date) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 30) {
        data[29 - dayIndex] = (data[29 - dayIndex] || 0) + 1;
      }
    });
    
    // Generate labels for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.getDate().toString());
    }
  }

  const chartData = {
    labels,
    data
  };

  res.status(200).json(new ApiResponse(200, chartData, 'Appointments analytics fetched successfully.'));
});

// Get patient distribution
exports.getPatientDistribution = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const doctor = await Doctor.findOne({ user: userId });
  
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  // Get all appointments for this doctor
  const appointments = await Appointment.find({ doctor: doctor._id });

  // Categorize patients
  const patientCategories = {
    new: 0,
    followUp: 0,
    emergency: 0,
    regular: 0
  };

  const patientAppointmentCount = new Map();

  appointments.forEach(appointment => {
    const patientId = appointment.patient.toString();
    const currentCount = patientAppointmentCount.get(patientId) || 0;
    patientAppointmentCount.set(patientId, currentCount + 1);
  });

  // Categorize based on appointment count and type
  patientAppointmentCount.forEach((count, patientId) => {
    if (count === 1) {
      patientCategories.new++;
    } else if (count >= 2 && count <= 5) {
      patientCategories.followUp++;
    } else if (count > 5) {
      patientCategories.regular++;
    }
  });

  // Count emergency appointments
  const emergencyAppointments = appointments.filter(apt => apt.type === 'emergency');
  patientCategories.emergency = new Set(emergencyAppointments.map(apt => apt.patient.toString())).size;

  const distribution = {
    labels: ['New', 'Follow-up', 'Emergency', 'Regular'],
    data: [
      patientCategories.new,
      patientCategories.followUp,
      patientCategories.emergency,
      patientCategories.regular
    ]
  };

  res.status(200).json(new ApiResponse(200, distribution, 'Patient distribution fetched successfully.'));
});

// Get recent appointments
exports.getRecentAppointments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 10 } = req.query;
  const doctor = await Doctor.findOne({ user: userId });
  
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email profilePictureUrl'
      }
    })
    .sort({ date: -1, time: -1 })
    .limit(parseInt(limit));

  res.status(200).json(new ApiResponse(200, appointments, 'Recent appointments fetched successfully.'));
});

// Get appointments for specific date
exports.getAppointmentsByDate = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { date } = req.params;
  const doctor = await Doctor.findOne({ user: userId });
  
  if (!doctor) {
    return res.status(404).json(new ApiResponse(404, null, 'Doctor not found.'));
  }

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctor: doctor._id,
    date: { $gte: startDate, $lte: endDate }
  })
  .populate({
    path: 'patient',
    populate: {
      path: 'user',
      select: 'firstName lastName email profilePictureUrl'
    }
  })
  .sort({ time: 1 });

  res.status(200).json(new ApiResponse(200, appointments, 'Appointments for date fetched successfully.'));
}); 