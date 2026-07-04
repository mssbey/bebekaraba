import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Admin paneli — giriş gerektir
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/admin', req.url));
  }
});

export const config = {
  matcher: [
    '/admin/:path*',
    // API'leri middleware'de korumak yerine route handler'da kontrol ediyoruz
  ],
};
