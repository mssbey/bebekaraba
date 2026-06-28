import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TOKEN = 'ba_admin_2025_secure';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAuthApi = pathname === '/api/admin/auth';
  const sessionToken = request.cookies.get('admin_session')?.value;
  const isAuthenticated = sessionToken === ADMIN_TOKEN;

  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAdminApi && !isAuthApi && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protect product mutations (create/update/delete); GET stays public
  const isProductApi = pathname.startsWith('/api/products');
  if (isProductApi && request.method !== 'GET' && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/products/:path*'],
};

export { ADMIN_TOKEN };
