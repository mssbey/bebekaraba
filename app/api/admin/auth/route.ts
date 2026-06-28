import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@bebekarabaciniz.com';
const ADMIN_PASSWORD = 'Admin123456!';
const ADMIN_TOKEN = 'ba_admin_2025_secure';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', ADMIN_TOKEN, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
