import { NextResponse } from 'next/server';
import { verifyPassword, signToken } from '@/lib/auth';
import { getUserByUsernameOrEmail } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const identifier = (body.username || body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/email and password are required' }, { status: 400 });
    }

    // 1. Check Admin Account (username: admin, password: admin2026)
    if (identifier === 'admin' && (password === 'admin2026' || password === (process.env.ADMIN_PASSKEY || 'admin2026'))) {
      const adminUser = {
        id: 'ADM-001',
        username: 'admin',
        email: 'admin@eventpilot.ai',
        fullName: 'Administrator',
        role: 'admin',
      };

      const token = signToken(adminUser);
      const response = NextResponse.json({
        success: true,
        role: 'admin',
        redirectUrl: '/admin',
        user: adminUser,
      });

      response.cookies.set('eventpilot_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. Check Staff Account (username: staff, password: staff2026)
    if (identifier === 'staff' && (password === 'staff2026' || password === (process.env.STAFF_PASSKEY || 'staff2026'))) {
      const staffUser = {
        id: 'STF-001',
        username: 'staff',
        email: 'staff@eventpilot.ai',
        fullName: 'Staff Operations',
        role: 'staff',
      };

      const token = signToken(staffUser);
      const response = NextResponse.json({
        success: true,
        role: 'staff',
        redirectUrl: '/staff',
        user: staffUser,
      });

      response.cookies.set('eventpilot_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 3. Check Student Account (lookup by email or username in database)
    const user = getUserByUsernameOrEmail(identifier);
    if (!user) {
      return NextResponse.json({
        error: 'Invalid credentials. For Admin use "admin / admin2026", for Staff use "staff / staff2026", or register a student account.',
      }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const studentUser = {
      id: user.id,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      fullName: user.fullName,
      college: user.college,
      role: 'student',
    };

    const token = signToken(studentUser);
    const response = NextResponse.json({
      success: true,
      role: 'student',
      redirectUrl: '/',
      user: studentUser,
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
