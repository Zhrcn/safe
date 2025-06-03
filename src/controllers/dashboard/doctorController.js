import { connectToDatabase, withTimeout } from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import MedicalFile from '@/models/MedicalFile';
import Patient from '@/models/Patient';
import { jwtDecode } from 'jwt-decode';

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

async function getDoctorDashboard(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return {
                success: false,
                error: 'Unauthorized',
                status: 401
            };
        }

        if (user.role !== 'doctor') {
            return {
                success: false,
                error: 'Forbidden: Doctor access only',
                status: 403
            };
        }

        try {
            await connectToDatabase();
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return {
                success: false,
                error: 'Database connection error',
                message: dbError.message,
                status: 500
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayAppointments = [];
        let upcomingAppointments = [];
        let patientsCount = 0;
        let pendingRequests = [];
        let recentMedicalFiles = [];
        let totalUpcomingAppointments = 0;
        let totalPendingRequests = 0;
        let appointmentsByType = [];

        try {
            todayAppointments = await withTimeout(
                Appointment.find({
                    doctorId: user.id,
                    date: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    }
                })
                    .populate('patientId', 'name')
                    .sort({ time: 1 })
                    .limit(5),
                5000,
                'Today appointments query timeout'
            );
        } catch (error) {
            console.error('Error fetching today appointments:', error);
        }

        try {
            upcomingAppointments = await withTimeout(
                Appointment.find({
                    doctorId: user.id,
                    status: 'scheduled',
                    date: { $gt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                })
                    .populate('patientId', 'name')
                    .sort({ date: 1, time: 1 })
                    .limit(5),
                5000,
                'Upcoming appointments query timeout'
            );
        } catch (error) {
            console.error('Error fetching upcoming appointments:', error);
        }

        try {
            const doctorData = await withTimeout(
                User.findOne({ _id: user.id, role: 'doctor' })
                    .populate('doctorProfile'),
                5000,
                'Doctor profile query timeout'
            );
            
            let doctorProfile;
            try {
                doctorProfile = await withTimeout(
                    Doctor.findOne({ user: user.id }),
                    5000,
                    'Doctor profile direct query timeout'
                );
            } catch (error) {
                console.error('Error fetching doctor profile directly:', error);
            }
            
            if (doctorProfile && doctorProfile.patientsList && doctorProfile.patientsList.length > 0) {
                patientsCount = doctorProfile.patientsList.length;
            } else {
                patientsCount = await withTimeout(
                    Patient.countDocuments({
                        doctorsList: user.id
                    }),
                    5000,
                    'Patients count by doctor list query timeout'
                );
                
                if (patientsCount === 0) {
                    patientsCount = await withTimeout(
                        Patient.countDocuments({
                            'doctorsList': { $in: [user.id] }
                        }),
                        5000,
                        'Patients count alternative query timeout'
                    );
                }
            }
        } catch (error) {
            console.error('Error fetching patients count:', error);
        }

        try {
            pendingRequests = await withTimeout(
                Appointment.find({
                    doctorId: user.id,
                    status: 'requested'
                })
                    .populate('patientId', 'name')
                    .sort({ createdAt: -1 })
                    .limit(5),
                5000,
                'Pending requests query timeout'
            );
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }

        try {
            recentMedicalFiles = await withTimeout(
                MedicalFile.find({
                    'accessLog.accessedBy': user.id
                })
                    .populate('patientId', 'name')
                    .sort({ 'accessLog.accessDate': -1 })
                    .limit(5),
                5000,
                'Recent medical files query timeout'
            );
        } catch (error) {
            console.error('Error fetching recent medical files:', error);
        }

        try {
            totalUpcomingAppointments = await withTimeout(
                Appointment.countDocuments({
                    doctorId: user.id,
                    status: 'scheduled',
                    date: { $gt: new Date() }
                }),
                5000,
                'Total upcoming appointments count query timeout'
            );
        } catch (error) {
            console.error('Error fetching total upcoming appointments count:', error);
            totalUpcomingAppointments = upcomingAppointments.length;
        }

        try {
            totalPendingRequests = await withTimeout(
                Appointment.countDocuments({
                    doctorId: user.id,
                    status: 'requested'
                }),
                5000,
                'Total pending requests count query timeout'
            );
        } catch (error) {
            console.error('Error fetching total pending requests count:', error);
            totalPendingRequests = pendingRequests.length;
        }

        try {
            appointmentsByType = await withTimeout(
                Appointment.aggregate([
                    { $match: { doctorId: user.id } },
                    { $group: { _id: '$type', count: { $sum: 1 } } }
                ]),
                5000,
                'Appointment types query timeout'
            );
        } catch (error) {
            console.error('Error fetching appointment types:', error);
        }

        const formattedTodayAppointments = Array.isArray(todayAppointments) ? todayAppointments.map(appointment => ({
            id: appointment._id?.toString() || 'unknown',
            patientName: appointment.patientId?.name || 'Unknown Patient',
            time: appointment.time || 'Not specified',
            status: appointment.status || 'scheduled',
            type: appointment.type || 'Consultation',
            reasonForVisit: appointment.reasonForVisit || 'General checkup'
        })) : [];

        const formattedUpcomingAppointments = Array.isArray(upcomingAppointments) ? upcomingAppointments.map(appointment => ({
            id: appointment._id?.toString() || 'unknown',
            patientName: appointment.patientId?.name || 'Unknown Patient',
            date: appointment.date ? appointment.date.toISOString().split('T')[0] : 'Not specified',
            time: appointment.time || 'Not specified',
            type: appointment.type || 'Consultation'
        })) : [];

        const formattedPendingRequests = Array.isArray(pendingRequests) ? pendingRequests.map(request => ({
            id: request._id?.toString() || 'unknown',
            patientName: request.patientId?.name || 'Unknown Patient',
            date: request.date ? request.date.toISOString().split('T')[0] : 'Not specified',
            time: request.time || 'Not specified',
            reasonForVisit: request.reasonForVisit || 'Not specified'
        })) : [];

        const formattedRecentMedicalFiles = Array.isArray(recentMedicalFiles) ? recentMedicalFiles.map(file => {
            let lastAccessed = 'Unknown';
            if (file.accessLog && Array.isArray(file.accessLog)) {
                const userLogs = file.accessLog.filter(log => 
                    log.accessedBy && log.accessedBy.toString() === user.id
                );
                if (userLogs.length > 0) {
                    userLogs.sort((a, b) => new Date(b.accessDate) - new Date(a.accessDate));
                    if (userLogs[0].accessDate) {
                        lastAccessed = userLogs[0].accessDate.toISOString().split('T')[0];
                    }
                }
            }
            
            return {
                id: file._id?.toString() || 'unknown',
                patientId: file.patientId?._id?.toString() || 'unknown',
                patientName: file.patientId?.name || 'Unknown Patient',
                lastAccessed
            };
        }) : [];

        const appointmentTypes = Array.isArray(appointmentsByType) ? appointmentsByType.map(item => ({
            type: item._id || 'General',
            count: item.count || 0
        })) : [];

        const stats = {
            todayAppointments: Array.isArray(todayAppointments) ? todayAppointments.length : 0,
            upcomingAppointments: totalUpcomingAppointments,
            totalPatients: patientsCount || 0,
            pendingRequests: totalPendingRequests
        };

        return {
            success: true,
            data: {
                stats,
                todayAppointments: formattedTodayAppointments,
                upcomingAppointments: formattedUpcomingAppointments,
                pendingRequests: formattedPendingRequests,
                recentMedicalFiles: formattedRecentMedicalFiles,
                appointmentTypes
            },
            status: 200
        };
    } catch (error) {
        console.error('Error fetching doctor dashboard data:', error);
        return {
            success: false,
            error: 'Internal server error',
            message: error.message,
            status: 500
        };
    }
}

export {
    getDoctorDashboard,
    getAuthenticatedUser
};
