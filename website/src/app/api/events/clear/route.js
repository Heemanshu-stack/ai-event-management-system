import { NextResponse } from 'next/server';
import { clearRegistrations } from '@/lib/db';

export async function POST(req) {
  try {
    let timestamp = new Date().toISOString();
    try {
      const body = await req.json();
      if (body?.timestamp) {
        timestamp = body.timestamp;
      }
    } catch (e) {}

    clearRegistrations(timestamp);

    return NextResponse.json({
      success: true,
      timestamp,
      message: 'All registrations successfully reset across the platform.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset registrations' }, { status: 500 });
  }
}
