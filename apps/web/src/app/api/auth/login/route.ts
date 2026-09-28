import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || body?.email !== email || body?.password !== password) {
    return NextResponse.json({ message: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, role: 'admin' });
  response.cookies.set('plant_shop_session', 'admin', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  return response;
}
