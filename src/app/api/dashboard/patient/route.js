import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Appointment from '@/models/Appointment';
import Prescription from '@/models/Prescription';
import MedicalFile from '@/models/MedicalFile';
import User from '@/models/User';
import { jwtDecode } from 'jwt-decode';

export const dynamic = 'force-dynamic';

async function getAuthenticatedUser(req) {
    const token = req.cookies.get('safe_auth_token')?.value || req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
}

export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'patient') {
            return NextResponse.json({ error: 'Forbidden: Patient access only' }, { status: 403 });
        }

        await connectToDatabase();

        // Get upcoming appointments
        const upcomingAppointments = await Appointment.find({
            patientId: user.id,
            status: 'scheduled',
            date: { $gte: new Date() }
        })
            .populate('doctorId', 'name')
            .sort({ date: 1, time: 1 })
            .limit(3);

        // Get active medications/prescriptions
        const activePrescriptions = await Prescription.find({
            patientId: user.id,
            status: 'active',
            expiryDate: { $gte: new Date() }
        })
            .populate('doctorId', 'name')
            .sort({ date: -1 })
            .limit(3);

        // Get medical file for health metrics
        const medicalFile = await MedicalFile.findOne({ patientId: user.id });

        // Get count of doctors with access
        const activeProviders = await User.countDocuments({
            role: 'doctor',
            'doctorProfile.patients': user.id
        });

        // Get last checkup date from appointments
        const lastCheckup = await Appointment.findOne({
            patientId: user.id,
            status: 'completed'
        })
            .sort({ date: -1 })
            .select('date');

        // Format the data for the dashboard
        const formattedAppointments = upcomingAppointments.map(appointment => ({
            id: appointment._id,
            doctorName: appointment.doctorId?.name || 'Unknown Doctor',
            specialty: appointment.doctorId?.doctorProfile?.specialization || 'Specialist',
            date: appointment.date.toISOString().split('T')[0],
            time: appointment.time,
            location: appointment.location || 'Hospital'
        }));

        const formattedMedications = activePrescriptions.map(prescription => ({
            id: prescription._id,
            name: prescription.medications[0]?.name || 'Medication',
            dosage: prescription.medications[0]?.dosage || '',
            frequency: prescription.medications[0]?.frequency || 'Daily',
            prescribedBy: prescription.doctorId?.name || 'Doctor'
        }));

        // Extract health stats from medical file
        let healthStats = [];
        if (medicalFile && medicalFile.vitals && medicalFile.vitals.length > 0) {
            const latestVitals = medicalFile.vitals.sort((a, b) => 
                new Date(b.date) - new Date(a.date))[0];
            
            if (latestVitals) {
                healthStats = [
                    {
                        name: 'Blood Pressure',
                        value: latestVitals.bloodPressure || 'N/A',
                        date: latestVitals.date.toISOString().split('T')[0]
                    },
                    {
                        name: 'Heart Rate',
                        value: `${latestVitals.heartRate || 'N/A'} bpm`,
                        date: latestVitals.date.toISOString().split('T')[0]
                    },
                    {
                        name: 'Weight',
                        value: `${latestVitals.weight || 'N/A'} kg`,
                        date: latestVitals.date.toISOString().split('T')[0]
                    },
                    {
                        name: 'Blood Glucose',
                        value: `${latestVitals.bloodGlucose || 'N/A'} mg/dL`,
                        date: latestVitals.date.toISOString().split('T')[0]
                    }
                ];
            }
        }

        // If no health stats were found, provide empty placeholders
        if (healthStats.length === 0) {
            healthStats = [
                { name: 'Blood Pressure', value: 'N/A', date: 'N/A' },
                { name: 'Heart Rate', value: 'N/A', date: 'N/A' },
                { name: 'Weight', value: 'N/A', date: 'N/A' },
                { name: 'Blood Glucose', value: 'N/A', date: 'N/A' }
            ];
        }

        // Calculate dashboard stats
        const stats = {
            upcomingAppointments: await Appointment.countDocuments({ 
                patientId: user.id,
                status: 'scheduled',
                date: { $gte: new Date() }
            }),
            activeMedications: await Prescription.countDocuments({
                patientId: user.id,
                status: 'active',
                expiryDate: { $gte: new Date() }
            }),
            lastCheckup: lastCheckup ? lastCheckup.date.toISOString().split('T')[0] : 'N/A',
            activeProviders: activeProviders
        };

        // Get blood pressure history for chart
        let bloodPressureHistory = [];
        if (medicalFile && medicalFile.vitals && medicalFile.vitals.length > 0) {
            bloodPressureHistory = medicalFile.vitals
                .filter(vital => vital.bloodPressure)
                .map(vital => {
                    const [systolic, diastolic] = vital.bloodPressure.split('/').map(Number);
                    return {
                        date: vital.date.toISOString().split('T')[0],
                        systolic: systolic || 0,
                        diastolic: diastolic || 0
                    };
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(-6); // Last 6 readings
        }

        return NextResponse.json({
            stats,
            upcomingAppointments: formattedAppointments,
            medications: formattedMedications,
            healthStats,
            bloodPressure: bloodPressureHistory
        });
    } catch (error) {
        console.error('Error fetching patient dashboard data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 