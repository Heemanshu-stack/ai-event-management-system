import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserByEmail, getRegistrationsByEmail } from '@/lib/db';
import { fetchLiveSheetRegistrations } from '@/lib/googleSheets';

export async function GET(req) {
  const token = req.cookies.get('eventpilot_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  const user = getUserByEmail(payload.email);
  const liveSheetRegs = await fetchLiveSheetRegistrations();
  let registrations = [];
  if (liveSheetRegs && liveSheetRegs.length > 0 && payload.email) {
    registrations = liveSheetRegs.filter(r => r.email?.toLowerCase() === payload.email.toLowerCase());
  } else if (user) {
    registrations = getRegistrationsByEmail(user.email);
  }

  return NextResponse.json({
    user: user || {
      id: payload.id || 'USR-001',
      email: payload.email,
      fullName: payload.fullName || payload.name || 'Participant',
      role: payload.role || 'student',
    },
    registrations,
  });
}
