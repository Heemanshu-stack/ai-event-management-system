import { NextResponse } from 'next/server';
import { verifyPassword, signToken } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, fullName: user.fullName });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName, college: user.college },
    });

    response.cookies.set('eventpilot_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
