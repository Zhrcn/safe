import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Prescription from '@/models/Prescription';
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

        if (user.role !== 'pharmacist') {
            return NextResponse.json({ error: 'Forbidden: Pharmacist access only' }, { status: 403 });
        }

        await connectToDatabase();

        // Get pending prescriptions (active but not filled)
        const pendingPrescriptions = await Prescription.find({
            status: 'active',
            'filledBy.pharmacistId': { $exists: false }
        })
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .sort({ date: -1 })
            .limit(5);

        // Get recently filled prescriptions by this pharmacist
        const recentlyFilledPrescriptions = await Prescription.find({
            'filledBy.pharmacistId': user.id
        })
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .sort({ 'filledBy.date': -1 })
            .limit(5);

        // Get expiring soon prescriptions (within next 7 days)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const expiringSoonPrescriptions = await Prescription.find({
            status: 'active',
            expiryDate: {
                $gte: today,
                $lte: nextWeek
            }
        })
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .sort({ expiryDate: 1 })
            .limit(5);

        // Format the data for the dashboard
        const formattedPendingPrescriptions = pendingPrescriptions.map(prescription => ({
            id: prescription._id,
            patientName: prescription.patientId?.name || 'Unknown Patient',
            doctorName: prescription.doctorId?.name || 'Unknown Doctor',
            date: prescription.date.toISOString().split('T')[0],
            medications: prescription.medications.map(med => med.name).join(', '),
            expiryDate: prescription.expiryDate.toISOString().split('T')[0]
        }));

        const formattedRecentlyFilledPrescriptions = recentlyFilledPrescriptions.map(prescription => ({
            id: prescription._id,
            patientName: prescription.patientId?.name || 'Unknown Patient',
            doctorName: prescription.doctorId?.name || 'Unknown Doctor',
            filledDate: prescription.filledBy?.date?.toISOString().split('T')[0] || 'Unknown',
            medications: prescription.medications.map(med => med.name).join(', ')
        }));

        const formattedExpiringSoonPrescriptions = expiringSoonPrescriptions.map(prescription => ({
            id: prescription._id,
            patientName: prescription.patientId?.name || 'Unknown Patient',
            doctorName: prescription.doctorId?.name || 'Unknown Doctor',
            expiryDate: prescription.expiryDate.toISOString().split('T')[0],
            medications: prescription.medications.map(med => med.name).join(', '),
            daysRemaining: Math.ceil((prescription.expiryDate - today) / (1000 * 60 * 60 * 24))
        }));

        // Calculate dashboard stats
        const stats = {
            pendingPrescriptions: await Prescription.countDocuments({
                status: 'active',
                'filledBy.pharmacistId': { $exists: false }
            }),
            filledToday: await Prescription.countDocuments({
                'filledBy.pharmacistId': user.id,
                'filledBy.date': {
                    $gte: new Date(today.setHours(0, 0, 0, 0)),
                    $lt: new Date(today.setHours(23, 59, 59, 999))
                }
            }),
            expiringSoon: await Prescription.countDocuments({
                status: 'active',
                expiryDate: {
                    $gte: today,
                    $lte: nextWeek
                }
            }),
            totalPatients: await User.countDocuments({ role: 'patient' })
        };

        // Get medication distribution
        const medicationDistribution = await Prescription.aggregate([
            { $unwind: '$medications' },
            { $group: { _id: '$medications.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const topMedications = medicationDistribution.map(item => ({
            name: item._id,
            count: item.count
        }));

        return NextResponse.json({
            stats,
            pendingPrescriptions: formattedPendingPrescriptions,
            recentlyFilledPrescriptions: formattedRecentlyFilledPrescriptions,
            expiringSoonPrescriptions: formattedExpiringSoonPrescriptions,
            topMedications
        });
    } catch (error) {
        console.error('Error fetching pharmacist dashboard data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 