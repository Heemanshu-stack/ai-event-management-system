import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserByEmail, getRegistrationsByEmail } from '@/lib/db';

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
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const registrations = getRegistrationsByEmail(user.email);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      college: user.college,
    },
    registrations,
  });
}
