import axiosInstance from '../axiosInstance';

export const getDoctors = async () => {
  const res = await axiosInstance.get('/patients/doctors');
  return res.data.data;
};

export const getDoctorById = async (id) => {
  const res = await axiosInstance.get(`/doctors/${id}`);
  return res.data.data;
};

export const getPatientDetails = async (id) => {
  const res = await axiosInstance.get(`/patients/${id}`);
  return res.data.data;
};

export const createDoctor = async (doctorData) => {
  const res = await axiosInstance.post('/doctors', doctorData);
  return res.data.data;
};

export const updateDoctor = async (id, doctorData) => {
  const res = await axiosInstance.put(`/doctors/${id}`, doctorData);
  return res.data.data;
};

export const deleteDoctor = async (id) => {
  const res = await axiosInstance.delete(`/doctors/${id}`);
  return res.data.data;
};

// Doctor Profile Management
export const getDoctorProfile = async () => {
  const res = await axiosInstance.get('/doctors/profile');
  return res.data.data;
};

export const updateDoctorProfile = async (profileData) => {
  const res = await axiosInstance.patch('/doctors/profile', profileData);
  return res.data.data;
};

// Profile Image Upload
export const uploadProfileImage = async (formData) => {
  const res = await axiosInstance.post('/upload/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

// Achievements Management
export const addAchievement = async (achievementData) => {
  const res = await axiosInstance.post('/doctors/achievements', achievementData);
  return res.data.data;
};

export const updateAchievement = async (achievementId, achievementData) => {
  const res = await axiosInstance.put(`/doctors/achievements/${achievementId}`, achievementData);
  return res.data.data;
};

export const deleteAchievement = async (achievementId) => {
  const res = await axiosInstance.delete(`/doctors/achievements/${achievementId}`);
  return res.data.data;
};

// Education Management
export const addEducation = async (educationData) => {
  const res = await axiosInstance.post('/doctors/education', educationData);
  return res.data.data;
};

export const updateEducation = async (educationId, educationData) => {
  const res = await axiosInstance.put(`/doctors/education/${educationId}`, educationData);
  return res.data.data;
};

export const deleteEducation = async (educationId) => {
  const res = await axiosInstance.delete(`/doctors/education/${educationId}`);
  return res.data.data;
};

// Licenses Management
export const addLicense = async (licenseData) => {
  const res = await axiosInstance.post('/doctors/licenses', licenseData);
  return res.data.data;
};

export const updateLicense = async (licenseId, licenseData) => {
  const res = await axiosInstance.put(`/doctors/licenses/${licenseId}`, licenseData);
  return res.data.data;
};

export const deleteLicense = async (licenseId) => {
  const res = await axiosInstance.delete(`/doctors/licenses/${licenseId}`);
  return res.data.data;
};
