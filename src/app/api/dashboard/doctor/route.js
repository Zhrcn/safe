import { NextResponse } from 'next/server';
import { getDoctorDashboard } from '@/controllers/dashboard/doctorController';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    const result = await getDoctorDashboard(req);
    
    if (result.success) {
        return NextResponse.json(result.data, { status: result.status });
    } else {
        return NextResponse.json({ error: result.error, message: result.message }, { status: result.status });
    }
}