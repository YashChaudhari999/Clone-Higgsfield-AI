import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect all /dashboard routes.
 * Supabase @supabase/supabase-js with persistSession=true stores the session
 * under cookies prefixed with 'sb-' followed by the project ref.
 * We check for any such cookie to determine if a session exists.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    // Supabase session cookies are prefixed with 'sb-' and contain '-auth-token'
    const cookies = request.cookies.getAll();
    const hasSession = cookies.some(
      (cookie) =>
        cookie.name.includes('-auth-token') ||
        cookie.name === 'sb-access-token' ||
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

    if (!hasSession) {
      const signInUrl = new URL('/auth?mode=signin', request.url);
      // Preserve the intended destination for post-login redirect
      signInUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Apply the middleware to all dashboard paths.
 */
export const config = {
  matcher: ['/dashboard/:path*'],
};
