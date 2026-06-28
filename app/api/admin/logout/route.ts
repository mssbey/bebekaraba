import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const loginUrl = new URL('/admin/login', request.url);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('admin_session');
  return response;
}
