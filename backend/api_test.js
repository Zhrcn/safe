const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjE5NGQ4Y2NlZWIxMzhmNDZiOWJmOSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3NTEzODc3MjEsImV4cCI6MTc1Mzk3OTcyMX0.dwnAt70yIh1_S4KfLQIJR8DuWisE7odtqCZKzNsJFkc'; 
const authHeaders = { Authorization: `Bearer ${TOKEN}` };

async function testEndpoint(method, url, data = {}, headers = {}) {
  try {
    const config = { method, url, headers, data };
    if (method === 'get' || method === 'delete') delete config.data;
    const res = await axios(config);
    console.log(`[${method.toUpperCase()}] ${url} =>`, res.status, res.data);
  } catch (err) {
    if (err.response) {
      console.error(`[${method.toUpperCase()}] ${url} =>`, err.response.status, err.response.data);
    } else {
      console.error(`[${method.toUpperCase()}] ${url} =>`, err.message);
    }
  }
}

(async () => {
  await testEndpoint('post', `${BASE_URL}/auth/register`, {
    firstName: "John", lastName: "Doe", email: "patient1@safe.com", password: "yourPassword123", role: "patient"
  });
  await testEndpoint('post', `${BASE_URL}/auth/login`, {
    email: "patient1@safe.com", password: "patient123"
  });
  await testEndpoint('post', `${BASE_URL}/auth/forgot-password`, { email: "patient1@safe.com" });
  await testEndpoint('post', `${BASE_URL}/auth/reset-password`, { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjE5NGQ4Y2NlZWIxMzhmNDZiOWJmOSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3NTEzODc3MjEsImV4cCI6MTc1Mzk3OTcyMX0.dwnAt70yIh1_S4KfLQIJR8DuWisE7odtqCZKzNsJFkc", password: "newPassword123" });
  await testEndpoint('post', `${BASE_URL}/auth/verify-email`, { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjE5NGQ4Y2NlZWIxMzhmNDZiOWJmOSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3NTEzODc3MjEsImV4cCI6MTc1Mzk3OTcyMX0.dwnAt70yIh1_S4KfLQIJR8DuWisE7odtqCZKzNsJFkc" });
  await testEndpoint('post', `${BASE_URL}/auth/resend-verification`, { email: "patient1@safe.com" });
  await testEndpoint('get', `${BASE_URL}/auth/me`, {}, authHeaders);
  await testEndpoint('put', `${BASE_URL}/auth/profile`, { firstName: "John", lastName: "Doe", phone: "1234567890" }, authHeaders);
  await testEndpoint('post', `${BASE_URL}/auth/change-password`, { currentPassword: "patient123", newPassword: "patient1231" }, authHeaders);
  await testEndpoint('post', `${BASE_URL}/auth/logout`, {}, authHeaders);

  await testEndpoint('get', `${BASE_URL}/patients/profile`, {}, authHeaders);
  await testEndpoint('put', `${BASE_URL}/patients/profile`, { firstName: "Jane", lastName: "Smith", phone: "9876543210" }, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/medical-file`, {}, authHeaders);
  await testEndpoint('put', `${BASE_URL}/patients/medical-file`, { allergies: ["Penicillin"], chronicConditions: ["Diabetes"] }, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/appointments`, {}, authHeaders);
  await testEndpoint('post', `${BASE_URL}/patients/appointments`, { doctorId: "doctorIdHere", date: "2024-07-01T10:00:00Z", type: "in-person", reason: "Annual checkup" }, authHeaders);
  await testEndpoint('put', `${BASE_URL}/patients/appointments/appointmentId`, { doctorId: "doctorIdHere", date: "2024-07-01T10:00:00Z", type: "in-person", reason: "Annual checkup" }, authHeaders);
  await testEndpoint('delete', `${BASE_URL}/patients/appointments/appointmentId`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/medications`, {}, authHeaders);
  await testEndpoint('post', `${BASE_URL}/patients/medications`, { name: "Aspirin", dosage: "100mg", frequency: "once daily", notes: "Take with food" }, authHeaders);
  await testEndpoint('put', `${BASE_URL}/patients/medications/medicationId`, { name: "Aspirin", dosage: "100mg", frequency: "once daily", notes: "Take with food" }, authHeaders);
  await testEndpoint('delete', `${BASE_URL}/patients/medications/medicationId`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/consultations`, {}, authHeaders);
  await testEndpoint('post', `${BASE_URL}/patients/consultations`, { doctorId: "doctorIdHere", question: "What are the side effects of this medication?" }, authHeaders);
  await testEndpoint('put', `${BASE_URL}/patients/consultations/consultationId`, { doctorId: "doctorIdHere", question: "What are the side effects of this medication?" }, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/prescriptions`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/prescriptions/active`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/messages`, {}, authHeaders);
  await testEndpoint('post', `${BASE_URL}/patients/messages`, { recipientId: "doctorIdHere", content: "Hello, I have a question about my prescription." }, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/doctors`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/doctors/doctorIdHere`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/pharmacists`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/pharmacists/pharmacistIdHere`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/patients/dashboard/summary`, {}, authHeaders);

  await testEndpoint('get', `${BASE_URL}/doctors/`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/doctors/doctorIdHere`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/doctors/profile`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/doctors/profile`, { firstName: "Dr. John", lastName: "Doe", specialty: "Cardiology" }, authHeaders);

  await testEndpoint('get', `${BASE_URL}/pharmacists/`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/pharmacists/pharmacistIdHere`, {}, authHeaders);
  await testEndpoint('get', `${BASE_URL}/pharmacists/profile`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/pharmacists/profile`, { firstName: "Pharma", lastName: "Cist", pharmacyName: "Good Health Pharmacy" }, authHeaders);

  await testEndpoint('post', `${BASE_URL}/appointments/`, { doctorId: "doctorIdHere", date: "2024-07-01T10:00:00Z", type: "in-person", reason: "Follow-up" }, authHeaders);
  await testEndpoint('get', `${BASE_URL}/appointments/`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/appointments/appointmentId/status`, { status: "completed" }, authHeaders);
  await testEndpoint('get', `${BASE_URL}/appointments/appointmentId`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/appointments/appointmentId`, { doctorId: "doctorIdHere", date: "2024-07-01T10:00:00Z", type: "in-person", reason: "Follow-up" }, authHeaders);

  await testEndpoint('get', `${BASE_URL}/notifications/`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/notifications/read-all`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/notifications/notificationId/read`, {}, authHeaders);

  await testEndpoint('get', `${BASE_URL}/medical-files/medicalFileId`, {}, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/medical-files/medicalFileId/emergency-contact`, { name: "Jane Doe", phone: "1234567890", relationship: "Spouse" }, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/medical-files/medicalFileId/insurance`, { provider: "HealthCare Inc.", policyNumber: "ABC1234567" }, authHeaders);

  await testEndpoint('get', `${BASE_URL}/consultations/`, {}, authHeaders);
  await testEndpoint('post', `${BASE_URL}/consultations/`, { doctorId: "doctorIdHere", question: "What is the best treatment for my condition?" }, authHeaders);
  await testEndpoint('patch', `${BASE_URL}/consultations/consultationId`, { answer: "You should take your medication as prescribed." }, authHeaders);

  console.log('All API requests sent (check responses and backend logs for results).');
})(); 