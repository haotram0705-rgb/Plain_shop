import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/dang-nhap';
  const hasSession = request.cookies.get('plant_shop_session')?.value === 'admin';

  if (isAdminRoute && !hasSession) {
    const loginUrl = new URL('/admin/dang-nhap', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/admin/dang-nhap' && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
