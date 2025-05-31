import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import Prescription from '@/models/Prescription';
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

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
        }

        await connectToDatabase();

        // Get user counts by role
        const patientCount = await User.countDocuments({ role: 'patient' });
        const doctorCount = await User.countDocuments({ role: 'doctor' });
        const pharmacistCount = await User.countDocuments({ role: 'pharmacist' });
        const adminCount = await User.countDocuments({ role: 'admin' });

        // Get recent users
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role createdAt');

        // Get appointment stats
        const totalAppointments = await Appointment.countDocuments();
        const scheduledAppointments = await Appointment.countDocuments({ status: 'scheduled' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

        // Get prescription stats
        const totalPrescriptions = await Prescription.countDocuments();
        const activePrescriptions = await Prescription.countDocuments({ status: 'active' });
        const filledPrescriptions = await Prescription.countDocuments({ 'filledBy.pharmacistId': { $exists: true } });

        // Get recent appointments
        const recentAppointments = await Appointment.find()
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get system activity (medical file access logs)
        const recentActivity = await MedicalFile.aggregate([
            { $unwind: '$accessLog' },
            { $sort: { 'accessLog.accessDate': -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'accessLog.accessedBy',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $project: {
                    action: '$accessLog.action',
                    date: '$accessLog.accessDate',
                    userName: { $arrayElemAt: ['$user.name', 0] },
                    userRole: { $arrayElemAt: ['$user.role', 0] },
                    patientName: { $arrayElemAt: ['$patient.name', 0] }
                }
            }
        ]);

        // Format the data for the dashboard
        const formattedRecentUsers = recentUsers.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            joinedDate: user.createdAt.toISOString().split('T')[0]
        }));

        const formattedRecentAppointments = recentAppointments.map(appointment => ({
            id: appointment._id,
            patientName: appointment.patientId?.name || 'Unknown Patient',
            doctorName: appointment.doctorId?.name || 'Unknown Doctor',
            date: appointment.date.toISOString().split('T')[0],
            time: appointment.time,
            status: appointment.status
        }));

        const formattedRecentActivity = recentActivity.map(activity => ({
            action: activity.action,
            date: activity.date.toISOString().split('T')[0],
            time: activity.date.toISOString().split('T')[1].substring(0, 5),
            userName: activity.userName || 'Unknown User',
            userRole: activity.userRole || 'Unknown Role',
            patientName: activity.patientName || 'Unknown Patient'
        }));

        // Calculate user registration over time (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userRegistrationData = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' },
                        role: '$role'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);

        // Transform the data for the chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Create an array of the last 6 months
        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
            const monthIndex = (currentMonth - i + 12) % 12;
            const year = currentYear - Math.floor((i - currentMonth) / 12);
            return { month: monthIndex + 1, year, label: months[monthIndex] };
        }).reverse();

        // Initialize data structure
        const userGrowthData = lastSixMonths.map(month => ({
            label: `${month.label} ${month.year}`,
            patient: 0,
            doctor: 0,
            pharmacist: 0,
            admin: 0
        }));

        // Fill in the data
        userRegistrationData.forEach(item => {
            const monthIndex = lastSixMonths.findIndex(
                m => m.month === item._id.month && m.year === item._id.year
            );
            if (monthIndex !== -1) {
                userGrowthData[monthIndex][item._id.role] = item.count;
            }
        });

        return NextResponse.json({
            stats: {
                users: {
                    total: patientCount + doctorCount + pharmacistCount + adminCount,
                    patients: patientCount,
                    doctors: doctorCount,
                    pharmacists: pharmacistCount,
                    admins: adminCount
                },
                appointments: {
                    total: totalAppointments,
                    scheduled: scheduledAppointments,
                    completed: completedAppointments,
                    cancelled: cancelledAppointments
                },
                prescriptions: {
                    total: totalPrescriptions,
                    active: activePrescriptions,
                    filled: filledPrescriptions
                }
            },
            recentUsers: formattedRecentUsers,
            recentAppointments: formattedRecentAppointments,
            recentActivity: formattedRecentActivity,
            userGrowthData
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 