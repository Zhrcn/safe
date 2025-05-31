const DEV_MODE = true;

const MOCK_APPOINTMENTS = [
    {
        id: 'app_001',
        patientId: 'dev_patient_123',
        patientName: 'Test Patient',
        doctorId: 'dev_doctor_123',
        doctorName: 'Dr. Smith',
        date: '2024-06-22',
        time: '09:00 AM',
        duration: 30,
        reason: 'Annual Physical',
        status: 'Scheduled',
        notes: {
            patient: 'First annual checkup',
            doctor: 'Review blood work from last month'
        },
        createdAt: '2024-06-01T10:00:00Z'
    },
    {
        id: 'app_002',
        patientId: 'dev_patient_123',
        patientName: 'Test Patient',
        doctorId: 'dev_doctor_123',
        doctorName: 'Dr. Smith',
        date: '2024-06-25',
        time: '11:30 AM',
        duration: 45,
        reason: 'Follow-up',
        status: 'Scheduled',
        notes: {
            patient: 'Discuss medication side effects',
            doctor: ''
        },
        createdAt: '2024-06-02T14:00:00Z'
    },
    {
        id: 'app_003',
        patientId: 'dev_patient_123',
        patientName: 'Test Patient',
        doctorId: 'dev_doctor_456',
        doctorName: 'Dr. Johnson',
        date: '2024-06-18',
        time: '10:15 AM',
        duration: 30,
        reason: 'Consultation',
        status: 'Completed',
        notes: {
            patient: '',
            doctor: 'Patient reported mild symptoms, prescribed medication'
        },
        createdAt: '2024-06-01T09:30:00Z'
    },
    {
        id: 'app_004',
        patientId: 'dev_patient_123',
        patientName: 'Test Patient',
        doctorId: 'dev_doctor_123',
        doctorName: 'Dr. Smith',
        date: '2024-07-05',
        time: '02:00 PM',
        duration: 60,
        reason: 'Specialized Exam',
        status: 'Scheduled',
        notes: {
            patient: 'Need to discuss test results',
            doctor: ''
        },
        createdAt: '2024-06-10T11:20:00Z'
    },
    {
        id: 'app_005',
        patientId: 'dev_patient_456',
        patientName: 'Jane Doe',
        doctorId: 'dev_doctor_123',
        doctorName: 'Dr. Smith',
        date: '2024-06-22',
        time: '10:00 AM',
        duration: 30,
        reason: 'Check-up',
        status: 'Scheduled',
        notes: {
            patient: '',
            doctor: 'Routine check-up'
        },
        createdAt: '2024-06-05T15:45:00Z'
    }
];

function getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('safe_auth_token');
}

function filterAppointments(appointments, params) {
    let filtered = [...appointments];

    if (params) {
        if (params.patientId) {
            filtered = filtered.filter(app => app.patientId === params.patientId);
        }
        if (params.doctorId) {
            filtered = filtered.filter(app => app.doctorId === params.doctorId);
        }
        if (params.status) {
            filtered = filtered.filter(app => app.status === params.status);
        }
        if (params.date) {
            filtered = filtered.filter(app => app.date === params.date);
        }
        if (params.sortBy === 'date') {
            filtered.sort((a, b) => {
                const dateComparison = new Date(a.date) - new Date(b.date);
                if (dateComparison === 0) {
                    return a.time.localeCompare(b.time);
                }
                return dateComparison;
            });
        }
    }

    return filtered;
}

export async function getAppointments(params = {}) {
    if (DEV_MODE) {
        console.log('DEV MODE: Returning mock appointments data with params:', params);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(filterAppointments(MOCK_APPOINTMENTS, params));
            }, 500);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
    });

    const url = `/api/appointments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch appointments');
    }
    return response.json();
}

export async function getAppointmentById(id) {
    if (DEV_MODE) {
        console.log(`DEV MODE: Returning mock appointment with ID: ${id}`);
        return new Promise(resolve => {
            setTimeout(() => {
                const appointment = MOCK_APPOINTMENTS.find(app => app.id === id);
                if (appointment) {
                    resolve(appointment);
                } else {
                    throw new Error('Appointment not found');
                }
            }, 300);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/appointments/${id}`, {
        headers
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch appointment with ID: ${id}`);
    }
    return response.json();
}

export async function createAppointment(appointmentData) {
    if (DEV_MODE) {
        console.log('DEV MODE: Creating mock appointment', appointmentData);
        return new Promise(resolve => {
            setTimeout(() => {
                const newAppointment = {
                    id: `app_${Date.now()}`,
                    ...appointmentData,
                    createdAt: new Date().toISOString(),
                    status: 'Scheduled'
                };
                resolve(newAppointment);
            }, 600);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers,
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        throw new Error('Failed to create appointment');
    }
    return response.json();
}

export async function updateAppointment(id, appointmentData) {
    if (DEV_MODE) {
        console.log(`DEV MODE: Updating mock appointment with ID: ${id}`, appointmentData);
        return new Promise(resolve => {
            setTimeout(() => {
                const appointmentIndex = MOCK_APPOINTMENTS.findIndex(app => app.id === id);
                if (appointmentIndex >= 0) {
                    const updatedAppointment = {
                        ...MOCK_APPOINTMENTS[appointmentIndex],
                        ...appointmentData,
                        id
                    };
                    resolve(updatedAppointment);
                } else {
                    throw new Error('Appointment not found');
                }
            }, 500);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        throw new Error(`Failed to update appointment with ID: ${id}`);
    }
    return response.json();
}

export async function cancelAppointment(id, reason) {
    if (DEV_MODE) {
        console.log(`DEV MODE: Cancelling mock appointment with ID: ${id}`, reason);
        return new Promise(resolve => {
            setTimeout(() => {
                const appointmentIndex = MOCK_APPOINTMENTS.findIndex(app => app.id === id);
                if (appointmentIndex >= 0) {
                    const cancelledAppointment = {
                        ...MOCK_APPOINTMENTS[appointmentIndex],
                        status: 'Cancelled',
                        notes: {
                            ...MOCK_APPOINTMENTS[appointmentIndex].notes,
                            cancellation: reason
                        }
                    };
                    resolve(cancelledAppointment);
                } else {
                    throw new Error('Appointment not found');
                }
            }, 400);
        });
    }

    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            status: 'Cancelled',
            notes: {
                cancellation: reason
            }
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to cancel appointment with ID: ${id}`);
    }
    return response.json();
} 