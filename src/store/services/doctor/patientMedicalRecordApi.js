import axiosInstance from '../axiosInstance';

// Get patient medical records
export const getPatientMedicalRecords = async (patientId) => {
  const res = await axiosInstance.get(`/doctor-medical-records/${patientId}`);
  return res.data.data;
};

// Add vital signs
export const addPatientVitalSigns = async (patientId, vitalSignsData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/vital-signs`, vitalSignsData);
  return res.data.data;
};

// Add allergy
export const addPatientAllergy = async (patientId, allergyData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/allergies`, allergyData);
  return res.data.data;
};

// Add chronic condition
export const addPatientChronicCondition = async (patientId, conditionData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/chronic-conditions`, conditionData);
  return res.data.data;
};

// Add diagnosis
export const addPatientDiagnosis = async (patientId, diagnosisData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/diagnoses`, diagnosisData);
  return res.data.data;
};

// Add lab result
export const addPatientLabResult = async (patientId, labResultData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/lab-results`, labResultData);
  return res.data.data;
};

// Add imaging report
export const addPatientImagingReport = async (patientId, imagingData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/imaging-reports`, imagingData);
  return res.data.data;
};

// Add medication
export const addPatientMedication = async (patientId, medicationData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/medications`, medicationData);
  return res.data.data;
};

// Add immunization
export const addPatientImmunization = async (patientId, immunizationData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/immunizations`, immunizationData);
  return res.data.data;
};

// Add surgical history
export const addPatientSurgicalHistory = async (patientId, surgicalData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/surgical-history`, surgicalData);
  return res.data.data;
};

// Add document
export const addPatientDocument = async (patientId, documentData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/documents`, documentData);
  return res.data.data;
};

// Add family history
export const addPatientFamilyHistory = async (patientId, familyData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/family-history`, familyData);
  return res.data.data;
};

// Add social history
export const addPatientSocialHistory = async (patientId, socialData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/social-history`, socialData);
  return res.data.data;
};

// Add general history
export const addPatientGeneralHistory = async (patientId, generalData) => {
  const res = await axiosInstance.post(`/doctor-medical-records/${patientId}/general-history`, generalData);
  return res.data.data;
};

// Update record item
export const updatePatientRecordItem = async (patientId, category, itemId, updateData) => {
  const res = await axiosInstance.put(`/doctor-medical-records/${patientId}/${category}/${itemId}`, updateData);
  return res.data.data;
};

// Delete record item
export const deletePatientRecordItem = async (patientId, category, itemId) => {
  const res = await axiosInstance.delete(`/doctor-medical-records/${patientId}/${category}/${itemId}`);
  return res.data.data;
};

// Generic function to add any type of medical record
export const addPatientMedicalRecord = async (patientId, category, recordData) => {
  const categoryMap = {
    vitalSigns: addPatientVitalSigns,
    allergies: addPatientAllergy,
    chronicConditions: addPatientChronicCondition,
    diagnoses: addPatientDiagnosis,
    labResults: addPatientLabResult,
    imagingReports: addPatientImagingReport,
    medications: addPatientMedication,
    immunizations: addPatientImmunization,
    surgicalHistory: addPatientSurgicalHistory,
    documents: addPatientDocument,
    familyHistory: addPatientFamilyHistory,
    socialHistory: addPatientSocialHistory,
    generalHistory: addPatientGeneralHistory
  };

  const addFunction = categoryMap[category];
  if (!addFunction) {
    throw new Error(`Invalid category: ${category}`);
  }

  return await addFunction(patientId, recordData);
}; 