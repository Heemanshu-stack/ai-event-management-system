import { NextResponse } from 'next/server';
import { clearRegistrations, getClearedIds } from '@/lib/db';

export async function POST(req) {
  try {
    let idsToClear = [];
    try {
      const body = await req.json();
      if (Array.isArray(body?.clearedIds)) {
        idsToClear = body.clearedIds;
      }
    } catch (e) {}

    clearRegistrations(idsToClear);

    return NextResponse.json({
      success: true,
      clearedIds: getClearedIds(),
      message: 'All registrations successfully reset across the platform.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset registrations' }, { status: 500 });
  }
}
