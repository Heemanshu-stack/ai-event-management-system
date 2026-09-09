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

  if (payload.role === 'admin') {
    return NextResponse.json({
      user: {
        id: 'ADM-001',
        username: 'admin',
        email: 'admin@eventpilot.ai',
        fullName: 'Administrator',
        role: 'admin',
      },
      registrations: [],
    });
  }

  if (payload.role === 'staff') {
    return NextResponse.json({
      user: {
        id: 'STF-001',
        username: 'staff',
        email: 'staff@eventpilot.ai',
        fullName: 'Staff Operations',
        role: 'staff',
      },
      registrations: [],
    });
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
    user: {
      id: user?.id || payload.id,
      username: user?.username || payload.username || (payload.email ? payload.email.split('@')[0] : 'user'),
      email: user?.email || payload.email,
      fullName: user?.fullName || payload.fullName,
      phone: user?.phone,
      college: user?.college,
      role: 'student',
    },
    registrations,
  });
}
