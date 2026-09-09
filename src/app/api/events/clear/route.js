import { NextResponse } from 'next/server';
import { clearRegistrations } from '@/lib/db';

export async function POST() {
  clearRegistrations();
  return NextResponse.json({
    success: true,
    message: 'All registrations successfully cleared from server memory.',
  });
}
