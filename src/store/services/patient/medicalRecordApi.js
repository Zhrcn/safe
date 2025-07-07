import axiosInstance from '../axiosInstance';

export const getMedicalRecords = async () => {
  const res = await axiosInstance.get('/medical-records');
  return res.data.data;
};

export const addVitalSigns = async (vitalSignsData) => {
  const res = await axiosInstance.post('/medical-records/vital-signs', vitalSignsData);
  return res.data.data;
};

export const addAllergy = async (allergyData) => {
  const res = await axiosInstance.post('/medical-records/allergies', allergyData);
  return res.data.data;
};

export const addChronicCondition = async (conditionData) => {
  const res = await axiosInstance.post('/medical-records/chronic-conditions', conditionData);
  return res.data.data;
};

export const addDiagnosis = async (diagnosisData) => {
  const res = await axiosInstance.post('/medical-records/diagnoses', diagnosisData);
  return res.data.data;
};

export const addLabResult = async (labResultData) => {
  const res = await axiosInstance.post('/medical-records/lab-results', labResultData);
  return res.data.data;
};

export const addImagingReport = async (imagingData) => {
  const res = await axiosInstance.post('/medical-records/imaging-reports', imagingData);
  return res.data.data;
};

export const addMedication = async (medicationData) => {
  const res = await axiosInstance.post('/medical-records/medications', medicationData);
  return res.data.data;
};

export const updateRecordItem = async (category, itemId, updateData) => {
  const res = await axiosInstance.put(`/medical-records/${category}/${itemId}`, updateData);
  return res.data.data;
};

export const deleteRecordItem = async (category, itemId) => {
  const res = await axiosInstance.delete(`/medical-records/${category}/${itemId}`);
  return res.data.data;
};

export const addMedicalRecord = async (recordData) => {
  const res = await axiosInstance.post('/medical-records', recordData);
  return res.data.data;
};

export const updateMedicalRecord = async (id, recordData) => {
  const res = await axiosInstance.put(`/medical-records/${id}`, recordData);
  return res.data.data;
};

export const deleteMedicalRecord = async (id) => {
  const res = await axiosInstance.delete(`/medical-records/${id}`);
  return res.data.data;
}; 