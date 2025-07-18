import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect old dashboard routes to new academy routes
  if (pathname.startsWith('/dashboard')) {
    const newPathname = pathname.replace('/dashboard', '/academy');
    return NextResponse.redirect(new URL(newPathname, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};