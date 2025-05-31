import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import MedicalFile from '@/models/MedicalFile';
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

        if (user.role !== 'doctor') {
            return NextResponse.json({ error: 'Forbidden: Doctor access only' }, { status: 403 });
        }

        await connectToDatabase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get today's appointments
        const todayAppointments = await Appointment.find({
            doctorId: user.id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        })
            .populate('patientId', 'name')
            .sort({ time: 1 })
            .limit(5);

        // Get upcoming appointments (excluding today)
        const upcomingAppointments = await Appointment.find({
            doctorId: user.id,
            status: 'scheduled',
            date: { $gt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        })
            .populate('patientId', 'name')
            .sort({ date: 1, time: 1 })
            .limit(5);

        // Get patients count
        const patientsCount = await User.countDocuments({
            role: 'patient',
            'patientProfile.doctors': user.id
        });

        // Get pending appointment requests
        const pendingRequests = await Appointment.find({
            doctorId: user.id,
            status: 'requested'
        })
            .populate('patientId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent medical files accessed
        const recentMedicalFiles = await MedicalFile.find({
            'accessLog.accessedBy': user.id
        })
            .populate('patientId', 'name')
            .sort({ 'accessLog.accessDate': -1 })
            .limit(5);

        // Format the data for the dashboard
        const formattedTodayAppointments = todayAppointments.map(appointment => ({
            id: appointment._id,
            patientName: appointment.patientId?.name || 'Unknown Patient',
            time: appointment.time,
            status: appointment.status,
            type: appointment.type || 'Consultation',
            reasonForVisit: appointment.reasonForVisit || 'General checkup'
        }));

        const formattedUpcomingAppointments = upcomingAppointments.map(appointment => ({
            id: appointment._id,
            patientName: appointment.patientId?.name || 'Unknown Patient',
            date: appointment.date.toISOString().split('T')[0],
            time: appointment.time,
            type: appointment.type || 'Consultation'
        }));

        const formattedPendingRequests = pendingRequests.map(request => ({
            id: request._id,
            patientName: request.patientId?.name || 'Unknown Patient',
            date: request.date.toISOString().split('T')[0],
            time: request.time,
            reasonForVisit: request.reasonForVisit || 'Not specified'
        }));

        const formattedRecentMedicalFiles = recentMedicalFiles.map(file => ({
            id: file._id,
            patientId: file.patientId?._id,
            patientName: file.patientId?.name || 'Unknown Patient',
            lastAccessed: file.accessLog
                .filter(log => log.accessedBy.toString() === user.id)
                .sort((a, b) => new Date(b.accessDate) - new Date(a.accessDate))[0]
                ?.accessDate.toISOString().split('T')[0] || 'Unknown'
        }));

        // Calculate dashboard stats
        const stats = {
            todayAppointments: todayAppointments.length,
            upcomingAppointments: await Appointment.countDocuments({
                doctorId: user.id,
                status: 'scheduled',
                date: { $gt: new Date() }
            }),
            totalPatients: patientsCount,
            pendingRequests: await Appointment.countDocuments({
                doctorId: user.id,
                status: 'requested'
            })
        };

        // Get appointment distribution by type
        const appointmentsByType = await Appointment.aggregate([
            { $match: { doctorId: user.id } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        const appointmentTypes = appointmentsByType.map(item => ({
            type: item._id || 'General',
            count: item.count
        }));

        return NextResponse.json({
            stats,
            todayAppointments: formattedTodayAppointments,
            upcomingAppointments: formattedUpcomingAppointments,
            pendingRequests: formattedPendingRequests,
            recentMedicalFiles: formattedRecentMedicalFiles,
            appointmentTypes
        });
    } catch (error) {
        console.error('Error fetching doctor dashboard data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 