import { NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';
import { getUserByUsernameOrEmail, addUser } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, fullName, username, phone, college } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password, and full name are required' }, { status: 400 });
    }

    const cleanUsername = (username || email.split('@')[0]).trim().toLowerCase();

    // Prevent registering system reserved usernames
    if (['admin', 'staff', 'root', 'administrator'].includes(cleanUsername)) {
      return NextResponse.json({ error: 'This username is reserved for system operators' }, { status: 400 });
    }

    const existingUser = getUserByUsernameOrEmail(email) || getUserByUsernameOrEmail(cleanUsername);
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email or username already exists' }, { status: 400 });
    }

    // Clean phone number to avoid formula injection in sheets (+91 -> 91)
    const cleanPhone = (phone || '').replace(/^\+/, '').trim();

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      username: cleanUsername,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      phone: cleanPhone,
      college: college || '',
      role: 'student',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    const studentUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      college: newUser.college,
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
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
