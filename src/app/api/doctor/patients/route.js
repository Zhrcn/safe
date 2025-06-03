import { NextResponse } from 'next/server';
import { getDoctorPatients } from '@/controllers/doctor/patientsController';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    const result = await getDoctorPatients(req);
    
    if (result.success) {
        return NextResponse.json({
            patients: result.patients,
            pagination: result.pagination
        }, { status: result.status, headers: result.headers });
    } else {
        return NextResponse.json(
            { error: result.error, message: result.message },
            { status: result.status, headers: result.headers }
        );
    }
}