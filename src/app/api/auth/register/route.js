import { NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';
import { getUserByEmail, addUser } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone, college } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password, and full name are required' }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      email,
      fullName,
      phone: phone || '',
      college: college || '',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    const token = signToken({ id: newUser.id, email: newUser.email, fullName: newUser.fullName });

    const response = NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName, college: newUser.college },
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
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
