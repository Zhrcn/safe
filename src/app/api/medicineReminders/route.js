import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Patient from '@/models/Patient';

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const patient = await Patient.findOne({ email: session.user.email })
      .select('medicineReminders')
      .lean();

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient.medicineReminders || []);
  } catch (error) {
    console.error('Error fetching medicine reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
