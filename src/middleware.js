import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow static assets, favicon, images, and public auth APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('eventpilot_session')?.value;

  // If visiting /login:
  if (pathname === '/login') {
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
        if (payload.role === 'staff') return NextResponse.redirect(new URL('/staff', request.url));
        return NextResponse.redirect(new URL('/', request.url));
      } catch (e) {
        // Corrupt token, allow login
      }
    }
    return NextResponse.next();
  }

  // All other pages require login before entering the site
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Role validation
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    // Only Admin can access /admin
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Only Staff and Admin can access /staff
    if (pathname.startsWith('/staff') && payload.role !== 'staff' && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (e) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('eventpilot_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
