import { NextResponse } from 'next/server';
import { getHealthMetrics } from '@/controllers/healthMetricsController';

export async function GET(request) {
  const { data, error, status } = await getHealthMetrics(request);
  
  if (error) {
    return NextResponse.json({ error }, { status });
  }
  
  return NextResponse.json(data);
}
