import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const PROTECTED_PREFIX = '/dashboard';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !hasRefreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|static/).*)'],
};
